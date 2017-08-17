import d3 =require("d3")
import _ = require("lodash")
import {Util} from "../../../Core/Util"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"
import {AxisLayer} from "../../MultiDataChart/AxisLayer"
import {RangeData} from "../../../Core/DataFilter"

export class RangeLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    config: RangeLayerConfig
    defaultConfig(): RangeLayerConfig {
        return Util.deepExtend(super.defaultConfig(),{
            className: "rangeChart",
        })
    }

    chart:MultiDataChart

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let ds = this.chart.getAllMeasure()[0]
        if(!ds){
            return 
        }
        let maxY = this.chart.max("max"),
            minY = this.chart.min("min")
        let width = Util.toPixel(this.config.style.width),
            height = Util.toPixel(this.config.style.height)
        
        let xScale = d3.scaleTime()
                       .domain(this.chart.getDomain("time"))
                       .range([0,width])
        
        let yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([height,0])
        
        let gradientColor = svgNode.append("defs").append("linearGradient").attr("id","linearColor")
                                   .attr("x1","0%").attr("y1","0%")
                                   .attr("x2","0%").attr("y2","100%")
        gradientColor.append("stop").attr("offset","0%").attr("style","stop-color:steelblue;stop-opacity:1")
        gradientColor.append("stop").attr("offset","100%").attr("style","stop-color:aqua;stop-opacity:1")

        let area = d3.area<{time:number,min:number,max:number}>()
                     .x((d)=>{return xScale(d.time)})
                     .y0((d)=>{return yScale(d.min)})
                     .y1((d)=>{return yScale(d.max)})

        svgNode.append("g")
               .attr("class","areaGroup")
               .append("path")
               .attr("class","area")
               .attr("d",area(ds.data))
               .attr("fill","url(#linearColor)")
        
        svgNode.append("line").attr("class","focusLine")
               .attr("x1",xScale(d3.timeParse("%H")("12")))
               .attr("y1",height)
               .attr("x2",xScale(d3.timeParse("%H")("12")))
               .attr("y2",0)
        
        this.chart.on("dragLine",function(d){
            svgNode.select(".focusLine").attr("x1",xScale(d.time)).attr("x2",xScale(d.time))
        })
    }


    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface RangeLayerConfig extends ILayerConfig {
}

export class RangeChart extends MultiDataChart {
    rangeLayer:RangeLayer
    axisLayer:AxisLayer

    constructor(conf?) {
        super(conf)
        this.axisLayer = new AxisLayer("axis",{
            style: {
                width: this.config.style.width,
                height: this.config.style.height
            },
            axis:{
                format:{
                    x:d3.timeFormat("%H:%M")
                },
                key:{
                    x:"time",
                    y:"max"
                },
                ticks:{
                    x:24
                }
            },
            type:"time",
            verticalGridLine:false
        })
        this.rangeLayer = new RangeLayer("range",{
            style: {
                top: this.axisLayer.config.padding.top,
                left: this.axisLayer.config.padding.left,
                width: Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right),
                height: Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom)
            }
        })
        this.axisLayer.addTo(this)
        this.rangeLayer.addTo(this)
    }

    setConfig(c:RangeLayerConfig){
        this.rangeLayer.setConfig(_.pick(c,"key"))
        this.axisLayer.setConfig(_.pick(c,"key"))
    }
}

