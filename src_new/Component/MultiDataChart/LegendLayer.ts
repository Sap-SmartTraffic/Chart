import d3 =require("d3")
import _ =require("underscore")
import {Util} from "../../Core/Util"
import {BaseLayer,ILayerConfig} from "../../Core/BaseLayer"
import {MultiDataChart} from "../MultiDataChart/MultiDataChart"
export class LegendLayer extends BaseLayer{
    defaultConfig():ILegendLayerConfig{
        return {
                tagName:"div",
                className:"legend",
                style:{
                    top:"0px",
                    left:"0px",
                    bottom:null,
                    right:null,
                    position:"absolute",
                    zindex:0,
                    width:"20rem",
                    height:"2rem"
                }
            }
    }
    config:ILegendLayerConfig
    chart:MultiDataChart
    render(){
        this.el.innerHTML = ""
        let ds = this.chart.getAllMeasure()
        let legendGroup = this.elD3.append("div").attr("class","legendGroup")
        _.each(ds,(d,i)=>{
            let legendUnit = legendGroup.append("div").attr("class","legendUnit legendUnit"+i)
            legendUnit.append("span").style("background-color",this.chart.getColor(d.id))
            legendUnit.append("span").text(d.id)
        })
        return this
    }
}

export interface ILegendLayerConfig extends ILayerConfig{
    
}