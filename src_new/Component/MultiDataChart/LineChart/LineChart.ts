import d3 =require("d3")
import _ = require("underscore")
import {Util} from "../../../Core/Util"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"
import {AxisLayer} from "../../MultiDataChart/AxisLayer"
import {TooltipLayer,TooltipData} from "../../Layer/TooltipLayer"
import {LegendLayer} from "../../MultiDataChart/LegendLayer"

export class LineLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    config: LineLayerConfig
    defaultConfig(): LineLayerConfig {
        return {
            tagName: "svg",
            className: "lineChart",
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
            padding:6,
            xType:"line",
            curveType: "linear",
            hasDot: true,
            hasArea: false,
            hasTooltip: true,
            hasTimeAdjust: true
        }
    }

    chart:MultiDataChart

    curveTypeMap:any = {
        linear: d3.curveLinear,
        basis: d3.curveBasis,
        cardinal: d3.curveCardinal,
        step: d3.curveStep
    }

    drawer(svgNode:d3.Selection<Element,{},null,null>){
        let self = this
        let ds = this.chart.getMeasure("line")
        if(!ds || typeof(ds) == undefined || ds.length==0) {
            return
        }
        let series = ds.length
        let maxX = this.chart.max("x"),
            minX = this.chart.min("x"),
            maxY = this.chart.max("y")
        let width = Util.toPixel(this.config.style.width),
            height = Util.toPixel(this.config.style.height)
        
        let xScale,line
        if(this.config.xType == "time") {
            let parseTime = d3.timeParse("%H")
            let temp = [];
            _.each(ds,(d,i)=>{
                let tempData = []
                _.each(d.data,(v:LineData,k)=>{
                    tempData.push({x:parseTime(v.x.toString()),y:v.y}) 
                })
                temp.push({id:d.id,data:tempData,type:d.type,style:d.style})
            })
            ds = temp
            xScale = d3.scaleTime()
                       .domain([parseTime(minX.toString()),parseTime(maxX.toString())])
                       .range([this.config.padding, width-this.config.padding])
        }
        else {
            xScale = d3.scaleLinear()
                       .domain([minX,maxX])
                       .range([this.config.padding, width-this.config.padding])
        }
        let yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([height-this.config.padding,this.config.padding])
        
        line = d3.line<{x:any,y:any}>()
                 .x(function(v){return xScale(v.x)})
                 .y(function(v){return yScale(v.y)})
                 .curve(this.curveTypeMap[this.config.curveType])               
        _.each(ds,(d,i)=>{
            let group = svgNode.append("svg:g")
                               .attr("class","series")
                               .attr("id","series"+i)
            group.append("path")
                 .attr("d",line(d.data))
                 .attr("stroke",this.chart.getColor(d.id))

            if(this.config.hasDot) {
                _.each(d.data,(v:LineData,k)=>{
                    group.append("circle")
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
                allRectX = _.union(allRectX, _.pluck(d.data,"x"))
            })
            allRectX = allRectX.sort()
            for(let i = 1; i < allRectX.length; i++ ) {
                allRectInterval.push(allRectX[i] - allRectX[i-1]) 
            }
            let rectWidth = (xScale(_.min(allRectInterval)) - xScale(0)) / 3 * 2
            
            _.each(allRectX,(x)=>{
                let data = []
                _.each(ds,(d)=>{
                    let value = _.filter(d.data,(dd:LineData)=>{return dd.x == x})[0]
                    if(value != undefined)
                        data.push({id:d.id, value:value.y})
                })
                allRect.push({xMark:x,data:data})
            })

            let focusLine = svgNode.append("line").attr("class","focusLine")
            let overlay = svgNode.append("g").attr("class","overlay")
            _.each(allRect,(d,i)=>{
                overlay.append("rect")
                    .attr("class","eventRect"+i)
                    .attr("x",xScale(d.xMark) - rectWidth/2)
                    .attr("y",this.config.padding)
                    .attr("width", rectWidth)
                    .attr("height", height - this.config.padding * 2)
                    .on("mouseenter",function(){
                        focusLine.style("display",null)
                        self.chart.fire("showGroupTooltip",{xMark:d3.timeFormat("%H:%M")(d.xMark),data:d.data})
                    })
                    .on("mousemove",function(){
                        focusLine.attr("x1",xScale(d.xMark))
                                    .attr("y1",self.config.padding)
                                    .attr("x2",xScale(d.xMark))
                                    .attr("y2",height-self.config.padding)
                                    
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
                                    .attr("x1",width/2)
                                    .attr("y1",this.config.padding)
                                    .attr("x2",width/2)
                                    .attr("y2",height-self.config.padding)
            this.chart.on("draging",(d)=>{
                svgNode.select(".adjustLine")
                       .attr("x1",xScale(d))
                       .attr("x2",xScale(d))
            })
            this.chart.on("dragend",(d)=>{
                svgNode.select(".adjustLine")
                       .attr("x1",xScale(d))
                       .attr("x2",xScale(d))
            })

        }

        return this
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface LineLayerConfig extends ILayerConfig {
    padding:number,
    xType: string
    curveType: string,
    hasDot: boolean,
    hasArea: boolean,
    hasTooltip: boolean,
    hasTimeAdjust: boolean,
}

export interface LineData {
    x:any,
    y:any
}

export class LineChart extends MultiDataChart {
    lineLayer:LineLayer
    axisLayer:AxisLayer
    tooltipLayer:TooltipLayer
    legendLayer:LegendLayer

    constructor(conf?) {
        super(conf)
        this.axisLayer = new AxisLayer("axis",{
            style: {
                width: ()=>this.config.style.width,
                height: ()=>this.config.style.height
            },
            axis:{
                format:{
                    x:d3.timeFormat("%H:%M")
                },
                ticks:{
                    x:8
                }
            },
            type:"time"
        })
        this.axisLayer.addTo(this)
        this.lineLayer = new LineLayer("line",{
            style: {
                top: ()=>Util.toPixel(this.axisLayer.config.padding.top) - this.axisLayer.config.borderPadding,
                left: ()=>Util.toPixel(this.axisLayer.config.padding.left) - this.axisLayer.config.borderPadding,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right) + this.axisLayer.config.borderPadding * 2,
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom) + this.axisLayer.config.borderPadding * 2
            },
            hasTooltip:false,
            xType: "time"
        })
        this.lineLayer.addTo(this)
        if(this.lineLayer.config.hasTooltip) {
            this.tooltipLayer = new TooltipLayer("tooltip",{
                style: {
                    top: ()=>Util.toPixel(this.axisLayer.config.padding.top) - this.axisLayer.config.borderPadding,
                    left: ()=>Util.toPixel(this.axisLayer.config.padding.left) - this.axisLayer.config.borderPadding,
                    width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right) + this.axisLayer.config.borderPadding * 2,
                    height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom) + this.axisLayer.config.borderPadding * 2
                }
            })
            this.tooltipLayer.addTo(this)
        }
        this.legendLayer = new LegendLayer("legend",{
            style: {
                top: ()=>this.axisLayer.config.style.height,
                left: ()=>this.axisLayer.config.padding.left,
                width: ()=>Util.toPixel(this.axisLayer.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left) - Util.toPixel(this.axisLayer.config.padding.right)
            }
        })
        this.legendLayer.addTo(this)
    }

    setConfig(c:LineLayerConfig){
        this.lineLayer.setConfig(_.pick(c,"key"))
        this.axisLayer.setConfig(_.pick(c,"key"))
    }
}

