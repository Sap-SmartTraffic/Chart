import d3 =require("d3")
import _ =require("underscore")
import {Util}from "../../Core/Util"
import {BaseChart} from "../../Core/BaseChart"
import {LineLayer} from "../../Layer/LineLayer"
import {Measure} from '../../Core/Measure';

export class BarChart extends BaseChart{
    lineLayer: LineLayer
    
    constructor(conf?){
        super(conf)
        this.lineLayer = new LineLayer("linechart",{
            style:{
                width:this.config.style.width,
                height:this.config.style.height
            }
        })
        this.on("measure_change",this.lineLayer.render,this.lineLayer)
        this.addLayer(this.lineLayer)
    }
}