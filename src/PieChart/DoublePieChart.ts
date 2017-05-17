import d3 =require("d3")
import _ =require("underscore")
import Util=require("Util")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import {TitleLayer} from "TitleLayer"
import {PieLayer} from "PieLayer"
export class DoublePieChart extends BaseChart{
    mainTitle: TitleLayer
    pieLayer1: PieLayer
    pieLayer2: PieLayer
    
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle",textAlign:"center"})
        this.pieLayer1 = new PieLayer("pie1", {className: "pieChart1"})
        this.pieLayer2 = new PieLayer("pie2", {className: "pieChart2"})
        this.addLayer(this.mainTitle)
        this.addLayer(this.pieLayer1)
        this.addLayer(this.pieLayer2)
        this.init()
    }

    init(){
        this.on("chartUpdate",()=>{
            ///calculate layout
            this.mainTitle.setLayout({width:"100%", height:this.mainTitle.getTitleRect().height+"px"})
            this.pieLayer1.setLayout({top:this.mainTitle.getTitleRect().height+"px", width:Util.toPixel(this.config.width) / 2 +"px", height: (Util.toPixel(this.config.height) - this.mainTitle.getTitleRect().height)+"px"})
            this.pieLayer2.setLayout({top:this.mainTitle.getTitleRect().height+"px",left:Util.toPixel(this.config.width) / 2 +"px", width:Util.toPixel(this.config.width)/2+"px", height:(Util.toPixel(this.config.height) - this.mainTitle.getTitleRect().height)+"px"})
        })
    }
}