import d3 =require("d3")
import _ = require("underscore")
import {Util} from "../../../Core/Util"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"
import {AxisLayer} from "../../MultiDataChart/AxisLayer"
import {TooltipLayer,TooltipData} from "../../Layer/TooltipLayer"
import {LegendLayer} from "../../MultiDataChart/LegendLayer"

export class BarLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    config: BarLayerConfig
    defaultConfig(): BarLayerConfig {
        return {
            tagName: "svg",
            className: "barChart",
            style: {
                top: "0px",
                left: "0px",
                bottom: null,
                right: null,
                position: "absolute",
                zindex: 0,
                width: "400rem",
                height: "200rem"
            }
        }
    }

    chart:MultiDataChart

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let self = this
        let ds = this.chart.getMeasure("bar")
        if(!ds || typeof(ds) == undefined || ds.length==0) {
            return
        }
        let xMarks = ds[0].data.length
        let series = ds.length
        let maxY = this.chart.max("y")
        let xScale = d3.scaleBand()
                       .domain(_.range(xMarks).map((d)=>{return d.toString()}))
                       .rangeRound([0, Util.toPixel(this.config.style.width)])
                       .paddingInner(0.1).paddingOuter(0.2)
        let seriesScale = d3.scaleBand()
                            .domain(_.range(series).map((d)=>{return d.toString()}))
                            .rangeRound([0,xScale.bandwidth()])
        let yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([0,Util.toPixel(this.config.style.height)])
        _.each(ds,(d,i)=>{
            let group = svgNode.append("g")
                               .attr("class","series")
                               .attr("id","series"+i)
                               .attr("transform","translate("+ (i * seriesScale.bandwidth()) +",0)")
            _.each(d.data, (v:BarData,k)=>{
                group.append("rect")
                     .attr("class","rect"+k)
                     .attr("x",xScale(k.toString()))
                     .attr("y",Util.toPixel(this.config.style.height))
                     .attr("width",seriesScale.bandwidth())
                     .attr("height",yScale(v.y))
                     .attr("fill",this.chart.getColor(d.id))
                     .on("mouseenter",function(){
                         self.chart.fire("showSingleTooltip",{xMark:v.x, series:d.id, value:v.y})
                     })
                     .on("mousemove",function(){
                         self.chart.fire("moveTooltip")
                     })
                     .on("mouseleave",function(){
                         self.chart.fire("hideTooltip")
                     })
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

export interface BarData {
    x:string,
    y:number
}

export class BarChart extends MultiDataChart {
    barLayer:BarLayer
    axisLayer:AxisLayer
    tooltipLayer:TooltipLayer
    legendLayer:LegendLayer

    constructor(conf?) {
        super(conf)
        this.axisLayer = new AxisLayer("axis",{
            style: {
                width: this.config.style.width,
                height: this.config.style.height
            },
            type:"ordinal",
            verticalGridLine:false
        })
        this.barLayer = new BarLayer("bar",{
            style: {
                top: ()=>this.axisLayer.config.padding.top,
                left: ()=>this.axisLayer.config.padding.left,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right),
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom)
            }
        })
        this.tooltipLayer = new TooltipLayer("tooltip",{
            style: {
                top: ()=>this.axisLayer.config.padding.top,
                left: ()=>this.axisLayer.config.padding.left,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right),
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom)
            }
        })
        this.legendLayer = new LegendLayer("legend",{
            style: {
                top: ()=>this.axisLayer.config.style.height,
                left: ()=>this.axisLayer.config.padding.left,
                width: ()=>Util.toPixel(this.axisLayer.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left) - Util.toPixel(this.axisLayer.config.padding.right)
            }
        })
        this.axisLayer.addTo(this)
        this.barLayer.addTo(this)
        this.tooltipLayer.addTo(this)
        this.legendLayer.addTo(this)
    }

    setConfig(c:BarLayerConfig){
        this.barLayer.setConfig(_.pick(c,"key"))
        this.axisLayer.setConfig(_.pick(c,"key"))
    }
}

