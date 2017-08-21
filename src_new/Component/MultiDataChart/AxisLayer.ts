import d3 =require("d3")
import _ =require("lodash")
import { Util } from '../../Core/Util'
import { BaseLayer, ILayerConfig } from '../../Core/BaseLayer'
import {MultiDataChart} from '../MultiDataChart/MultiDataChart'
import {BarData,DataFilter} from '../../Core/DataFilter'

export class AxisLayer extends BaseLayer{
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    defaultConfig():IAxisLayerConfig {
        return Util.deepExtend(super.defaultConfig(),{
            className: "axis",
            axis:{
                format:{x:null,y:null},
                key:{x:"x",y:"y"},
                ticks:{x:null,y:null},
            },
            borderPadding:6,
            padding: {
                top:"10px",
                right:"20px",
                bottom:"40px",
                left:"50px"
            },
            type:"line",
            verticalGridLine:false,
            horizontalGridLine:true,
            yAxisTitleType:"time"
        })
    }

    config:IAxisLayerConfig
    chart:MultiDataChart

    render(){
        this.el.innerHTML=""
        if(this.chart.measures.length != 0) {
        let maxX = this.chart.max(this.config.axis.key.x),
            maxY = this.chart.max(this.config.axis.key.y)
            
        let xScale,
            yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([(Util.toPixel(this.config.style.height)-Util.toPixel(this.config.padding.bottom)), 
                                Util.toPixel(this.config.padding.top)])
        
        if(this.config.type == "line") {
            xScale = d3.scaleLinear()
                       .domain([0, this.chart.max(this.config.axis.key.x)])
                       .range([Util.toPixel(this.config.padding.left), 
                               (Util.toPixel(this.config.style.width)-Util.toPixel(this.config.padding.right))])
        }
        else if(this.config.type == "ordinal") {
            let domain = [],ds = this.chart.measures[0].data
            _.each(ds, (d:BarData,i)=>{
                domain.push(d.x)
             })
            xScale = d3.scaleBand()
                       .domain(domain)
                       .range([Util.toPixel(this.config.padding.left),
                               Util.toPixel(this.config.style.width) - Util.toPixel(this.config.padding.right)])
                       .paddingInner(0.1)
                       .paddingOuter(0.2)
        }
        else if(this.config.type == "time") {
            xScale = d3.scaleTime()
                       .domain([this.chart.min(this.config.axis.key.x),(this.chart.max(this.config.axis.key.x))])
                       .range([Util.toPixel(this.config.padding.left),
                               Util.toPixel(this.config.style.width) - Util.toPixel(this.config.padding.right)])
        }

        if(this.config.verticalGridLine) {
            let xGridLine = d3.axisBottom(xScale)
                              .tickSize(Util.toPixel(this.config.style.height) - Util.toPixel(this.config.padding.top) - Util.toPixel(this.config.padding.bottom))
                              .tickFormat((d,i)=>"")
            this.elD3.append("g")
                     .call(xGridLine)
                     .attr("transform", `translate(0, ${Util.toPixel(this.config.padding.top)})`)
                     .attr("class","grid-line")
        }
        if(this.config.horizontalGridLine) {
            let yGridLine = d3.axisLeft(yScale)
                              .tickSize(Util.toPixel(this.config.style.width) - Util.toPixel(this.config.padding.left) - Util.toPixel(this.config.padding.right))
                              .tickFormat((d,i)=>"")
            this.elD3.append("g")
                     .call(yGridLine)
                     .attr("transform", `translate(${Util.toPixel(this.config.style.width) - Util.toPixel(this.config.padding.right)}, 0)`)
                     .attr("class","grid-line")
        }

        let xAxis = d3.axisBottom(xScale)
                      .tickFormat(this.config.axis.format.x)
                      .ticks(this.config.axis.ticks.x)
        this.elD3.append("g")
                 .classed("xAxis axis",true)
                 .call(xAxis)
                 .attr("transform",`translate(0,${Util.toPixel(this.config.style.height) - Util.toPixel(this.config.padding.bottom)})`)
        
        let yAxisTitle:string, yAxisTickFormat
        if(this.config.yAxisTitleType == "time") {
            if(maxY <= 60) {
                yAxisTitle = "seconds"
                yAxisTickFormat = (d:number)=>{
                    return d.toString()
                }
            }
            else if(maxY <= 3600) {
                yAxisTitle = "minutes"
                yAxisTickFormat = (d:number)=>{
                    return d3.format(".1f")(d / 60)
                }
            }
            else {
                yAxisTitle = "hours"
                yAxisTickFormat = (d:number)=>{
                    return d3.format(".1f")(d / 3600)
                }
            }
        }
        else if(this.config.yAxisTitleType == "speed") {
            yAxisTitle = "km/h"
            yAxisTickFormat = (d:number)=>{
                    return d3.format(".1f")(d)
            }
        }
        
        let yAxis:any = d3.axisLeft(yScale)
                      .ticks(this.config.axis.ticks.y)
                      .tickFormat(yAxisTickFormat)

        this.elD3.append("g")
                 .classed("yAxis axis",true)
                 .call(yAxis)
                 .attr("transform",`translate(${Util.toPixel(this.config.padding.left)},0)`)
          
        this.elD3.append("text")
                 .classed("yAxisTitle",true)
                 .attr("x",-70)
                 .attr("y",0)
                 .attr("transform","rotate(-90)")
                 .attr("alignment-baseline","hanging")
                 .text(yAxisTitle)
        }
        return this
    }
}

export interface IXYAxisConfig{
    format:{x:any,y:any}|undefined|null,
    key:{x:string,y:string},
    ticks:{x:number,y:number}|null|undefined
}

export interface IAxisLayerConfig extends ILayerConfig{
    axis?:IXYAxisConfig,
    borderPadding?:number
    padding?: {
        top: string|undefined|null,
        right: string|undefined|null,
        bottom: string|undefined|null,
        left: string|undefined|null
    }
    type?:string
    verticalGridLine?:boolean,
    horizontalGridLine?:boolean,
    yAxisTitleType?:string
}