import { Measure } from '../../Core/Measure';
import d3 =require("d3")
import _ =require("underscore")
import {BaseChart} from "../../Core/BaseChart"
import {TitleLayer} from "../../Layer/TitleLayer"
import {DashLayer} from "../../Layer/DashLayer"
import Util=require("../../Core/Util")

export class DashChart extends BaseChart{
    mainTitle: TitleLayer
    dashLayer: DashLayer
    
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer({value:"pieChart",className:"mainTitle"})
        this.dashLayer = new DashLayer({className: "dashChart",width:Util.toPixel(this.config.width),height:Util.toPixel(this.config.height)})
        this.addLayer(this.dashLayer)
        this.addLayer(this.mainTitle)
        //this.init()
    }
    loadMeasure(m:Measure){
        m.type="dash"
        m.id="0"
        this.addMeasure(m)
    }
    // init(){
    //     this.on("chartUpdate",()=>{
    //         ///calculate layout
    //         this.mainTitle.setLayout({width:"100%", height:this.mainTitle.getTitleRect().height+"px"})
    //         this.dashLayer.setLayout({top:this.mainTitle.getTitleRect().height+"px", width:Util.toPixel(this.config.width)+"px", height: Util.toPixel(this.config.height) - Util.toPixel(this.mainTitle.layout.height)+"px"})
    //         //this.tooltipLayer.setLayout({width:"150px",height:"100px"})
    //     })
        
    //     this.on("measure-change",()=>{
    //         this.dashLayer.updateDom()
    //     })
    // }
}