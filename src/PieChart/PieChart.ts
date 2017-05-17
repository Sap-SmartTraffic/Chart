import d3 =require("d3")
import _ =require("underscore")
import Util=require("Util")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import {TitleLayer} from "TitleLayer"
import {PieLayer} from "PieLayer"
export class PieChart extends BaseChart{
    mainTitle: TitleLayer
    pieLayer: PieLayer
    
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle",textAlign:"center"})
        this.pieLayer = new PieLayer("pie", {className: "pieChart"})
        this.addLayer(this.mainTitle)
        this.addLayer(this.pieLayer)
        this.init()
    }

    init(){
        this.on("chartUpdate",()=>{
            ///calculate layout
            this.mainTitle.setLayout({width:"100%", height:this.mainTitle.getTitleRect().height+"px"})
            this.pieLayer.setLayout({top:this.mainTitle.getTitleRect().height+"px", width:Util.toPixel(this.config.width)+"px", height: (Util.toPixel(this.config.height) - this.mainTitle.getTitleRect().height)+"px"})
        })
    }
}