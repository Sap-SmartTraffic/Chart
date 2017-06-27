import d3 =require("d3")
import _ =require("underscore")
import {Util}from "../../Core/Util"
import {BaseChart} from "../../Core/BaseChart"
import {TitleLayer} from "../../Layer/TitleLayer"
import {BarLayer} from "../../Layer/BarLayer"
import {Measure} from '../../Core/Measure';

export class BarChart extends BaseChart{
    barLayer: BarLayer
    
    constructor(conf?){
        super(conf)
        this.barLayer = new BarLayer("barchart",{
            style:{
                width:this.config.style.width,
                height:this.config.style.height
            }
        })
        this.on("measure_change",this.barLayer.render,this.barLayer)
        this.addLayer(this.barLayer)
    }
}