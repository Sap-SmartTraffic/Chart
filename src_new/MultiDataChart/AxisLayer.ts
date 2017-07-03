import { BaseLayer, ILayerConfig } from '../Core/BaseLayer'
import d3 =require("d3")
import _ =require("underscore")
import { Util } from '../Core/Util';
import {IMultiDataChart} from "./MultiDataChart"
export class Axislayer extends BaseLayer{
        chart:IMultiDataChart
        config:IAxislayerConfig
        render(){
            this.el.innerHTML=""
            _.each(this.config.asix,(a)=>{
                  if(a.location=="bottom"){
                      this._renderBottom(a,this.el)
                  }
            })
            return this
        }
        _renderBottom(conf:IAxisConfig,svg:Element){
             let bottom=d3.select(svg)
                            .append("svg:g")
                            .classed("bottom axis",true)
                            .attr("transfrom",`transation(0,${Util.toPixel(this.config.style.height)-conf.offset})`)
            let scale=d3.scaleLinear().domain(this.chart.getDomain(conf.key)).range([0,Util.toPixel(this.config.style.width)])
            let axis=d3.axisBottom(scale)
            bottom.call(axis)
        }
}
export interface IAxisConfig{
    location:string,
    fomate:Function,
    offset:number,
    key:string
}
export interface IAxislayerConfig extends ILayerConfig{
    asix:IAxisConfig[]
}