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
        let series = ds.length
        let xMarks = ds[0].data.length
        let maxY = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")
        let xScale = d3.scaleBand().domain(_.range(xMarks)).rangeRound([0, Util.toPixel(this.layout.width)]).paddingInner(0.1).paddingOuter(0.2)
        let seriesScale = d3.scaleBand().domain(_.range(series)).rangeRound([0,xScale.bandwidth()])
        let yScale = d3.scaleLinear().domain([0,maxY]).range([0,Util.toPixel(this.layout.height)])
        _.each(ds,(d,i)=>{
            let group = svgNode.append("g").attr("class","series"+i).attr("transform","translate("+ (i * seriesScale.bandwidth()) +",0)")
            _.each(d.data, (v,k)=>{
                group.append("rect").attr("id","rect"+k)
                     .attr("x",xScale(k)).attr("y",Util.toPixel(this.layout.height))
                     .attr("width",seriesScale.bandwidth()).attr("height",yScale(v.y))
                     .attr("fill",this.chart.getColor(i))
                     .on("mousemove",()=>{this.chart.fire("showTooltip",{xMark:v.x,series:d.id,value:v.y})})
                     .on("mouseleave",()=>{this.chart.fire("hideTooltip")})
                     .transition().duration(1000)
                     .attr("y",Util.toPixel(this.layout.height) - yScale(v.y))
            })
        })
    }

    renderer() {
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").classed(this.config.className, () => !!this.config.className)
        this.drawer(svg)
        return svg.node()
    }
}