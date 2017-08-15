import d3 =require("d3")
import _ =require("lodash")
import {Util}from "../../../Core/Util"
import {BaseChart,SingleDataChart} from "../../../Core/BaseChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"

export class DashLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change data_change",()=>{
                this.update()
            })
        })
    }
    config:DashLayerConfig
    defaultConfig():DashLayerConfig{
        return Util.deepExtend(super.defaultConfig(),{
            className:"dashpie",
            padding:25,
            dataFomate(v){
                return (+v).toFixed(1)+"Km/H"
            },
            rangeMax: 100,
            oldData:0,
            colorDomain: [0,0.5,1],
            colorRange: ["red","yellow","green"]
        })
    }

    chart:SingleDataChart

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let smartArcGen = function(startAngle, endAngle, innerRadius, outerRadius) {
            let largeArc = ((endAngle - startAngle) % (Math.PI * 2)) > Math.PI ? 1 : 0,
                startX = centerX + Math.cos(startAngle) * outerRadius,
                startY = centerY + Math.sin(startAngle) * outerRadius,
                endX2 = centerX + Math.cos(startAngle) * innerRadius,
                endY2 = centerY + Math.sin(startAngle) * innerRadius,
                endX = centerX + Math.cos(endAngle) * outerRadius,
                endY = centerY + Math.sin(endAngle) * outerRadius,
                startX2 = centerX + Math.cos(endAngle) * innerRadius,
                startY2 = centerY + Math.sin(endAngle) * innerRadius
            let cmd = [
                'M', startX, startY,
                'A', outerRadius, outerRadius, 0, largeArc, 1, endX, endY,
                'L', startX2, startY2,
                'A', innerRadius, innerRadius, 0, largeArc, 0, endX2, endY2,
                'Z'
            ]
            return cmd.join(' ')
        }
        let width=Util.toPixel(this.config.style.width)
        let height=Util.toPixel(this.config.style.height)
        let outerRadius = width/ 2 - this.config.padding ,
            innerRadius = width / 5,
            centerX = width / 2,
            centerY = height- this.config.padding 
        let self = this
        let ds = this.chart.getData()
        if(!ds){
            return 
        }
        let curRadio = ds / this.config.rangeMax > 1 ? 1 : ds / this.config.rangeMax
        let oldRadio = this.config.oldData / this.config.rangeMax > 1 ? 1 : this.config.oldData / this.config.rangeMax
        let startAngle = -Math.PI,
            curEndAngle = startAngle + curRadio * Math.PI,
            oldEndAngle = startAngle + oldRadio * Math.PI
        let dashGroup = svgNode.append("g").attr("class","dashGroup")
        dashGroup.append("path").attr("d",smartArcGen(-Math.PI,0,innerRadius,outerRadius))
                 .classed("basebackground",true)
        dashGroup.append("path").attr("d",smartArcGen(startAngle,oldEndAngle,innerRadius,outerRadius))
                 .attr("fill","none")
                 .classed("dashvaluebackground",true)
                 .transition().duration(1000).ease(d3.easeLinear)
                 .tween("dashTran",function(){
                     let node = d3.select(this)
                     let angleInterpolate = d3.interpolate(oldEndAngle,curEndAngle),
                         colorInterpolate = d3.interpolate(oldRadio, curRadio)
                     return function(t) {
                         node.attr("fill",d3.scaleLinear().domain(self.config.colorDomain).range(self.config.colorRange)(colorInterpolate(t)))
                         node.attr("d",smartArcGen(startAngle,angleInterpolate(t),innerRadius,outerRadius))
                     }
                 })          

        this.config.oldData = ds      
        
        dashGroup.append("text").attr("class","dataValue")
                 .attr("x",centerX)
                 .attr("y",centerY)
                 .text(this.config.dataFomate(ds))
        
        dashGroup.append("text").attr("class","rangeMin")
                 .attr("x",centerX - innerRadius - (outerRadius-innerRadius)/2)
                 .attr("y",centerY)
                 .attr("dy",Util.getStringRect("0","",14).height)
                 .text("0")
        dashGroup.append("text").attr("class","rangeMax")
                 .attr("x",centerX + innerRadius + (outerRadius-innerRadius)/2)
                 .attr("y",centerY)
                 .attr("dy",Util.getStringRect("0","",14).height)
                 .text(this.config.rangeMax)
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface DashLayerConfig extends ILayerConfig{
        rangeMax?:number,
        padding?:number,
        dataFomate?(n:string|number):string,
        oldData?:number,
        colorDomain?:number[]
        colorRange?:any[]
}
        

export class DashChart extends SingleDataChart{
    dashLayer: DashLayer
    
    constructor(conf?){
        super(conf)
        this.dashLayer = new DashLayer("dashpie",{
            style:{
                width:()=>this.config.style.width,
                height:()=>this.config.style.height
            },
            padding:Util.toPixel("2rem")
        })
        this.dashLayer.addTo(this)
    }

    setConfig(c:DashLayerConfig){
        this.dashLayer.setConfig(_.pick(c,"rangeMax"))
    }
}
