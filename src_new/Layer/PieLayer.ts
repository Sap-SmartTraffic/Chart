import d3 = require("d3")
import _ = require("underscore")
import {Util} from "../Core/Util"
import {BaseLayer, ILayerConfig} from "../Core/BaseLayer"

export class PieLayer extends BaseLayer {
    config: PieLayerConfig
    defaultConfig(): PieLayerConfig {
        return {
            tagName: "svg",
            className: "pieChart",
            style: {
                top: "0px",
                left: "0px",
                bottom: null,
                right: null,
                position: "absolute",
                "z-index": 0,
                width: "200rem",
                height: "100rem"
            },
            segmentCount: 12,
            segmentStart: 0,
            padding: 10,
            colorDomain: [0,50,100],
            colorRange: ["red","yellow","green"]
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

        let ds = this.chart.getFirstMeasure("pie")
        if(!ds){
            return 
        }
        let colorScale = d3.scaleLinear().domain(this.config.colorDomain).range(this.config.colorRange)
        let doughnutGroup = svgNode.append("g").attr("class","doughnutGroup")
        _.each(ds.data,(d,i)=>{
            let startAngle = -Math.PI / 2 + segmentAngle * i,
                endAngle = startAngle + segmentAngle
            doughnutGroup.append("path")
                         .attr("class","doughnut doughnut"+i)
                         .attr("fill",d.value==null?"#d6d6d6":colorScale(d.value))
                         .attr("d",smartArcGen(startAngle,startAngle,innerRadius,outerRadius))
                         .attr("stroke-width","0px")
                         .attr("stroke",d.value==null?"#d6d6d6":colorScale(d.value))
                         .on("mouseenter",function(e){
                             svgNode.selectAll(".doughnut").style("opacity","0.3")
                             svgNode.select(".doughnut"+i).transition().duration(200).style("opacity","1")
                         })
                         .on("mousemove",function(e){
                            
                         })
                         .on("mouseleave",function(){
                             svgNode.selectAll(".doughnut").style("opacity","1")
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
    segmentCount: number,
    segmentStart: number,
    padding: number,
    colorDomain: number[],
    colorRange: any[]
}