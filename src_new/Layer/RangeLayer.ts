import d3 = require("d3")
import _ = require("underscore")
import Util = require("../Core/Util")
import {BaseLayer, ILayerConfig} from "../Core/BaseLayer"

export class RangeLayer extends BaseLayer {
    config:RangeLayerConfig
    defaultConfig():RangeLayerConfig {
        return {
            tagName:"svg",
            className: "rangeChart",
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
            padding: {
                top:"10px",
                right:"10px",
                bottom:"20px",
                left:"40px"
            }
        }
    }

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let ds = this.chart.getFirstMeasure("range")
        if(!ds){
            return 
        }
        let maxY = Util.max(ds.data,"max"),
            minY = Util.min(ds.data,"min")
        let width = Util.toPixel(this.config.style.width) - Util.toPixel(this.config.padding.left)-Util.toPixel(this.config.padding.right)
        let height = Util.toPixel(this.config.style.height) - Util.toPixel(this.config.padding.top)-Util.toPixel(this.config.padding.bottom)
        let xScale = d3.scaleTime()
                       .domain(d3.extent(ds.data,(d)=>{return d.time}))
                       .range([Util.toPixel(this.config.padding.left),width])
        let yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([height,Util.toPixel(this.config.padding.top)])
        let xAxis = d3.axisBottom(xScale).ticks(24).tickFormat(d3.timeFormat("%H:%M")),
            yAxis = d3.axisLeft(yScale)
        svgNode.append("g").attr("class","axis xAxis")
               .attr("transform","translate(0,"+(height+Util.toPixel(this.config.padding.top))+")")
               .call(xAxis)
        svgNode.append("g").attr("class","axis yAxis")
               .attr("transform","translate("+ Util.toPixel(this.config.padding.left)+","+Util.toPixel(this.config.padding.top)+")")
               .call(yAxis)
        
        let area = d3.area()
                     .x((d)=>{return xScale(d.time)})
                     .y0((d)=>{return yScale(d.min)})
                     .y1((d)=>{return yScale(d.max)})
        svgNode.append("g").attr("class","areaGroup").append("path")
               .attr("class","area").attr("d",area(ds.data))
        
        svgNode.append("line").attr("class","focusLine")
               .attr("x1",xScale(d3.timeParse("%H")("12")))
               .attr("y1",height+Util.toPixel(this.config.padding.top))
               .attr("x2",xScale(d3.timeParse("%H")("12")))
               .attr("y2",Util.toPixel(this.config.padding.top))
        
        this.chart.on("dragLine",function(d){
            svgNode.select(".focusLine").attr("x1",xScale(d.time)).attr("x2",xScale(d.time))
        })
    }

    // setFocusLine(time) {
    //     d3.select(".focusLine").attr("x1",xScale(time)).attr("x2",xScale(time))
    // }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

interface RangeLayerConfig extends ILayerConfig {
    padding: {
        top: string|undefined|null,
        right: string|undefined|null,
        bottom: string|undefined|null,
        left: string|undefined|null
    }
}

