import d3 = require("d3")
import _ = require("underscore")
import Util = require("Util")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
export class AxisLayer extends BaseLayer {
    config={
        tickSize: "6px",
        tickPadding: "3px",
        smallPadding: "10px",
        xAxisTitle: "",
        yAxisTitle: "",
        className: ""
    }
    

    constructor(id?, conf?) {
        super(id, conf)
        this.setConfig(conf)
    }

    calculateExtremum() {
        let ds = this.chart.measures
        let maxX = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x"),
            maxY = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y"),
            minX = Util.min(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x"),
            minY = Util.min(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")

        return {minX:minX, maxX:maxX, minY:minY, maxY:maxY}
    }

    calculateYaxisWidth(): number {
        let valueString = this.calculateExtremum().maxY.toString()
        return Util.toPixel(this.config.tickSize) + Util.toPixel(this.config.tickPadding) + Util.getStringRect(valueString).width
    }

    calculateXaxisHeight(): number {
        let valueString = this.calculateExtremum().maxX.toString()
        return Util.toPixel(this.config.tickSize) + Util.toPixel(this.config.tickPadding) + Util.getStringRect(valueString).height
    }

    calculateAxisTitle(value: string) {
        return Util.getStringRect(value)
    }

    calculatePaddingLeft() {
        return this.calculateYaxisWidth() + this.calculateAxisTitle(this.config.yAxisTitle).height + Util.toPixel(this.config.smallPadding)
    }

    calculatePaddingBottom() {
        return this.calculateXaxisHeight() + this.calculateAxisTitle(this.config.xAxisTitle).height + Util.toPixel(this.config.smallPadding)
    }


    drawer(svgNode) {
        let maxX = this.calculateExtremum().maxX
        let maxY = this.calculateExtremum().maxY
        let yAxisWidth = this.calculateYaxisWidth()
        let xAxisHeight = this.calculateXaxisHeight()
        let yAxisTitleHeight = this.calculateAxisTitle(this.config.yAxisTitle).height
        let xAxisTitleHeight = this.calculateAxisTitle(this.config.xAxisTitle).height
        let yAxisTitleWidth = this.calculateAxisTitle(this.config.yAxisTitle).width
        let xAxisTitleWidth = this.calculateAxisTitle(this.config.xAxisTitle).width
        
        let xScale = d3.scaleLinear().domain([0,maxX]).range([0,Util.toPixel(this.layout.width) - this.calculatePaddingLeft() - Util.toPixel(this.config.smallPadding)])
        let yScale = d3.scaleLinear().domain([0,maxY]).range([Util.toPixel(this.layout.height) - this.calculatePaddingBottom() - Util.toPixel(this.config.smallPadding),0])
        
        let xAxis = d3.axisBottom(xScale)
        let yAxis = d3.axisLeft(yScale)
        
        let gXAxis = svgNode.append("svg:g").attr("id","xAxis").call(xAxis).attr("transform", "translate(" + this.calculatePaddingLeft() + "," + (Util.toPixel(this.layout.height) - this.calculatePaddingBottom()) + ")")
        let gYAxis = svgNode.append("svg:g").attr("id","yAxis").call(yAxis).attr("transform", "translate(" + this.calculatePaddingLeft() + "," + Util.toPixel(this.config.smallPadding) + ")")
        
        let xAxisTitle = svgNode.append("svg:text").attr("class", "AxisTitle").attr("id", "xAxisTitle").text(this.config.xAxisTitle).attr("transform","translate(" + (Util.toPixel(this.layout.width) + this.calculatePaddingLeft() - xAxisTitleWidth ) / 2 + "," + (Util.toPixel(this.layout.height) - xAxisTitleHeight) + ")")
        let yAxisTitle = svgNode.append("svg:text").attr("class", "AxisTitle").attr("id", "yAxisTitle").text(this.config.yAxisTitle).attr("transform","rotate(-90),translate(" + (0 - (Util.toPixel(this.layout.height) - this.calculatePaddingBottom() + yAxisTitleWidth) /2 + "," + yAxisTitleHeight + ")"))
        
        return this
    }

    renderer() {
        let conf = this.chart.config
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").classed(this.config.className, () => !!this.config.className)
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


