import d3 = require("d3")
import _ = require("underscore")
import {Util} from "../Core/Util"
import {BaseLayer,ILayerConfig} from "../Core/BaseLayer"

export class BarLayer extends BaseLayer {
    config: BarLayerConfig
    defaultConfig():BarLayerConfig {
        return {
            tagName: "svg",
            className: "barchart",
            style: {
                top:"0px",
                left:"0px",
                bottom:null,
                right:null,
                position:"absolute",
                "z-index":0,
                width:"300px",
                height:"300px"
            }
        }
    }

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let ds = this.chart.getMeasures("bar")
        if(!ds || typeof(ds) == undefined || ds.length==0) {
            return
        }
        let xMarks = ds[0].data.length
        let series = ds.length
        let maxY = Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y")
        let xScale = d3.scaleBand()
                       .domain(_.range(xMarks))
                       .rangeRound([0, Util.toPixel(this.config.style.width)])
                       .paddingInner(0.1).paddingOuter(0.2)
        let seriesScale = d3.scaleBand()
                            .domain(_.range(series))
                            .rangeRound([0,xScale.bandwidth()])
        let yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([0,Util.toPixel(this.config.style.height)])
        _.each(ds,(d,i)=>{
            let group = svgNode.append("g").attr("class","series").attr("id","series"+i)
                           .attr("transform","translate("+ (i * seriesScale.bandwidth()) +",0)")
            _.each(d.data, (v,k)=>{
                group.append("rect").attr("class","rect"+k)
                     .attr("x",xScale(k)).attr("y",Util.toPixel(this.config.style.height))
                     .attr("width",seriesScale.bandwidth()).attr("height",yScale(v.y))
                     .attr("fill",this.chart.getColor(i))
                     .transition().duration(1000)
                     .attr("y",Util.toPixel(this.config.style.height) - yScale(v.y))
            })
        })
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface BarLayerConfig extends ILayerConfig {

}