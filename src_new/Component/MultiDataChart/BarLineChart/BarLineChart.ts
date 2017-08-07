import d3 =require("d3")
import _ = require("lodash")
import {Util} from "../../../Core/Util"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../../Core/BaseLayer"
import {AxisLayer} from "../../MultiDataChart/AxisLayer"
import {TooltipLayer,TooltipData} from "../../Layer/TooltipLayer"
import {LegendLayer} from "../../MultiDataChart/LegendLayer"
import {LineLayer} from "../../MultiDataChart/LineChart/LineChart"
import {BarLayer} from "../../MultiDataChart/BarChart/BarChart"

export class BarLineChart extends MultiDataChart {
    barLayer:BarLayer
    lineLayer:LineLayer
    axisLayer:AxisLayer
    tooltipLayer:TooltipLayer
    legendLayer:LegendLayer

    constructor(conf?) {
        super(conf)
        this.axisLayer = new AxisLayer("axis",{
            style: {
                width: ()=>this.config.style.width,
                height: ()=>this.config.style.height
            },
            axis:{
                format:{
                    x:d3.timeFormat("%H:%M")
                },
                ticks:{
                    x:6
                }
            },
            type:"time"
        })
        
        this.barLayer = new BarLayer("bar",{
            style: {
                top: this.axisLayer.config.padding.top,
                left: this.axisLayer.config.padding.left,
                width: Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right),
                height: Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom)
            }
        })

        this.lineLayer = new LineLayer("line",{
            style: {
                top: ()=>Util.toPixel(this.axisLayer.config.padding.top) - this.axisLayer.config.borderPadding,
                left: ()=>Util.toPixel(this.axisLayer.config.padding.left) - this.axisLayer.config.borderPadding,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right) + this.axisLayer.config.borderPadding * 2,
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom) + this.axisLayer.config.borderPadding * 2
            }
        })
    
        this.tooltipLayer = new TooltipLayer("tooltip",{
            style: {
                top: ()=>Util.toPixel(this.axisLayer.config.padding.top) - this.axisLayer.config.borderPadding,
                left: ()=>Util.toPixel(this.axisLayer.config.padding.left) - this.axisLayer.config.borderPadding,
                width: ()=>Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right) + this.axisLayer.config.borderPadding * 2,
                height: ()=>Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom) + this.axisLayer.config.borderPadding * 2
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
        this.barLayer.addTo(this)
        this.lineLayer.addTo(this)
        this.tooltipLayer.addTo(this)
        this.legendLayer.addTo(this)
    
    }
}
