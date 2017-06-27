import { Measure } from '../../Core/Measure';
import d3 =require("d3")
import _ =require("underscore")
import {BaseChart} from "../../Core/BaseChart"
import {TitleLayer} from "../../Layer/TitleLayer"
import {RangeLayer} from "../../Layer/RangeLayer"
import Util=require("../../Core/Util")
export class RangeChart extends BaseChart {
    rangeLayer: RangeLayer

    constructor(conf?) {
        super(conf)
        this.rangeLayer = new RangeLayer("rangechart",{
            style:{
                top:"40px",
                width: this.config.style.width,
                height: this.config.style.height
            }
        })
        
        this.on("measure_change",this.rangeLayer.render,this.rangeLayer)
        this.addLayer(this.rangeLayer)
    }

    data(data:any[]){
        let parseTime = d3.timeParse("%H")
        _.each(data,(d,i)=>{
            d.time = parseTime(d.time)
        })
        let m=new Measure("0",data,"range")
        this.addMeasure(m)
        return this
    }
}