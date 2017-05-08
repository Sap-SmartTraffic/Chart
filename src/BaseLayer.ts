import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import Util=require("Util")
export class BaseLayer extends Evented{
    constructor(id?,conf?){
        super()
        this.id=id||_.uniqueId("layer")
        this.setConfig(conf)
    }
    
    addTo(c:BaseChart){
        this.chart=c
        this.chart.addLayer(this)
        //this.chart.on("calculateStyleDone",this.updateStyle.bind(this))
        return this
    }
    setConfig(c){
        if(!this.config){
            this.config={}
        }
        _.each(c,(v,k)=>{
            this.config[k]=v
        })
    }
    el:any
    id:string
    isInit:boolean = false
    layout={
        left:"0px",right:"",top:"0px",bottom:"",width:"300px",height:"300px",zIndex:10
    }
    setLayout(s){
        _.each(s,(v,k)=>{
            this.layout[k]=v
        })
        // if(s.left!=undefined){
        //     this.layout.left=Util.toPixel(s.left,this.chart.style.width)
        // }
        // if(s.right!=undefined){
        //     this.layout.right=Util.toPixel(s.right,this.chart.style.width)
        // }
        // if(s.width!=undefined){
        //     this.layout.width=Util.toPixel(s.width,this.chart.style.width)
        // }
        // if(s.height!=undefined){
        //     this.layout.height=Util.toPixel(s.height,this.chart.style.height)
        // }
        // if(s.top!=undefined){
        //     this.layout.top=Util.toPixel(s.width,this.chart.style.height)
        // }
        // if(s.bottom!=undefined){
        //     this.layout.bottom=Util.toPixel(s.height,this.chart.style.height)
        // }
        this.update()
        return this
    }
    config:any
    calculateLayout(){
        
        return this
    }
    updateLayout(){
        let el=d3.select(this.el).style("position","absolute")
        if(this.layout){
            _.each(this.layout,(v,k)=>{
                el.style(k,v)
            })

        }
    }
    updateDom(){}
    update(){
        if(this.el){
            this.calculateLayout()
            this.updateLayout()
            this.updateDom()
        }
    }
    render(){
        if(this.el){
            d3.select(this.chart.getContainer()).node().appendChild(this.el)

        }else{
            this.calculateLayout()
            this.updateLayout()
            this.el=this.renderer()
            d3.select(this.chart.getContainer()).node().appendChild(this.el)
        }
        return this
    }
    chart:BaseChart
    renderer(){}
}