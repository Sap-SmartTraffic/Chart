import d3 = require("d3")
import _ = require("underscore")
import Util = require("../Core/Util")
import {BaseLayer,ILayerConfig} from "../Core/BaseLayer"

export class FocusPanel extends BaseLayer {
    config: FocusPanelConfig
    defaultConfig():FocusPanelConfig {
        return {
            tagName: "svg",
            className: "focusPanel",
            style: {
                top: "0px",
                left: "0px",
                bottom: "null",
                right: "null",
                position: "absolute",
                "z-index": 0,
                width: "50rem",
                height: "10rem"
            },
            rangeMin:"6",
            rangeMax:"18",
            focusTime:"12",
            padding:20
        }
    }

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        svgNode.append("rect").attr("class","panel")
               .attr("x",this.config.padding)
               .attr("y",this.config.padding)
               .attr("width",Util.toPixel(this.config.style.width) - this.config.padding * 2)
               .attr("height",Util.toPixel(this.config.style.height)-this.config.padding * 2)
               .attr("fill","aqua")
        
        let parseTime = d3.timeParse("%H")
        let xScale = d3.scaleTime()
                       .domain([parseTime(this.config.rangeMin),parseTime(this.config.rangeMax)])
                       .range([this.config.padding,Util.toPixel(this.config.style.width)-this.config.padding])
        let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M"))
        svgNode.append("g").attr("class","axis xAxis")
               .attr("transform","translate(0,"+(Util.toPixel(this.config.style.height)-this.config.padding)+")")
               .call(xAxis)
               
        let focusTime = parseTime(this.config.focusTime)
        let self = this
        let drag = d3.drag()
                     .on("start",function(){
                         svgNode.style("cursor","col-resize")
                     })
                     .on("drag",function(){
                         if(xScale.invert(d3.event.x)>=parseTime(self.config.rangeMin)&&xScale.invert(d3.event.x)<=parseTime(self.config.rangeMax)){
                             d3.select(this).attr("x1",d3.event.x).attr("x2",d3.event.x)
                             self.chart.fire("dragLine",{time:xScale.invert(d3.event.x)})
                         }   
                     })
                     .on("end",function(){
                         svgNode.style("cursor","default")
                     })
        svgNode.append("line").attr("class","focusLine")
               .attr("x1",xScale(focusTime)).attr("y1",Util.toPixel(this.config.style.height)-this.config.padding)
               .attr("x2",xScale(focusTime)).attr("y2",this.config.padding)
               .on("mouseenter",function(){
                   svgNode.style("cursor","col-resize")
               })
               .on("mouseleave",function(){
                   svgNode.style("cursor","default")
               })
               .call(drag)
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

interface FocusPanelConfig extends ILayerConfig {
    rangeMin: string,
    rangeMax: string,
    focusTime: string,
    padding: number
}