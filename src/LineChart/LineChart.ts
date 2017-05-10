import d3 =require("d3")
import _ =require("underscore")
import Util=require("Util")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import {TitleLayer} from "TitleLayer"
import {AxisLayer} from "AxisLayer"
import {LineLayer} from"LineLayer"
export class LineChart extends BaseChart{
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle",textAlign:"center"})
        this.axisLayer = new AxisLayer("axis",{xAxisTitle:"x-coordinate", yAxisTitle:"y-coordinate", className:"axis"})
        this.lineLayer=new LineLayer("line1",{className:"line1"})
        this.addLayer(this.mainTitle)
        this.addLayer(this.lineLayer)
        this.addLayer(this.axisLayer)
        this.init()
    }
    init(){ 
        this.on("chartUpdate",()=>{
            ///calculate layout
            this.mainTitle.setLayout({width:"100%",height:this.mainTitle.getTitleRect().height+"px"})
            this.lineLayer.setLayout({top:this.mainTitle.getTitleRect().height,left:this.axisLayer.calculatePaddingLeft()+"px",width:Util.toPixel(this.config.width) - this.axisLayer.calculatePaddingLeft() + "px",height:Util.toPixel(this.config.height)-this.mainTitle.getTitleRect().height-this.axisLayer.calculatePaddingBottom()+"px"})
            this.axisLayer.setLayout({top:this.mainTitle.getTitleRect().height+"px",width:this.config.width,height:Util.toPixel(this.config.height)-this.mainTitle.getTitleRect().height+"px"})
        })
    }
    mainTitle:TitleLayer
    lineLayer:LineLayer
    axisLayer:AxisLayer
}