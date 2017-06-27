import { Measure } from '../../Core/Measure';
import d3 =require("d3")
import _ =require("underscore")
import {BaseChart} from "../../Core/BaseChart"
import {TitleLayer} from "../../Layer/TitleLayer"
import {PieLayer} from "../../Layer/PieLayer"
import {Util}from "../../Core/Util"

export class PieChart extends BaseChart {
    pieLayer: PieLayer

    constructor(conf?) {
        super(conf)
        this.pieLayer = new PieLayer("piechart",{
            style:{
                width: this.config.style.width,
                height: this.config.style.height
            },
            padding: Util.toPixel("1.5rem")
        })
        this.on("measure_change",this.pieLayer.render,this.pieLayer)
        this.addLayer(this.pieLayer)
        
    }

    data(data:any[]){
        let count = this.pieLayer.config.segmentCount,
            start = this.pieLayer.config.segmentStart
        let dataset = []
        for(let i = 0; i < count; i++) {
            dataset.push({"time":(start+i)>24? (start+i-24):(start+i),"value":null})
        }
        for(let i = 0; i < data.length; i++) {
            let index = _.findIndex(dataset,{"time":data[i].time})
            dataset[index] = data[i]
        }
        let m=new Measure("0",dataset,"pie")
        this.addMeasure(m)
        return this
    }
}