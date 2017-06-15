import d3 = require("d3")
import _ = require("underscore")
import Util = require("../Core/Util")
import {BaseLayer,ILayerConfig} from "../Core/BaseLayer"

export class DashLayer extends BaseLayer {
    defaultConfig():DashLayerConfig{
        return {
                tagName:"svg",
                className:"dashpie",
                style:{
                    top:"0px",
                    left:"0px",
                    bottom:null,
                    right:null,
                    position:"absolute",
                    "z-index":0,
                    width:"300px",
                    height:"300px"
                },
                padding:25,
                dataFomate(v){
                    return (+v).toFixed(1)+"Km/H"
                },
                rangeMax: 100,
                oldData:0,
            }
    }
    config:DashLayerConfig

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
        
        let ds = this.chart.getFirstMeasure("dash")
        if(!ds){
            return 
        }
        let curRadio = ds.data / this.config.rangeMax > 1 ? 1 : ds.data / this.config.rangeMax
        let oldRadio = this.config.oldData / this.config.rangeMax > 1 ? 1 : this.config.oldData / this.config.rangeMax
        let startAngle = -Math.PI,
            curEndAngle = startAngle + curRadio * Math.PI,
            oldEndAngle = startAngle + oldRadio * Math.PI
        let dashGroup = svgNode.append("g").attr("class","dashGroup")
        dashGroup.append("path").attr("d",smartArcGen(-Math.PI,0,innerRadius,outerRadius)).attr("fill","#d6d6d6")
        dashGroup.append("path").attr("d",smartArcGen(startAngle,oldEndAngle,innerRadius,outerRadius))
                 .attr("fill","#d6d6d6")
                 .transition().duration(1000).ease(d3.easeLinear)
                 .tween("dashTran",function(){
                     let node = d3.select(this)
                     let angleInterpolate = d3.interpolate(oldEndAngle,curEndAngle),
                         colorInterpolate = d3.interpolate(oldRadio, curRadio)
                     return function(t) {
                         node.attr("fill",d3.scaleLinear().domain([0, 0.5, 1]).range(["red", "yellow","green"])(colorInterpolate(t)))
                         node.attr("d",smartArcGen(startAngle,angleInterpolate(t),innerRadius,outerRadius))
                     }
                 })          

        this.config.oldData = ds.data       
        
        dashGroup.append("text").attr("class","dataValue")
                 .attr("x",centerX)
                 .attr("y",centerY)
                 .attr("text-anchor","middle")
                 .attr("font-size","32px")
                 .text(this.config.dataFomate(ds.data))
        
        dashGroup.append("text").attr("class","rangeMin")
                 .attr("x",centerX - innerRadius - (outerRadius-innerRadius)/2)
                 .attr("y",centerY)
                 .attr("dy",Util.getStringRect("0","",14).height)
                 .attr("text-anchor","middle")
                 .text("0")
                 .attr("font-size","14px")
        dashGroup.append("text").attr("class","rangeMax")
                 .attr("x",centerX + innerRadius + (outerRadius-innerRadius)/2)
                 .attr("y",centerY)
                 .attr("dy",Util.getStringRect("0","",14).height)
                 .attr("text-anchor","middle")
                 .text(this.config.rangeMax)
                 .attr("font-size","14px")
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}
interface DashLayerConfig extends ILayerConfig{
        rangeMax:number,
        padding:number,
        dataFomate(n:string|number):string,
        oldData:number
}
