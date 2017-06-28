import d3 = require("d3")
import _ = require("underscore")
import {Util} from "../Core/Util"
import {BaseLayer,ILayerConfig} from "../Core/BaseLayer"

export class LineLayer extends BaseLayer {
    config: LineLayerConfig
    defaultConfig():LineLayerConfig {
        return {
            tagName: "svg",
            className: "linechart",
            style: {
                top:"0px",
                left:"0px",
                bottom:null,
                right:null,
                position:"absolute",
                "z-index":0,
                width:"300px",
                height:"300px"
            },
            padding: {
                top:"10px",
                right:"10px",
                bottom:"20px",
                left:"40px"
            },
            curveType: "linear",
            isDot: true,
            isArea: true
        }
    }

    curveTypeMap = {
        linear: d3.curveLinear,
        basis: d3.curveBasis,
        cardinal: d3.curveCardinal,
        step: d3.curveStep
    } 

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let ds = this.chart.getMeasures("line")
        if(!ds || typeof(ds) == undefined || ds.length==0) {
            return
        }
        let series = ds.length
        let maxX = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"x"),
            maxY = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")
        let width = Util.toPixel(this.config.style.width) - Util.toPixel(this.config.padding.left)-Util.toPixel(this.config.padding.right)
        let height = Util.toPixel(this.config.style.height) - Util.toPixel(this.config.padding.top)-Util.toPixel(this.config.padding.bottom)
        let xScale = d3.scaleLinear()
                       .domain([0,maxX])
                       .range([Util.toPixel(this.config.padding.left), width])
        let yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([height,Util.toPixel(this.config.padding.top)])
        let line = d3.line().x(function(v){return xScale(v.x)})
                                .y(function(v){return yScale(v.y)})
                                .curve(this.curveTypeMap[this.config.curveType])
        _.each(ds,(d,i)=>{
            let group = svgNode.append("svg:g").attr("class","series").attr("id","series"+i)
            group.append("path")
                 .attr("d",line(d.data))
                 .attr("stroke",this.chart.getColor(i))
                 .attr("stroke-width","2px")
                 .attr("fill","none")

            if(this.config.isDot) {
                _.each(d.data,(v,k)=>{
                    group.append("circle")
                         .attr("cx",xScale(v.x))
                         .attr("cy",yScale(v.y))
                         .attr("r","4")
                         .attr("fill",this.chart.getColor(i))
                         //.on("mousemove",()=>{this.chart.fire("showTooltip",{xMark:v.x, index:i, series:d.id, value:v.y})})
                         //.on("mouseleave",()=>{this.chart.fire("hideTooltip")})
                })
            }

            if(this.config.isArea) {
                let area = d3.area().x((d)=>{return xScale(d.x)}).y0(Util.toPixel(this.config.style.height)).y1((d)=>{return yScale(d.y)})
                group.append("g").append("path").attr("d",area(d.data)).attr("stroke-width","0px").attr("fill",this.chart.getColor(i)).style("opacity","0.3")
            }
        })
        return this 
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface LineLayerConfig extends ILayerConfig {
    padding: {
        top: string|undefined|null,
        right: string|undefined|null,
        bottom: string|undefined|null,
        left: string|undefined|null
    }
    curveType: string,
    isDot: boolean,
    isArea: boolean
}