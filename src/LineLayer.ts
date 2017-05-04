import d3 = require("d3")
import _ = require("underscore")
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
    renderer() {
        let conf = this.chart.config
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").classed(this.config.className, () => !!this.config.className)
        let ds = this.chart.measures
        let maxX = Number.MIN_VALUE,
            maxY = Number.MIN_VALUE,
            minX = Number.MAX_VALUE,
            minY = Number.MAX_VALUE
        _.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[]):any[]=>d1.concat(d2)).value().forEach(d=>{
            maxX = Math.max(d.x, maxX)
            maxY = Math.max(d.x, maxY)
            minX = Math.min(d.x, minX)
            minY = Math.min(d.x, minY)
        })
        // ds.map((d) => d.data).reduce((d1, d2) => d1.concat(d2)).forEach(d => {
        //     maxX = Math.max(d.x, maxX)
        //     maxY = Math.max(d.x, maxY)
        //     minX = Math.min(d.x, minX)
        //     minY = Math.min(d.x, minY)

        // })
        let lines=svg.append("svg:g")
        let xScale=d3.scaleLinear().domain([minX,maxX]).range([0,300])
        let yScale =d3.scaleLinear().domain([minY,maxY]).range([300,0])
        _.each(ds,(d,i)=>{
            let lGen=d3.line()
            lines.append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).attr("stroke",d.style.color||this.chart.getColorByIndex(i))
        })
      
        return svg.node()
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