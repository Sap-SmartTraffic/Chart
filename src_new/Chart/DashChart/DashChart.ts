import { Measure } from '../../Core/Measure';
import d3 =require("d3")
import _ =require("underscore")
import {BaseChart} from "../../Core/BaseChart"
import {TitleLayer} from "../../Layer/TitleLayer"
import {DashLayer} from "../../Layer/DashLayer"
import {Util}from "../../Core/Util"

export class DashChart extends BaseChart{
    dashLayer: DashLayer
    
    constructor(conf?){
        super(conf)
        this.dashLayer = new DashLayer("dashpie",{
            style:{
                width:this.config.style.width,
                height:this.config.style.height
            },
            padding:Util.toPixel("1.5rem")
        })
        this.on("measure_change",this.dashLayer.render,this.dashLayer)
        this.addLayer(this.dashLayer)
    }
    data(n:number){
        let m=new Measure(0,n,"dash")
        this.addMeasure(m)
        return this
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
