import d3 =require("d3")
import _ = require('lodash');
import {Util} from "../../../Core/Util"
import {IChartConfig} from "../../../Core/BaseChart"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"
import {AxisLayer,IAxisLayerConfig} from "../../MultiDataChart/AxisLayer"
import {TooltipLayer,TooltipData,ITooltipLayerConfig} from "../../Layer/TooltipLayer"
import {LegendLayer,ILegendLayerConfig} from "../../MultiDataChart/LegendLayer"
import {TitleLayer,ITitleLayerConfig} from "../../../Component/Layer/TitleLayer"
import {LineData} from "../../../Core/DataFilter"

export class LineLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    config: ILineLayerConfig
    defaultConfig(): ILineLayerConfig {
        return Util.deepExtend(super.defaultConfig(),{
            className: "lineChart",
            borderPadding:6,
            curveType: "linear",
            hasDot: true,
            hasArea: false,
            hasTooltip: true,
            hasTimeAdjust: true,
            yAxisTitleType: "time"
        })
    }

    chart:MultiDataChart

    curveTypeMap:any = {
        linear: d3.curveLinear,
        basis: d3.curveBasis,
        cardinal: d3.curveCardinal,
        step: d3.curveStep
    }
    
    getScale():any {
        let ds = this.chart.getMeasure("line")
        if(!ds || typeof(ds) == undefined || ds.length==0 || !ds[0].data || ds[0].data.length==0) {
            return 
        }
        let maxX = this.chart.max("x"),
            minX = this.chart.min("x"),
            maxY = this.chart.max("y")
        let width = Util.toPixel(this.config.style.width),
            height = Util.toPixel(this.config.style.height)
        let xScale
        if(typeof(ds[0].data[0].x) == "string") {
             xScale = d3.scaleTime()
                        .domain([minX,maxX])
                        .range([this.config.borderPadding, width-this.config.borderPadding])
        }else {
             xScale = d3.scaleLinear()
                        .domain([minX,maxX])
                        .range([this.config.borderPadding, width-this.config.borderPadding])
        }
        ds = this.chart.getMeasure("line")
    
        let yScale = d3.scaleLinear()
                       .domain([0,maxY*1.1])
                       .range([height-this.config.borderPadding,this.config.borderPadding])
        return {xScale:xScale,yScale:yScale}
    }

    drawer(svgNode:d3.Selection<Element,{},null,null>){
        let self = this
        let ds = this.chart.getMeasure("line")
        if(!ds || typeof(ds) == undefined || ds.length==0 || !ds[0].data || ds[0].data.length==0) {
            return
        }
        let series = ds.length
        let maxX = this.chart.max("x"),
            minX = this.chart.min("x"),
            maxY = this.chart.max("y")
        let width = Util.toPixel(this.config.style.width),
            height = Util.toPixel(this.config.style.height)
        let xScale = this.getScale().xScale,
            yScale = this.getScale().yScale
        let line = d3.line<{x:any,y:any}>()
                 .x(function(v){return xScale(v.x)})
                 .y(function(v){return yScale(v.y)})
                 .curve(this.curveTypeMap[this.config.curveType])
        
        _.each(ds,(d,i)=>{
            let group = svgNode.append("svg:g")
                               .attr("class","lineSeries")
                               .attr("id","lineSeries"+i)
            group.append("path")
                 .attr("class","line"+i)
                 .attr("d",line(d.data))
                 .attr("stroke",this.chart.getColor(d.id))
                 
            if(this.config.hasDot) {
                _.each(d.data,(v:LineData,k)=>{
                    group.append("circle")
                         .attr("class","circle"+i+k)
                         .attr("cx",xScale(v.x))
                         .attr("cy",yScale(v.y))
                         .attr("r","4")
                         .attr("fill",this.chart.getColor(d.id))
                })
            }

            if(this.config.hasArea) {
                let area = d3.area<{x:any,y:any}>()
                             .x((d)=>{return xScale(d.x)})
                             .y0(Util.toPixel(this.config.style.height))
                             .y1((d)=>{return yScale(d.y)})
                group.append("g")
                     .attr("class","lineArea")
                     .append("path")
                     .attr("d",area(d.data))
                     .attr("fill",this.chart.getColor(d.id))
            }
        })

        if(this.config.hasTooltip) {
            let allRect:TooltipData[] = [], allRectX = [], allRectInterval = []
            _.each(ds,(d,i)=>{
                allRectX = _.union(allRectX, _.map(d.data,"x"))
            })
            allRectX = allRectX.sort((a,b)=>{
                return a > b ? 1 : -1
            })
            let re = [allRectX[0]]
            for(let i = 1; i<allRectX.length; i++) {
                if(allRectX[i].toString() != allRectX[i-1].toString())
                    re.push(allRectX[i])
            }   
            allRectX = re
            for(let i = 1; i < allRectX.length; i++ ) {
                allRectInterval.push(allRectX[i] - allRectX[i-1]) 
            }
            let rectWidth = ((_.min(allRectInterval)) / (maxX - minX)) * (width-this.config.borderPadding) / 3 * 2
            _.each(allRectX,(x)=>{
                let data = []
                _.each(ds,(d)=>{
                    let value = _.filter(d.data,(dd:LineData)=>{return dd.x.toString() == x.toString()})[0]
                    if(value != undefined) {  
                        if(this.config.yAxisTitleType == "time") {
                            data.push({id:d.id, value:d3.format(".1f")(value.y)+"s"})
                        }
                        else if(this.config.yAxisTitleType == "speed") {
                            data.push({id:d.id, value:d3.format(".1f")(value.y)+"km/h"})
                        } 
                    }
                })
                allRect.push({xMark:x,data:data})
            })
            let focusLine = svgNode.append("line").attr("class","focusLine")
            let overlay = svgNode.append("g").attr("class","overlay")
            _.each(allRect,(d,i)=>{
                overlay.append("rect")
                    .attr("class","eventRect"+i)
                    .attr("x",xScale(d.xMark) - rectWidth/2)
                    .attr("y",this.config.borderPadding)
                    .attr("width", rectWidth)
                    .attr("height", height - this.config.borderPadding * 2)
                    .on("mouseenter",function(){
                        focusLine.style("display",null)
                        self.chart.fire("showGroupTooltip",{xMark:d3.timeFormat("%H:%M")(d.xMark),data:d.data})
                    })
                    .on("mousemove",function(){
                        focusLine.attr("x1",xScale(d.xMark))
                                    .attr("y1",self.config.borderPadding)
                                    .attr("x2",xScale(d.xMark))
                                    .attr("y2",height-self.config.borderPadding)
                                    
                            self.chart.fire("moveTooltip")
                    })
                    .on("mouseleave",function(){
                        focusLine.style("display","none")
                        self.chart.fire("hideTooltip")
                    })
            })
        }

        if(this.config.hasTimeAdjust) {
            let adjustLine = svgNode.append("line")
                                    .attr("class","adjustLine")
                                    .attr("x1",xScale(minX))
                                    .attr("y1",this.config.borderPadding)
                                    .attr("x2",xScale(minX))
                                    .attr("y2",height-self.config.borderPadding)
        }
        return this
    }

    setTime(time:Date|String) {
        let xScale = this.getScale().xScale
        if(typeof(time) == "string") {
            time = new Date(time)
        }
        d3.select(".adjustLine")
          .attr("x1",xScale(time))
          .attr("x2",xScale(time))
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface ILineLayerConfig extends ILayerConfig {
    borderPadding?:number,
    curveType?:string,
    hasDot?: boolean,
    hasArea?: boolean,
    hasTooltip?: boolean,
    hasTimeAdjust?: boolean,
    yAxisTitleType?: string
}

export class LineChart extends MultiDataChart {
    chartTitleLayer:TitleLayer
    lineLayer:LineLayer
    axisLayer:AxisLayer
    tooltipLayer:TooltipLayer
    legendLayer:LegendLayer

    config: ILineChartConfig
    defaultConfig():ILineChartConfig {
        return {
            className:"chart",
            style:{
                width:"40rem",
                height:"30rem",
                position:"relative"
            },
            el:null,
            line:{
                borderPadding:6,
                curveType: "linear",
                hasDot: true,
                hasArea: false,
                hasTooltip: true,
                hasTimeAdjust: true,
                yAxisTitleType: "time"
            },
            axis:{
                style: {
                    width: "40rem",
                    height: "30rem"
                },
                borderPadding:6,
                padding: {
                    top:"10px",
                    right:"20px",
                    bottom:"40px",
                    left:"50px"
                }
            },
            tooltip: {
                style:{
                    width: "40rem",
                    height: "30rem"
                }
            },
            legend: {
                style:{
                    width: "40rem",
                    height: "2rem"
                }
            },
            chartTitle: {
                style:{
                    width:"40rem",
                    height:"2rem",
                }
            }
        }
    }
    constructor(conf?) {
        super(conf)
        this.chartTitleLayer = new TitleLayer("chartTitle",{
            className:"chartTitle",
            style:{
                width:()=>this.config.style.width,
            },
            value:"Line Chart"
        })
        this.chartTitleLayer.addTo(this)
        this.axisLayer = new AxisLayer("axis",{
            style: {
                top: ()=>this.config.chartTitle.style.height,
                width: ()=>this.config.style.width,
                height: ()=>Util.toPixel(this.config.style.height) - Util.toPixel(this.config.legend.style.height) - Util.toPixel(this.config.chartTitle.style.height)
            },
            axis:{
                format:{
                    x:d3.timeFormat("%H:%M")
                }
            },
            type:"time"
        })
        this.axisLayer.addTo(this)
        this.lineLayer = new LineLayer("line",{
            style: {
                top: ()=>Util.toPixel(this.config.axis.padding.top) - this.config.axis.borderPadding + Util.toPixel(this.config.chartTitle.style.height),
                left: ()=>Util.toPixel(this.config.axis.padding.left) - this.config.axis.borderPadding,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.config.axis.padding.left)-Util.toPixel(this.config.axis.padding.right) + this.config.axis.borderPadding * 2,
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.config.axis.padding.top)-Util.toPixel(this.config.axis.padding.bottom) - Util.toPixel(this.config.legend.style.height) - Util.toPixel(this.config.chartTitle.style.height) + this.config.axis.borderPadding * 2
            }
        })
        this.lineLayer.addTo(this)
        if(this.config.line.hasTooltip) {
            this.tooltipLayer = new TooltipLayer("tooltip",{
                style: {
                    top: ()=>Util.toPixel(this.config.axis.padding.top) - this.config.axis.borderPadding + Util.toPixel(this.config.chartTitle.style.height),
                    left: ()=>Util.toPixel(this.config.axis.padding.left) - this.config.axis.borderPadding,
                    width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.config.axis.padding.left)-Util.toPixel(this.config.axis.padding.right) + this.config.axis.borderPadding * 2,
                    height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.config.axis.padding.top)-Util.toPixel(this.config.axis.padding.bottom) - Util.toPixel(this.config.legend.style.height) - Util.toPixel(this.config.chartTitle.style.height) + this.config.axis.borderPadding * 2
                }
            })
            this.tooltipLayer.addTo(this)
        }
        this.legendLayer = new LegendLayer("legend",{
            style: {
                top: ()=>Util.toPixel(this.config.style.height) - Util.toPixel(this.config.legend.style.height),
                left: ()=>this.config.axis.padding.left,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.config.axis.padding.left) - Util.toPixel(this.config.axis.padding.right)
            }
        })
        this.legendLayer.addTo(this)
    }

    setConfig(c){
        this.lineLayer.setConfig(_.toArray(_.pick(c,"line")))
        this.axisLayer.setConfig(_.toArray(_.pick(c,"axis")))
        this.legendLayer.setConfig(_.toArray(_.pick(c,"legend")))
        this.tooltipLayer.setConfig(_.toArray(_.pick(c,"tooltip")))
        this.chartTitleLayer.setConfig(_.toArray(_.pick(c,"chartTitle")))
    }

    setTimeAdjust(time:Date|String) {
        this.lineLayer.setTime(time)
    }
}

export interface ILineChartConfig extends IChartConfig{
    line: ILineLayerConfig,
    axis: IAxisLayerConfig,
    tooltip: ITooltipLayerConfig,
    legend: ILegendLayerConfig,
    chartTitle: ITitleLayerConfig
}

