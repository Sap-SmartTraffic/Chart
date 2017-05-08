import d3 = require("d3")
import _ = require("underscore")
import Util=require("Util")
import {
    Evented
} from "Evented"
import {
    BaseLayer
} from "BaseLayer"
export class LineLayer extends BaseLayer {
    constructor(conf ? ) {
        super(conf)
    }
    config: {
        className: string
    }
    init() {
       
    }
    drawer(svgNode){
        let ds = this.chart.measures
        let maxX = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x"),
            maxY = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y"),
            minX = Util.min(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x"),
            minY = Util.min(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")
        
        let lines=svgNode.append("svg:g")
        let xScale=d3.scaleLinear().domain([minX,maxX]).range([0,Util.toPixel(this.layout.width,this.chart.style.width)])
        let yScale =d3.scaleLinear().domain([minY,maxY]).range([Util.toPixel(this.layout.height,this.chart.style.height),0])
        _.each(ds,(d,i)=>{
            let lGen=d3.line()
            lines.append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).attr("stroke",d.style.color||this.chart.getColorByIndex(i))
        })
        return this
    }
    renderer() {
        let conf = this.chart.config
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").classed(this.config.className, () => !!this.config.className)
        this.drawer(svg)
        return svg.node()
    }
    updateDom(){
        let svg=d3.select(this.el)
        svg.selectAll("*").remove()
        this.drawer(svg)
        return this
    }
     smartLineGen(xScale, yScale, isHandleNaN, ds) {
        if (ds.length < 1) return "M0,0";
        var lineString = "";
        var isStartPoint = true;
        if (!isHandleNaN) {
            ds = ds.filter(function (v) {
                return !isNaN(v.y);
            })
        }
        for (var i = 0; i < ds.length; ++i) {
            if (isStartPoint) {
                if (isNaN(ds[i].y)) {
                    isStartPoint = true;
                    continue;
                } else {
                    lineString += "M" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                    isStartPoint = false;
                }
            } else {
                if (isNaN(ds[i].y)) {
                    isStartPoint = true;
                    continue;
                } else {
                    lineString += "L" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                }
            }

        }
        return lineString;
    }
}