import d3 = require("d3")
import _ = require("underscore")
import Util=require("./Util")
import {Evented} from "./Evented"
import {BaseLayer} from "./BaseLayer"
export class LineLayer extends BaseLayer {
    constructor(id?, conf?) {
        super(conf)
        this.setConfig(conf)
    }
    
    config= {
        className: "lineLayer",
        curveType: "linear",
        isDot: false,
        isArea: true
    }
    
    /*
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
    */

    curveTypeMap ={
        linear: d3.curveLinear,
        basis: d3.curveBasis,
        cardinal: d3.curveCardinal,
        step: d3.curveStep
    } 

    eventHandler(svg) {
        this.chart.on("enterLegend",(d)=>{
            svg.selectAll(".series").each(function(this){
                if(d3.select(this).attr("id") != ("series"+d.index))
                    d3.select(this).transition().duration(200).style("opacity","0.2")
            })
        })

        this.chart.on("leaveLegend",()=>{
            svg.selectAll(".series").transition().duration(200).style("opacity","1")
        })

        this.chart.on("clickLegend",(d)=>{
            
        })
    }

    drawer(svgNode) {
        let ds = this.chart.measures
        let series = ds.length
        let maxX = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x"),
            maxY = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")
        let xScale = d3.scaleLinear()
                       .domain([0,maxX])
                       .range([0, Util.toPixel(this.layout.width)])
        let yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([Util.toPixel(this.layout.height),0])
        let line = d3.line().x(function(v){return xScale(v.x)})
                                .y(function(v){return yScale(v.y)})
                                .curve(this.curveTypeMap[this.config.curveType])
        _.each(ds,(d,i)=>{
            let group = svgNode.append("svg:g").attr("class","series").attr("id","series"+i)
            group.append("path")
                 .attr("d",line(d.data))
                 .attr("stroke",d.style.color||this.chart.getColor(i))
                 .attr("stroke-width","2px")
                 .attr("fill","none")

            if(this.config.isDot) {
                _.each(d.data,(v,k)=>{
                    group.append("circle")
                         .attr("cx",xScale(v.x))
                         .attr("cy",yScale(v.y))
                         .attr("r","4")
                         .attr("fill",this.chart.getColor(i))
                         .on("mousemove",()=>{this.chart.fire("showTooltip",{xMark:v.x, index:i, series:d.id, value:v.y})})
                         .on("mouseleave",()=>{this.chart.fire("hideTooltip")})
                })
            }

            if(this.config.isArea) {
                let area = d3.area().x((d)=>{return xScale(d.x)}).y0(Util.toPixel(this.layout.height)).y1((d)=>{return yScale(d.y)})
                group.append("g").append("path").attr("d",area(d.data)).attr("stroke-width","0px").attr("fill",d.style.color||this.chart.getColor(i)).style("opacity","0.3")
            }
            
            
            //svgNode.append("svg:g").append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).attr("stroke",d.style.color||this.chart.getColor(i)).attr("fill","none")
        })
        return this
    }

    renderer() {
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").classed(this.config.className, () => !!this.config.className)
        this.drawer(svg)
        this.eventHandler(svg)
        return svg.node()
    }

    updateDom(){
        let svg=d3.select(this.el)
        svg.selectAll("*").remove()
        this.drawer(svg)
        return this
    }

}