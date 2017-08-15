import d3 =require("d3")
import _ =require("lodash")
import {Util} from "../../Core/Util"
import {BaseLayer,ILayerConfig} from "../../Core/BaseLayer"
import {MultiDataChart} from "../MultiDataChart/MultiDataChart"
export class LegendLayer extends BaseLayer{
    constructor(id,conf?){
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    defaultConfig():ILegendLayerConfig{
        return Util.deepExtend(super.defaultConfig(),{
            tagName:"div",
            className:"legend",
            style:{
                width:"20rem",
                height:"2rem"
            }
        })
    }
    config:ILegendLayerConfig
    chart:MultiDataChart
    render(){
        this.el.innerHTML = ""
        let ds = this.chart.getAllMeasure()
        let legendGroup = this.elD3.append("div").attr("class","legendGroup")
        _.each(ds,(d,i)=>{
            let legendUnit = legendGroup.append("div").attr("class","legendUnit legendUnit"+i)
            legendUnit.append("span").style("background-color",this.chart.getColor(d.id)).classed("iconSpan",true)
            legendUnit.append("span").text(d.id).classed("textSpan",true)
        })
        return this
    }
}

export interface ILegendLayerConfig extends ILayerConfig{
    
}