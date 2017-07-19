import d3 =require("d3")
import _ = require("underscore")
import {Util} from "../../../Core/Util"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"
import {AxisLayer} from "../../MultiDataChart/AxisLayer"
import {TooltipLayer,TooltipData} from "../../Layer/TooltipLayer"
import {LegendLayer} from "../../MultiDataChart/LegendLayer"

export class BoxplotLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change measure_change",()=>{
                this.update()
            })
        })
    }
    config: BoxplotLayerConfig
    defaultConfig(): BoxplotLayerConfig {
        return {
            tagName: "svg",
            className: "boxplotChart",
            style: {
                top: "0px",
                left: "0px",
                bottom: null,
                right: null,
                position: "absolute",
                zindex: 0,
                width: "400rem",
                height: "200rem"
            }
        }
    }

    chart:MultiDataChart

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let self = this
        let ds = this.chart.getMeasure("bar")
        if(!ds || typeof(ds) == undefined || ds.length==0) {
            return
        }

        return this
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface BoxplotLayerConfig extends ILayerConfig {

}

export interface BoxplotData {

}

export class BoxplotChart extends MultiDataChart {
    boxplotLayer:BoxplotLayer
    axisLayer:AxisLayer
    tooltipLayer:TooltipLayer
    legendLayer:LegendLayer

    constructor(conf?) {
        super(conf)
        this.axisLayer = new AxisLayer("axis",{
            style: {
                width: this.config.style.width,
                height: this.config.style.height
            },
            type:"ordinal",
            verticalGridLine:false
        })
        this.boxplotLayer = new BoxplotLayer("boxplot",{
            style: {
                top: ()=>this.axisLayer.config.padding.top,
                left: ()=>this.axisLayer.config.padding.left,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right),
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom)
            }
        })
        this.tooltipLayer = new TooltipLayer("tooltip",{
            style: {
                top: ()=>this.axisLayer.config.padding.top,
                left: ()=>this.axisLayer.config.padding.left,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right),
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom)
            }
        })
        this.legendLayer = new LegendLayer("legend",{
            style: {
                top: ()=>this.axisLayer.config.style.height,
                left: ()=>this.axisLayer.config.padding.left,
                width: ()=>Util.toPixel(this.axisLayer.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left) - Util.toPixel(this.axisLayer.config.padding.right)
            }
        })
        this.axisLayer.addTo(this)
        this.boxplotLayer.addTo(this)
        this.tooltipLayer.addTo(this)
        this.legendLayer.addTo(this)
    }

    setConfig(c:BoxplotLayerConfig){
        this.boxplotLayer.setConfig(_.pick(c,"key"))
        this.axisLayer.setConfig(_.pick(c,"key"))
    }
}

