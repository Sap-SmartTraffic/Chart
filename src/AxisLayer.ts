import d3 = require("d3")
import _ = require("underscore")
import Util = require("Util")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
export class AxisLayer extends BaseLayer {
    config={
        type: "",
        ticks: 5,
        tickSize: "6px",
        tickPadding: "3px",
        smallPadding: "10px",
        xAxisTitle: "",
        yAxisTitle: "",
        verticalGridLine: true,
        horizontalGridLine: true,
        className: ""
    }
    
    constructor(id?, conf?) {
        super(id, conf)
        this.setConfig(conf)
    }

    calculateYaxisWidth() {
        let valueString = this.calculateExtremum().maxY.toString()
        return Util.toPixel(this.config.tickSize) + Util.toPixel(this.config.tickPadding) + Util.getStringRect(valueString).width
    }

    calculateXaxisHeight() {
        let valueString = this.calculateExtremum().maxX.toString()
        return Util.toPixel(this.config.tickSize) + Util.toPixel(this.config.tickPadding) + Util.getStringRect(valueString).height
    }

    calculatePaddingLeft() {
        return this.calculateYaxisWidth() + Util.getStringRect(this.config.yAxisTitle).height + Util.toPixel(this.config.smallPadding)
    }

    calculatePaddingBottom() {
        return this.calculateXaxisHeight() + Util.getStringRect(this.config.xAxisTitle).height + Util.toPixel(this.config.smallPadding)
    }

    calculateExtremum() {
        let ds = this.chart.measures
        let maxX, maxY, minX, minY
        maxX = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x")
        minX = Util.min(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x")
        if("y" in ds[0].data[0]) {
            maxY = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")
            minY = Util.min(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")
        }
        else { 
            let maxY0 = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y0"),
                maxY1 = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y1"),
                minY0 = Util.min(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y0"),
                minY1 = Util.min(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y1")
            maxY = Math.max(maxY0,maxY1)
            minY = Math.min(minY0,minY1)
        }
        return {minX:minX, maxX:maxX, minY:minY, maxY:maxY}
    }
    
    getXScale() {
        if(this.config.type == "line") {
            let maxX = this.calculateExtremum().maxX
            return d3.scaleLinear().domain([0,maxX]).range([0,Util.toPixel(this.layout.width) - this.calculatePaddingLeft() - Util.toPixel(this.config.smallPadding)])
        }
        else if(this.config.type == "ordinal") {
            let ds = this.chart.measures[0].data
            let domain = []
            _.each(ds, (d,i)=>{
                domain.push(d.x)
             })
            return d3.scaleBand().domain(domain).range([0,Util.toPixel(this.layout.width) - this.calculatePaddingLeft() - Util.toPixel(this.config.smallPadding)]).paddingInner(0.1).paddingOuter(0.2)
        }
        else if(this.config.type == "time") {

        }
    }

    getYScale() {
        let maxY = this.calculateExtremum().maxY 
        return d3.scaleLinear().domain([0,maxY]).range([Util.toPixel(this.layout.height) - this.calculatePaddingBottom() - Util.toPixel(this.config.smallPadding),0])
    }

    drawer(svgNode) {
        let yAxisWidth = this.calculateYaxisWidth()
        let xAxisHeight = this.calculateXaxisHeight()
        let yAxisTitleHeight = Util.getStringRect(this.config.yAxisTitle).height
        let xAxisTitleHeight = Util.getStringRect(this.config.xAxisTitle).height
        let yAxisTitleWidth = Util.getStringRect(this.config.yAxisTitle).width
        let xAxisTitleWidth = Util.getStringRect(this.config.xAxisTitle).width
        
        let xScale = this.getXScale()
        let yScale = this.getYScale()
        
        if(this.config.verticalGridLine) {
            let xInner = d3.axisBottom(xScale).tickSize(Util.toPixel(this.layout.height) - this.calculatePaddingBottom() - Util.toPixel(this.config.smallPadding)).tickFormat("")
            svgNode.append("svg:g").call(xInner).attr("transform", "translate(" + this.calculatePaddingLeft() + "," + Util.toPixel(this.config.smallPadding) + ")").attr("class","grid-line")
        }
        
        if(this.config.horizontalGridLine) {
            let yInner = d3.axisLeft(yScale).tickSize(Util.toPixel(this.layout.width) - this.calculatePaddingLeft() - Util.toPixel(this.config.smallPadding)).tickFormat("")
            svgNode.append("svg:g").call(yInner).attr("transform", "translate(" + (Util.toPixel(this.layout.width) - Util.toPixel(this.config.smallPadding)) + "," + Util.toPixel(this.config.smallPadding) + ")").attr("class","grid-line")
        }
        
        let xAxis = d3.axisBottom(xScale)
        svgNode.append("svg:g").attr("class","axis").call(xAxis).attr("transform", "translate(" + this.calculatePaddingLeft() + "," + (Util.toPixel(this.layout.height) - this.calculatePaddingBottom()) + ")")
        let yAxis = d3.axisLeft(yScale)
        svgNode.append("svg:g").attr("class","axis").call(yAxis).attr("transform", "translate(" + this.calculatePaddingLeft() + "," + Util.toPixel(this.config.smallPadding) + ")")
        
        svgNode.append("svg:text").attr("class", "AxisTitle").attr("id", "xAxisTitle").text(this.config.xAxisTitle).attr("transform","translate(" + (Util.toPixel(this.layout.width) + this.calculatePaddingLeft() - xAxisTitleWidth ) / 2 + "," + (Util.toPixel(this.layout.height) - xAxisTitleHeight) + ")")
        svgNode.append("svg:text").attr("class", "AxisTitle").attr("id", "yAxisTitle").text(this.config.yAxisTitle).attr("transform","rotate(-90),translate(" + (0 - (Util.toPixel(this.layout.height) - this.calculatePaddingBottom() + yAxisTitleWidth) /2 + "," + yAxisTitleHeight + ")"))
         
        return this
    }

    renderer() {
        let conf = this.chart.config
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("div").append("svg").classed(this.config.className, () => !!this.config.className)
        this.drawer(svg)
        return svg.node()
    }

    updateDom() {
        let svg=d3.select(this.el)
        svg.selectAll("*").remove()
        this.drawer(svg)
        return this
    }
}


