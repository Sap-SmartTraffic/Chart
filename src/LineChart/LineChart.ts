import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import{TitleLayer}from "TitleLayer"
import{LineLayer} from"LineLayer"
import Util=require("Util")
export class LineChart extends BaseChart{
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe"})
        this.lineLayer=new LineLayer()
        this.addLayer(this.mainTitle)
        this.addLayer(this.lineLayer)
        this.initHook()
    }
    initHook(){ 
        this.on("chartStyleChange",()=>{
            this.mainTitle.setLayout({width:"100%",height:this.mainTitle.getTitleRect().height+"px"})
            this.lineLayer.setLayout({top:"30px",width:this.style.width,height:Util.toPixel(this.style.height)-this.mainTitle.getTitleRect().height+"px"})
        })
    }
    mainTitle:TitleLayer
    lineLayer:LineLayer
}