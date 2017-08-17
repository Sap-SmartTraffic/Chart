import d3 =require("d3")
import _ = require("lodash")
import {Util} from "../../../Core/Util"
import {IChartConfig} from "../../../Core/BaseChart"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"
import {AxisLayer,IAxisLayerConfig} from "../../MultiDataChart/AxisLayer"
import {TooltipLayer,TooltipData,ITooltipLayerConfig} from "../../Layer/TooltipLayer"
import {LegendLayer,ILegendLayerConfig} from "../../MultiDataChart/LegendLayer"
import {TitleLayer,ITitleLayerConfig} from "../../../Component/Layer/TitleLayer"
import {BarData} from "../../../Core/DataFilter"
export class BarLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    config: IBarLayerConfig
    defaultConfig(): IBarLayerConfig {
        return Util.deepExtend(super.defaultConfig(),{className:"barChart"})
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
                               .attr("class","barSeries")
                               .attr("id","barSeries"+i)
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

        return this
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface IBarLayerConfig extends ILayerConfig {

}



export class BarChart extends MultiDataChart {
    chartTitleLayer:TitleLayer
    barLayer:BarLayer
    axisLayer:AxisLayer
    tooltipLayer:TooltipLayer
    legendLayer:LegendLayer

    config:IBarChartConfig
    defaultConfig():IBarChartConfig{
        return {
            className:"chart",
            style:{
                width:"40rem",
                height:"30rem",
                position:"relative"
            },
            el:null,
            bar:{},
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
            value:"Bar Chart"
        })
        this.axisLayer = new AxisLayer("axis",{
            style: {
                top: ()=>this.config.chartTitle.style.height,
                width: ()=>this.config.style.width,
                height: ()=>Util.toPixel(this.config.style.height) - Util.toPixel(this.config.legend.style.height) - Util.toPixel(this.config.chartTitle.style.height)
            },
            type:"ordinal",
            verticalGridLine:false
        })
        this.barLayer = new BarLayer("bar",{
            style: {
                top: ()=>Util.toPixel(this.config.axis.padding.top) + Util.toPixel(this.config.chartTitle.style.height),
                left: ()=>Util.toPixel(this.config.axis.padding.left),
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.config.axis.padding.left)-Util.toPixel(this.config.axis.padding.right),
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.config.axis.padding.top)-Util.toPixel(this.config.axis.padding.bottom) - Util.toPixel(this.config.legend.style.height) - Util.toPixel(this.config.chartTitle.style.height)
            }
        })
        this.tooltipLayer = new TooltipLayer("tooltip",{
            style: {
                top: ()=>Util.toPixel(this.config.axis.padding.top) + Util.toPixel(this.config.chartTitle.style.height),
                left: ()=>Util.toPixel(this.config.axis.padding.left),
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.config.axis.padding.left)-Util.toPixel(this.config.axis.padding.right),
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.config.axis.padding.top)-Util.toPixel(this.config.axis.padding.bottom) - Util.toPixel(this.config.legend.style.height) - Util.toPixel(this.config.chartTitle.style.height)
            }
        })
        this.legendLayer = new LegendLayer("legend",{
            style: {
                top: ()=>Util.toPixel(this.config.style.height) - Util.toPixel(this.config.legend.style.height),
                left: ()=>this.config.axis.padding.left,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.config.axis.padding.left) - Util.toPixel(this.config.axis.padding.right)
            }
        })
        this.chartTitleLayer.addTo(this)
        this.axisLayer.addTo(this)
        this.barLayer.addTo(this)
        this.tooltipLayer.addTo(this)
        this.legendLayer.addTo(this)
    }

    setConfig(c){
        this.barLayer.setConfig(_.toArray(_.pick(c,"bar")))
        this.axisLayer.setConfig(_.toArray(_.pick(c,"axis")))
        this.legendLayer.setConfig(_.toArray(_.pick(c,"legend")))
        this.tooltipLayer.setConfig(_.toArray(_.pick(c,"tooltip")))
        this.chartTitleLayer.setConfig(_.toArray(_.pick(c,"chartTitle")))
    }
}

export interface IBarChartConfig extends IChartConfig{
    bar: IBarLayerConfig,
    axis: IAxisLayerConfig,
    tooltip: ITooltipLayerConfig,
    legend: ILegendLayerConfig,
    chartTitle: ITitleLayerConfig
}

