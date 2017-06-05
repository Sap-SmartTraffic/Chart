import d3 =require("d3")
import _ =require("underscore")
import Util=require("Util")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import {TitleLayer} from "TitleLayer"
import {AxisLayer} from "AxisLayer"
import {RangeLayer} from "RangeLayer"
import {LegendLayer} from "LegendLayer"
export class RangeChart extends BaseChart{
    mainTitle: TitleLayer
    rangeLayer: RangeLayer
    axisLayer: AxisLayer
    legendLayer: LegendLayer
    
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle",textAlign:"center"})
        this.axisLayer = new AxisLayer("axis",{type:"range",xAxisTitle:"日期", yAxisTitle:"当天参与活动的人数", className:"axisLayer"})
        this.rangeLayer=new RangeLayer("range",{className:"range"})
        this.legendLayer = new LegendLayer("legend",{className:"legend"})
        this.addLayer(this.mainTitle)
        this.addLayer(this.axisLayer)
        this.addLayer(this.rangeLayer)
        this.addLayer(this.legendLayer)
        this.init()
    }

    init(){ 
        this.on("chartUpdate",()=>{
            this.mainTitle.setLayout({width:this.config.width, height:this.mainTitle.getTitleRect().height+"px"})
            this.legendLayer.setLayout({top:Util.toPixel(this.config.height) - Util.toPixel(this.legendLayer.config.height) + "px", width:this.config.width, height:this.legendLayer.config.height+"px"})
            this.axisLayer.setLayout({top:this.mainTitle.getTitleRect().height+"px",
                                      width:this.config.width,
                                      height:Util.toPixel(this.config.height)-this.mainTitle.getTitleRect().height - Util.toPixel(this.legendLayer.layout.height) + "px"})
            this.rangeLayer.setLayout({top:this.mainTitle.getTitleRect().height + Util.toPixel(this.axisLayer.config.smallPadding) + "px",
                                      left:this.axisLayer.calculatePaddingLeft()+"px",
                                      width:Util.toPixel(this.config.width) - this.axisLayer.calculatePaddingLeft() - Util.toPixel(this.axisLayer.config.smallPadding) + "px",
                                      height:Util.toPixel(this.config.height)-this.mainTitle.getTitleRect().height-this.axisLayer.calculatePaddingBottom() - Util.toPixel(this.axisLayer.config.smallPadding) - Util.toPixel(this.legendLayer.layout.height) +"px"})
        })
    }

    calculateLayout() {
        
    }
}