import d3 =require("d3")
import _ = require('lodash');
import { Util } from '../../Core/Util'
import { BaseLayer, ILayerConfig } from '../../Core/BaseLayer'
import { MultiDataChart } from '../MultiDataChart/MultiDataChart'
export class TooltipLayer extends BaseLayer{
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change data_change",()=>{
                this.update()
            })
        })
    }

    config:ITooltipLayerConfig
    defaultConfig():ITooltipLayerConfig{
        return Util.deepExtend(super.defaultConfig(),{tagName:"div",className:"tooltipContainer",style:{width:"150px", height:"100px"}})
    }
    chart: MultiDataChart
   
    getSingleTooltipContent(ds):string {
        let textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>"+ ds.xMark +"</th></tr>"
        let text = "<tr><td class='name'><span style='background-color:"+ this.chart.getColor(ds.series) +"'></span>" +  ds.series + "</td><td class='value'>"+ ds.value +"</td></tr>"
        let textEnd = "</tbody></table>"
        return textStart + text + textEnd
    }

    getGroupTooltipContent(ds:TooltipData):string {
        let textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>"+ ds.xMark +"</th></tr>"
        let text = ""
        _.each(ds.data,(d)=>{
            text += "<tr><td class='name'><span style='background-color:"+ this.chart.getColor(d.id) +"'></span>" + d.id + "</td><td class='value'>"+ d.value +"</td></tr>"
        })
        let textEnd = "</tbody></table>"
        return textStart + text + textEnd
    }

    render(){
        this.el.innerHTML = ""
        let tooltipBox = this.elD3.append("div")
        this.chart.on("showSingleTooltip",(d)=>{
            tooltipBox.style("display","block")
                      .html(this.getSingleTooltipContent(d))
        })
        this.chart.on("showGroupTooltip",(d)=>{
            tooltipBox.style("display","block")
                      .html(this.getGroupTooltipContent(d))
        })
        this.chart.on("moveTooltip",()=>{
            if(d3.mouse(this.el)[0] > Util.toPixel(this.config.style.width)/2) {
                tooltipBox.style("top",d3.mouse(this.el)[1] +"px")
                          .style("left",d3.mouse(this.el)[0] - Util.toPixel(tooltipBox.style("width"))+"px")
                          .style("position","absolute")
            }
            else {
                tooltipBox.style("top",d3.mouse(this.el)[1] +"px")
                          .style("left",d3.mouse(this.el)[0] + "px")
                          .style("position","absolute")
            }

            
        })
        this.chart.on("hideTooltip",()=>{
            tooltipBox.style("display","none")
        })
        return this
    }
}

export interface ITooltipLayerConfig extends ILayerConfig{
}

export interface TooltipData {
    xMark:any,
    data:any[]
}