import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import{TitleLayer}from "TitleLayer"
import{LineLayer} from"./LineLayer"
import Util=require("Util")
export class LineChart extends BaseChart{
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle"})
        this.lineLayer=new LineLayer()
        this.addLayer(this.mainTitle)
        this.addLayer(this.lineLayer)
        this.init()
    }
    init(){ 
        this.on("chartUpdate",()=>{
            ///calculate layout
            this.mainTitle.setLayout({width:"100%",height:this.mainTitle.getTitleRect().height+"px"})
            this.lineLayer.setLayout({top:this.mainTitle.getTitleRect().height+"px",
                                width:this.config.width,
                                height:Util.toPixel(this.config.height)-this.mainTitle.getTitleRect().height+"px"})
        })
    }
    mainTitle:TitleLayer
    lineLayer:LineLayer
}