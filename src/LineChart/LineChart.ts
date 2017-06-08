import d3 =require("d3")
import _ =require("underscore")
import Util=require("Util")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import {TitleLayer} from "TitleLayer"
import {AxisLayer} from "AxisLayer"
import {LineLayer} from "LineLayer"
import {LegendLayer} from "LegendLayer"
import {TooltipLayer} from "TooltipLayer"
export class LineChart extends BaseChart{
    mainTitle: TitleLayer
    lineLayer: LineLayer
    axisLayer: AxisLayer
    legendLayer: LegendLayer
    tooltipLayer: TooltipLayer
    
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle",textAlign:"center"})
        this.axisLayer = new AxisLayer("axis",{type:"line",xAxisTitle:"日期", yAxisTitle:"当天参与活动的人数", className:"axisLayer"})
        this.lineLayer=new LineLayer("line",{className:"line"})
        this.legendLayer = new LegendLayer("legend",{className:"legend"})
        this.tooltipLayer = new TooltipLayer("toolTip",{className:"toolTip"})
        this.addLayer(this.mainTitle)
        this.addLayer(this.axisLayer)
        this.addLayer(this.lineLayer)
        this.addLayer(this.legendLayer)
        this.addLayer(this.tooltipLayer)
        this.init()
    }

    init(){ 
        this.on("chartUpdate",()=>{
            this.mainTitle.setLayout({width:this.config.width, height:this.mainTitle.getTitleRect().height+"px"})
            this.legendLayer.setLayout({top:Util.toPixel(this.config.height) - Util.toPixel(this.legendLayer.config.height) + "px", width:this.config.width, height:this.legendLayer.config.height+"px"})
            this.axisLayer.setLayout({top:this.mainTitle.getTitleRect().height+"px",
                                      width:this.config.width,
                                      height:Util.toPixel(this.config.height)-this.mainTitle.getTitleRect().height - Util.toPixel(this.legendLayer.layout.height) + "px"})
            this.lineLayer.setLayout({top:this.mainTitle.getTitleRect().height + Util.toPixel(this.axisLayer.config.smallPadding) + "px",
                                      left:this.axisLayer.calculatePaddingLeft()+"px",
                                      width:Util.toPixel(this.config.width) - this.axisLayer.calculatePaddingLeft() - Util.toPixel(this.axisLayer.config.smallPadding) + "px",
                                      height:Util.toPixel(this.config.height)-this.mainTitle.getTitleRect().height-this.axisLayer.calculatePaddingBottom() - Util.toPixel(this.axisLayer.config.smallPadding) - Util.toPixel(this.legendLayer.layout.height) +"px"})
            this.tooltipLayer.setLayout({width:"150px"})
        })
    }

    calculateLayout() {
        
    }
}