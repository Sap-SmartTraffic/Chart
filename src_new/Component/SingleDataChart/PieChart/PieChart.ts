import d3 =require("d3")
import _ =require("lodash")
import {Util}from "../../../Core/Util"
import {BaseChart,SingleDataChart} from "../../../Core/BaseChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"

export class PieLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change data_change",()=>{
                this.update()
            })
        })
    }
    config: PieLayerConfig
    defaultConfig(): PieLayerConfig {
        return Util.deepExtend(super.defaultConfig(),{
            className: "pieChart",
            segmentCount: 12,
            segmentStart: 18,
            padding: 10,
            colorDomain: [0,50,100],
            colorRange: ["red","yellow","green"]
        })
    }

    chart:SingleDataChart

    getParseData():IPieData[] {
        let data = this.chart.getData()
        if(_.isNaN(data)||_.isUndefined(data)) {
            return []
        }
        else if(_.isArray(data)) {
            let count = this.config.segmentCount,
                start = this.config.segmentStart
            let dataset = []
            for(let i = 0; i < count; i++) {
                dataset.push({"time":(start+i)>24? (start+i-24):(start+i),"value":null})
            }
            for(let i = 0; i < data.length; i++) {
                let index = _.findIndex(dataset,{"time":data[i].time})
                dataset[index] = data[i]
            }
            return dataset
        }
        else {
            return []
        }
    }

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

        let width = Util.toPixel(this.config.style.width),
            height = Util.toPixel(this.config.style.height)
        
        let centerX = width / 2,
            centerY = height / 2,
            outerRadius = Math.min(width,height) / 2 - this.config.padding,
            innerRadius = outerRadius / 2,
            segmentAngle = 2 * Math.PI / this.config.segmentCount

        let ds = this.getParseData()
        if(!ds){
            return 
        }
        let colorScale = d3.scaleLinear().domain(this.config.colorDomain).range(this.config.colorRange)
        let doughnutGroup = svgNode.append("g").attr("class","doughnutGroup")
        _.each(ds,(d,i)=>{
            let startAngle = -Math.PI / 2 + segmentAngle * i,
                endAngle = startAngle + segmentAngle
            doughnutGroup.append("path")
                         .attr("class","doughnut doughnut"+i)
                         .attr("fill",d.value==null?"#d6d6d6":colorScale(d.value))
                         .attr("d",smartArcGen(startAngle,startAngle,innerRadius,outerRadius))
                         .attr("stroke-width","0px")
                         .attr("stroke",d.value==null?"#d6d6d6":colorScale(d.value))
                         .on("mouseenter",function(e){
                             svgNode.select(".doughnut"+i)
                                    .transition().duration(100)
                                    .attr("d",smartArcGen(startAngle,endAngle,innerRadius,(outerRadius+20)))
                         })
                         .on("mousemove",function(e){
                            
                         })
                         .on("mouseleave",function(){
                             svgNode.select(".doughnut"+i)
                                    .transition().duration(100)
                                    .attr("d",smartArcGen(startAngle,endAngle,innerRadius,outerRadius))
                                    
                         })
                         .transition().duration(100).ease(d3.easeLinear).delay(100*i)
                         .tween("pieTran", function(){
                             let node = d3.select(this)
                             return function(t){
                                 node.attr("stroke-width","0.5px")
                                 let interpolate = d3.interpolate(startAngle,endAngle)
                                 node.attr("d",smartArcGen(startAngle,interpolate(t),innerRadius,outerRadius)) 
                             }
                         })
        })
        return this
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }

}

export interface PieLayerConfig extends ILayerConfig {
    segmentCount?: number,
    segmentStart?: number,
    padding?: number,
    colorDomain?: number[],
    colorRange?: any[]
}

export interface IPieData {
    time:number
    value:number
}

export class PieChart extends SingleDataChart {
    pieLayer:PieLayer

    constructor(conf?) {
        super(conf)
        this.pieLayer = new PieLayer("pie",{
            style: {
                width: ()=>this.config.style.width,
                height: ()=>this.config.style.height
            },
            padding: Util.toPixel("1.5rem")
        })
        this.pieLayer.addTo(this)
    }

    setConfig(c:PieLayerConfig){
        this.pieLayer.setConfig(_.pick(c,"segmentCount","segmentStart","padding","colorDomain","colorRange"))
    }
}

