import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import Util=require("Util")
export class BaseLayer extends Evented{
    el:any
    id:string
    isInit:boolean = false
    chart:BaseChart
    config:any
    layout={
        top:"0px",right:"",bottom:"",left:"0px",width:"0px",height:"0px",zIndex:10
    }
    
    constructor(id?,conf?){
        super()
        this.id=id||_.uniqueId("layer")
        this.setConfig(conf)
    }
    
    setConfig(c){
        if(!this.config){
            this.config={}
        }
        _.each(c,(v,k)=>{
            this.config[k]=v
        })
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

    update(){
        if(this.el){
            this.updateLayout()
            this.updateDom()
        }
    }
    
    updateLayout(){
        let el=d3.select(this.el).style("position","absolute")
        if(this.layout){
            _.each(this.layout,(v,k)=>{
                el.style(k,v)
            })
        }
    }

    updateDom() {
        
    }

    calculateLayout() {

    }

    addTo(c:BaseChart){
        this.chart=c
        this.chart.addLayer(this)
        //this.chart.on("calculateStyleDone",this.updateStyle.bind(this))
        return this
    }

    render(){
        if(this.el){
            d3.select(this.chart.getContainer()).node().appendChild(this.el)
        }else{
            this.el=this.renderer()
            d3.select(this.chart.getContainer()).node().appendChild(this.el)
            this.updateLayout()
        }
        return this
    }
    
    renderer(){}
}