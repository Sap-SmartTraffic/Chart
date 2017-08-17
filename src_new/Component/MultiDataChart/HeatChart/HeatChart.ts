import d3 =require("d3")
import _ = require("lodash")
import {Util} from "../../../Core/Util"
import {MultiDataMeasure} from "../MultiTypeMeasure"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"
import {AxisLayer} from "../../MultiDataChart/AxisLayer"
import {TooltipLayer,TooltipData} from "../../Layer/TooltipLayer"
import {LegendLayer} from "../../MultiDataChart/LegendLayer"
import {TitleLayer} from "../../Layer/TitleLayer"
import {HeatData} from "../../../Core/DataFilter"

export class HeatLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    config: HeatLayerConfig
    defaultConfig(): HeatLayerConfig {
        return {
            tagName: "svg",
            className: "heatChart",
            style: {
                top: "0px",
                left: "0px",
                bottom: null,
                right: null,
                position: "absolute",
                zindex: 0,
                width: "400rem",
                height: "200rem"
            },
            heatBar:{
                width:"50px",
                maxHeat:50
            },
            heatPadding:{
                top:10,
                right:20,
                bottom:50,
                left:50
            }
        }
    }

    chart:MultiDataChart

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let self = this
        let ds = this.chart.getMeasure("heat")
        if(!ds || typeof(ds) == undefined || ds.length==0) {
            return
        }
        let xMarks = ds[0].data.length,
            yMarks = ds.length
        
        let width = Util.toPixel(this.config.style.width),
            height = Util.toPixel(this.config.style.height),
            topPadding = this.config.heatPadding.top,
            rightPadding = this.config.heatPadding.right,
            bottomPadding = this.config.heatPadding.bottom,
            leftPadding = this.config.heatPadding.left,
            barWidth = Util.toPixel(this.config.heatBar.width),
            barHeight = height - bottomPadding - topPadding,
            maxHeat = this.config.heatBar.maxHeat,
            triangleSide = 8,
            barSegment = 5

        let xScale = d3.scaleBand()
                       .domain(_.range(xMarks).map((d)=>{return d.toString()}))
                       .rangeRound([leftPadding,width-rightPadding-barWidth])
        let yScale = d3.scaleBand()
                       .domain(_.range(yMarks).map((d)=>{return d.toString()}))
                       .rangeRound([topPadding,height-bottomPadding])
        let barScale = d3.scaleLinear()
                         .domain([0,maxHeat])
                         .range([topPadding,height-bottomPadding])
        let color = d3.interpolate("white","lightblue")
        let rectGroup = svgNode.append("g").classed("rectGroup",true),
            textGroup = svgNode.append("g").classed("textGroup",true),
            heatBar = svgNode.append("g").classed("heatBar",true)

        _.each(ds,(d,i)=>{
            textGroup.append("text").classed("heatYText",true)
                     .text(d.id)
                     .attr("x",0)
                     .attr("y",xScale(i.toString()))
            _.each(d.data,(v:HeatData,k)=>{
                rectGroup.append("rect").classed("heatRect",true)
                         .attr("x",xScale(k.toString()))
                         .attr("y",yScale(i.toString()))
                         .attr("width",xScale.bandwidth())
                         .attr("height",yScale.bandwidth())
                         .attr("fill",color(v.value/maxHeat))  
                         .on("mouseover",()=>{
                             heatBar.append("path").classed("heatBarTriangle",true)
                                    .attr("d",`M${width-barWidth-triangleSide} ${barScale(v.value)-triangleSide} L${width-barWidth-triangleSide} ${barScale(v.value)+triangleSide} L${width-barWidth} ${barScale(v.value)} Z`)
                         })
                         .on("mouseout",()=>{
                             svgNode.select(".heatBarTriangle").remove()
                         })
                rectGroup.append("text").classed("heatRectText",true)
                         .text(v.value)
                         .attr("x",xScale(k.toString()))
                         .attr("y",yScale(i.toString()))
                         .attr("dx",xScale.bandwidth()/2)
                         .attr("dy",yScale.bandwidth()/2)
                         .on("mouseover",()=>{
                             heatBar.append("path").classed("heatBarTriangle",true)
                                    .attr("d",`M${width-barWidth-triangleSide} ${barScale(v.value)-triangleSide} L${width-barWidth-triangleSide} ${barScale(v.value)+triangleSide} L${width-barWidth} ${barScale(v.value)} Z`)
                         })
                         .on("mouseout",()=>{
                             svgNode.select(".heatBarTriangle").remove()
                         })
            })
        })

        _.each(ds[0].data,(d:HeatData,i)=>{
            textGroup.append("text").classed("heatXText",true)
                     .text(d.day)
                     .attr("x",xScale(i.toString()))
                     .attr("dx",xScale.bandwidth()/2)
                     .attr("dy",bottomPadding/2)
                     .attr("y",height-bottomPadding)
        })
        let gradient = svgNode.append("defs").append("linearGradient")
                              .attr("id","gradientColor")
                              .attr("x1","0%").attr("y1","0%")
                              .attr("x2","0%").attr("y2","100%")
        gradient.append("stop").attr("offset","0%").style("stop-color","white")
        gradient.append("stop").attr("offset","100%").style("stop-color","lightblue")
        heatBar.append("rect").classed("heatBarRect",true)
               .attr("x",width-barWidth)
               .attr("y",topPadding)
               .attr("width",barWidth/2)
               .attr("height",barHeight)
               .attr("fill","url(#gradientColor)")
        for(let i = 0; i < barSegment+1; i++) {
            heatBar.append("line").classed("heatBarLine",true)
                   .attr("x1",width-barWidth)
                   .attr("y1",topPadding+i*barHeight/barSegment)
                   .attr("x2",width-barWidth/2)
                   .attr("y2",topPadding+i*barHeight/barSegment)
            heatBar.append("text").classed("heatBarText",true)
                   .attr("x",width-barWidth/2+5)
                   .attr("y",topPadding+i*barHeight/5)
                   .text(maxHeat/barSegment * i)
        }
               
        return this
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface HeatLayerConfig extends ILayerConfig {
    heatBar:{
        width:string,
        maxHeat:number
    },
    heatPadding:{
        top:number,
        right:number,
        bottom:number,
        left:number
    }
}

export class HeatChart extends MultiDataChart {
    boxplotLayer:HeatLayer

    constructor(conf?) {
        super(conf)
        this.boxplotLayer = new HeatLayer("heat",{
            style: {
                width: ()=>Util.toPixel(this.config.style.width),
                height: ()=>Util.toPixel(this.config.style.height)
            }
        })
        this.boxplotLayer.addTo(this)
    }

    setConfig(c:HeatLayerConfig){
        this.boxplotLayer.setConfig(_.pick(c,"key"))
    }
}

