import d3 = require("d3")
import _ = require("underscore")
import Util=require("Util")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
export class LineLayer extends BaseLayer {
    constructor(id?, conf?) {
        super(conf)
        this.setConfig(conf)
    }
    
    config: {
        lines:any[]
        className: string
    }

    init() {
       
    }

    drawer(svgNode){
        let ds = this.chart.measures
        _.each(ds,(d,i)=>{
        let maxX = Util.max(d.data, "x")
        let maxY = Util.max(d.data, "y")
        let xScale = d3.scaleLinear().domain([0, maxX]).range([0, Util.toPixel(this.layout.width)])
        let yScale = d3.scaleLinear().domain([0,maxY]).range([Util.toPixel(this.layout.height),0])
        svgNode.append("svg:g").append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).attr("stroke",d.style.color||this.chart.getColorByIndex(i)).attr("fill","none")
        })
        return this
    }

    renderer() {
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