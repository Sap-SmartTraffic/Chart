import { Evented } from "../Core/Evented";
import d3 = require("d3")
import _ = require("lodash")
import { Util } from "../Core/Util";
import { BaseLayer} from "../Core/BaseLayer";
import { View, IViewConfig, IViewConfigValue } from "../Core/View";
import { TitleLayer } from "./Layers/TitleLayer";
import { BaseChart } from "../Core/BaseChart";
let styles = Util.d3Invoke("style")
let attrs = Util.d3Invoke("attr")
export class CompareChart extends BaseChart {
    constructor(conf?) {
        super(conf)
        this.style({
            position:"relative"
        })
        this.style(_.pick(this.config,"width","height"))
        this.layers={}
    }
    isRender:boolean
    defaultConfig(){
        return _.extend(super.defaultConfig(),{class:"compareChart"})
    }
    layers:{
        titleLayer?:TitleLayer
    }
    addLayer(l:BaseLayer){
        if(l instanceof TitleLayer){
            this.layers.titleLayer=l
        }
        l.onAddToChart(this)
        return this
    }
    title(){
        if(!this.layers.titleLayer){
            let l=new TitleLayer({class:"mainTitle"})
            l.addTo(this)
        }
        return this.layers.titleLayer
    }
}