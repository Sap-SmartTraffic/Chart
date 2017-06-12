import d3 =require("d3")
import _ =require("underscore")
import Util=require("Util")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import {TitleLayer} from "TitleLayer"
import {DashLayer} from "DashLayer"

export class DashChart extends BaseChart{
    mainTitle: TitleLayer
    dashLayer: DashLayer
    
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"pieChart",className:"mainTitle",textAlign:"center"})
        this.dashLayer = new DashLayer("dash", {className: "dashChart"})
        this.addLayer(this.dashLayer)
        this.addLayer(this.mainTitle)
        this.init()
    }

    init(){
        this.on("chartUpdate",()=>{
            ///calculate layout
            this.mainTitle.setLayout({width:"100%", height:this.mainTitle.getTitleRect().height+"px"})
            this.dashLayer.setLayout({top:this.mainTitle.getTitleRect().height+"px", width:Util.toPixel(this.config.width)+"px", height: Util.toPixel(this.config.height) - Util.toPixel(this.mainTitle.layout.height)+"px"})
            //this.tooltipLayer.setLayout({width:"150px",height:"100px"})
        })
        
        this.on("measure-change",()=>{
            this.dashLayer.updateDom()
        })
    }
}