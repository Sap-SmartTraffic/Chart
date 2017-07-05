import d3 =require("d3")
import _ =require("underscore")
import { Util } from '../Core/Util'
import { BaseLayer, ILayerConfig } from '../Core/BaseLayer'
import {MultiDataChart} from '../MultiDataChart/MultiDataChart'

export class AxisLayer extends BaseLayer{
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change data_change",()=>{
                this.update()
            })
        })
    }
    defaultConfig():IAxisLayerConfig {
        return {
            tagName: "svg",
            className: "axis",
            style: {
                top: "0px",
                left: "0px",
                bottom: null,
                right: null,
                position: "absolute",
                zindex: 0,
                width: "200rem",
                height: "100rem"
            },
            axis:{
                format:{x:null,y:null},
                key:{x:"x",y:"y"},
                ticks:{x:null,y:null},
            },
            padding: {
                top:"10px",
                right:"10px",
                bottom:"40px",
                left:"40px"
            },
            verticalGridLine:true,
            horizontalGridLine:true
        }
    }

    config:IAxisLayerConfig
    chart:MultiDataChart

    render(){
        this.el.innerHTML=""
        let xScale = d3.scaleLinear()
                       .domain([0, this.chart.max(this.config.axis.key.x)])
                       .range([Util.toPixel(this.config.padding.left), 
                               (Util.toPixel(this.config.style.width)-Util.toPixel(this.config.padding.right))]),
            yScale = d3.scaleLinear()
                       .domain([0, this.chart.max(this.config.axis.key.y)])
                       .range([(Util.toPixel(this.config.style.height)-Util.toPixel(this.config.padding.bottom)), 
                                Util.toPixel(this.config.padding.top)])
        if(this.config.verticalGridLine) {
            let xGridLine = d3.axisBottom(xScale)
                              .tickSize(Util.toPixel(this.config.style.height) - Util.toPixel(this.config.padding.top) - Util.toPixel(this.config.padding.bottom))
                              .tickFormat("")
            this.elD3.append("g")
                     .call(xGridLine)
                     .attr("transform", `translate(0, ${Util.toPixel(this.config.padding.top)})`)
                     .attr("class","grid-line")
        }
        if(this.config.horizontalGridLine) {
            let yGridLine = d3.axisLeft(yScale)
                              .tickSize(Util.toPixel(this.config.style.width) - Util.toPixel(this.config.padding.left) - Util.toPixel(this.config.padding.right))
                              .tickFormat("")
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
        let yAxis = d3.axisLeft(yScale)
                      .tickFormat(this.config.axis.format.y)
                      .ticks(this.config.axis.ticks.y)
        this.elD3.append("g")
                 .classed("yAxis axis",true)
                 .call(yAxis)
                 .attr("transform",`translate(${Util.toPixel(this.config.padding.left)},0)`)

        return this
    }
}

export interface IXYAxisConfig{
    format:{x:any,y:any}|undefined|null,
    key:{x:string,y:string},
    ticks:{x:number,y:number}|null|undefined
}

export interface IAxisLayerConfig extends ILayerConfig{
    axis:IXYAxisConfig,
    padding: {
        top: string|undefined|null,
        right: string|undefined|null,
        bottom: string|undefined|null,
        left: string|undefined|null
    }
    verticalGridLine:boolean,
    horizontalGridLine:boolean
}