import d3 = require("d3")
import _ = require("underscore")
import Util = require("./Util")
import {Measure} from "./Measure"
import {Evented} from "./Evented"
import {BaseLayer} from "./BaseLayer"

export class RangeLayer extends BaseLayer {
    constructor(id?, conf?) {
        super()
        this.setConfig(conf)
    }
    
    config: {
        className: string
    }

    curveTypeMap = {
        linear: d3.curveLinear,
        basis: d3.curveBasis,
        cardinal: d3.curveCardinal,
        step: d3.curveStep
    }

    drawer(svgNode,curveType) {
        let ds = this.chart.measures
        let maxX = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x"),
            maxY0 = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y0"),
            maxY1 = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y1")
        let maxY = Math.max(maxY0,maxY1)
        let xScale = d3.scaleLinear().domain([0, maxX]).range([0, Util.toPixel(this.layout.width)])
        let yScale = d3.scaleLinear().domain([0,maxY]).range([Util.toPixel(this.layout.height),0])
        _.each(ds, (d,i)=>{
            let area = d3.area().x((d)=>{return xScale(d.x)}).y0((d)=>{return yScale(d.y0)}).y1((d)=>{return yScale(d.y1)}).curve(this.curveTypeMap[curveType])
            svgNode.append("svg:g").append("path").attr("d",area(d.data)).attr("stroke","black").attr("stroke-width","3px").attr("fill",d.style.color||this.chart.getColor(i))
        })
    }

    renderer() {
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").classed(this.config.className, () => !!this.config.className)
        this.drawer(svg,"linear")
        return svg.node()
    }
}