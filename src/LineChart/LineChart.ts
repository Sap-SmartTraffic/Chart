import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import{TitleLayer}from "TitleLayer"
import{LineLayer} from"LineLayer"
export class LineChart extends BaseChart{
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe"})
        this.lineLayer=new LineLayer()
        this.addLayer(this.mainTitle)
        this.addLayer(this.lineLayer)
        this.init()
    }
    layoutData:any
    init(){
        
        this.on("calculateStyleDone",()=>{
            this.mainTitle.setStyle({width:this.style.width,height:"30px"})
            this.lineLayer.setStyle({top:"30px",width:this.layoutData.lineLayerWidth,height:"200px"})
        })
    }
    calculateStyle(){
        this.layoutData={lineLayerWidth:"500px"}
        this.fire("calculateStyleDone")
        return this
    }
    mainTitle:TitleLayer
    lineLayer:LineLayer
}