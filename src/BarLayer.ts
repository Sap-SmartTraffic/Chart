import d3 = require("d3")
import _ = require("underscore")
import Util = require("Util")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"

export class BarLayer extends BaseLayer {
    constructor(id?, conf?) {
        super()
        this.setConfig(conf)
    }

    config: {
        className: string
    }

    drawer(svgNode) {
        let ds = this.chart.measures
        let maxX = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x"),
            maxY = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")
        let xScale = d3.scaleBand().domain(d3.range(ds.length)).rangeRound([0, Util.toPixel(this.layout.width)])
        let yScale = d3.scaleLinear().domain([0,maxY]).range([Util.toPixel(this.layout.height),0])
        _.each(ds,(d,i)=>{
            svgNode.append("rect").attr("x",xScale(i)).attr("y",yScale(d.data[i].y))
        })
    }

    renderer() {
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").classed(this.config.className, () => !!this.config.className)
        this.drawer(svg)
        return svg.node()
    }
}