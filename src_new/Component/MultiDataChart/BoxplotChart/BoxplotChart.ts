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
import {BoxplotData} from "../../../Core/DataFilter"

export class BoxplotLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    config: BoxplotLayerConfig
    defaultConfig(): BoxplotLayerConfig {
        return Util.deepExtend(super.defaultConfig(),{
            className:"boxplotChart",
            boxPadding:{
                top:20,
                right:50,
                bottom:20,
                left:50
            },
            rectWidth:20
        })
    }

    chart:MultiDataChart

    processData(data:number[]) {
        let sortedData = _.sortBy(data,(num)=>{return num})
        let len = sortedData.length
        let min = sortedData[0], max = sortedData[len-1]
        let lowerQuartile, median, largerQuartile
        let getMeadian = (ds:number[])=>{
            if(ds.length % 2 == 0) {
                return (ds[ds.length/2-1] + ds[ds.length/2]) / 2
            }
            else {
                return ds[(ds.length-1)/2]
            }
        }
        if(len % 2 == 0) {
            lowerQuartile = getMeadian(sortedData.slice(0,len/2))
            largerQuartile = getMeadian(sortedData.slice(len/2))
        }
        else {
            lowerQuartile = getMeadian(sortedData.slice(0,(len-1)/2))
            largerQuartile = getMeadian(sortedData.slice((len-1)/2+2))
        }
        median = getMeadian(sortedData)
        return {min:min, lowerQuartile:lowerQuartile, median:median, largerQuartile:largerQuartile, max:max}
    }

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let self = this
        let ds = this.chart.getMeasure("boxplot")
        if(!ds || typeof(ds) == undefined || ds.length==0) {
            return
        }
        let processDs = [], min=Infinity, max=-Infinity
        _.each(ds,(d)=>{
            let newData = this.processData(d.data)
            min=min>newData.min?newData.min:min
            max=max<newData.max?newData.max:max
            processDs.push({id:d.id, data:newData, type:d.type})
        })
        let xScale = d3.scaleBand()
                       .domain(_.range(processDs.length).map((d)=>{return d.toString()}))
                       .rangeRound([0, Util.toPixel(this.config.style.width)])
                       .paddingInner(0.1).paddingOuter(0.5)
        let yScale = d3.scaleLinear()
                      .domain([min,max])
                      .range([this.config.boxPadding.top,Util.toPixel(this.config.style.height)-this.config.boxPadding.bottom])
        _.each(processDs,(d,i)=>{
            let box = svgNode.append("g").classed("box box"+i,true)
            box.append("line").classed("centerLine",true)
               .attr("x1",xScale(i.toString()))
               .attr("y1",yScale(d.data.min))
               .attr("x2",xScale(i.toString()))
               .attr("y2",yScale(d.data.max))
            box.append("rect").classed("boxRect",true)
               .attr("x",xScale(i.toString())-this.config.rectWidth/2)
               .attr("y",yScale(d.data.lowerQuartile))
               .attr("width",this.config.rectWidth)
               .attr("height",yScale(d.data.largerQuartile)-yScale(d.data.lowerQuartile))
            box.append("line").classed("minLine",true)
               .attr("x1",xScale(i.toString())-this.config.rectWidth/2)
               .attr("y1",yScale(d.data.min))
               .attr("x2",xScale(i.toString())+this.config.rectWidth/2)
               .attr("y2",yScale(d.data.min))
            box.append("line").classed("maxLine",true)
               .attr("x1",xScale(i.toString())-this.config.rectWidth/2)
               .attr("y1",yScale(d.data.max))
               .attr("x2",xScale(i.toString())+this.config.rectWidth/2)
               .attr("y2",yScale(d.data.max))
            box.append("line").classed("medianLine",true)
               .attr("x1",xScale(i.toString())-this.config.rectWidth/2)
               .attr("y1",yScale(d.data.median))
               .attr("x2",xScale(i.toString())+this.config.rectWidth/2)
               .attr("y2",yScale(d.data.median))
            box.append("text").classed("rightText",true)
               .text(d.data.min)
               .attr("x",xScale(i.toString())+this.config.rectWidth/2)
               .attr("y",yScale(d.data.min))
               .attr("dx",5)
            box.append("text").classed("rightText",true)
               .text(d.data.median)
               .attr("x",xScale(i.toString())+this.config.rectWidth/2)
               .attr("y",yScale(d.data.median))
               .attr("dx",5)
            box.append("text").classed("rightText",true)
               .text(d.data.max)
               .attr("x",xScale(i.toString())+this.config.rectWidth/2)
               .attr("y",yScale(d.data.max))
               .attr("dx",5)
            box.append("text").classed("leftText",true)
               .text(d.data.lowerQuartile)
               .attr("x",xScale(i.toString())-this.config.rectWidth/2)
               .attr("y",yScale(d.data.lowerQuartile))
               .attr("dx",-5)
            box.append("text").classed("leftText",true)
               .text(d.data.largerQuartile)
               .attr("x",xScale(i.toString())-this.config.rectWidth/2)
               .attr("y",yScale(d.data.largerQuartile))
               .attr("dx",-5)
        })

        return this
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface BoxplotLayerConfig extends ILayerConfig {
    boxPadding?:{
        top:number,
        right:number,
        bottom:number,
        left:number
    },
    rectWidth?:number
}

export class BoxplotChart extends MultiDataChart {
    boxplotLayer:BoxplotLayer

    constructor(conf?) {
        super(conf)
        this.boxplotLayer = new BoxplotLayer("boxplot",{
            style: {
                width: ()=>Util.toPixel(this.config.style.width),
                height: ()=>Util.toPixel(this.config.style.height)
            }
        })
        this.boxplotLayer.addTo(this)
    }

    setConfig(c:BoxplotLayerConfig){
        this.boxplotLayer.setConfig(_.pick(c,"key"))
    }
}

