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
        // this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle"})
        this.lineLayer=new LineLayer()
       // this.addLayer(this.mainTitle)
        this.addLayer(this.lineLayer)
        this.init()
    }
    init(){ 
        this.on("chartUpdate",()=>{
            ///calculate layout
          //  this.mainTitle.setLayout({width:"100%",height:this.mainTitle.getTitleRect().height+"px"})
            this.lineLayer.setLayout({top:"0px",
                                width:this.config.width,
                                height:Util.toPixel(this.config.height)+"px"})
        })
        this.on("measure-change",()=>{
            this.lineLayer.updateDom()
        })
    }
    // mainTitle:TitleLayer
    lineLayer:LineLayer
}