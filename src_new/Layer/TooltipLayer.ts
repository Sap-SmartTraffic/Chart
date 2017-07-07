import d3 =require("d3")
import _ =require("underscore")
import { Util } from '../Core/Util'
import { BaseLayer, ILayerConfig } from '../Core/BaseLayer'
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
        return {
            tagName:"div",
            className:"tooltipContainer",
            style:{
                top:"0px",
                left:"0px",
                bottom:null,
                right:null,
                position:"absolute",
                zindex:0,
                width:"150px",
                height:"100px"
            }
        }
    }
    chart: MultiDataChart

    getTooltipContent(ds:TooltipData) {
        let textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>"+ ds.xMark +"</th></tr>"
        let text = ""
        _.each(ds.data,(d)=>{
            text += "<tr><td class='name'><span style='background-color:"+ this.chart.getColor(d.id) +"'></span>" + "系列" + d.id + "</td><td class='value'>"+ d.value +"</td></tr>"
        })
        let textEnd = "</tbody></table>"
        return textStart + text + textEnd
    }

    
    render(){
        this.chart.on("showTooltip",(d)=>{
            this.elD3.style("display","block")
                     .html(this.getTooltipContent(d))
        })
        this.chart.on("moveTooltip",()=>{
            this.elD3.style("top",d3.event.y+"px")
                     .style("left",d3.event.x+"px")
        })
        this.chart.on("hideTooltip",()=>{
            this.elD3.style("display","none")
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