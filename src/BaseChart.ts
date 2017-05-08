import d3 =require("d3")
import _=require("underscore")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
import {Measure} from "Measure"
export class BaseChart extends Evented {
    constructor(conf?){
        super()
        if(!this.el){
            this.el=d3.select(document.createDocumentFragment()).append("xhtml:div").node()    
        }
        this.setConfig(conf)
       
    }
    config={
    }
    style={
        left:"0px",right:"0px",top:"0px",bottom:"0px",width:"300px",height:"300px",zIndex:1
    }
    setStyle(s){
        this.style=s
        this.reRender()
      
    }
    setConfig(c){
        _.each(c,(v,k)=>{
            this.config[k]=v
        })
    }
    calculateStyle(){
        this.fire("calculateStyleDone")
        return this
    }
    el:any
    isReady:boolean=false
    measures:Measure[]=[]
    layers:BaseLayer[]=[]
    addMeasure(m:Measure){
        this.measures.push(m)
    }
    addLayer(l:BaseLayer){
        let i =_.findIndex(this.layers,ll=>ll.id == l.id)
        if(i!=-1){
           this._clearLayer(this.layers[i])
           this.layers[i]=l
        }else{
            this.layers.push(l)
        }
        if(this.isReady){
            l.render()
        }
        l.chart=this
        return this
    }
    getContainer(){
        return this.el
    }
    removeLayer(id){
        if(_.isObject(id)){
            let i =_.findIndex(this.layers,ll=>ll.id == id.id)
            if(i!=-1){
                 this._clearLayer(this.layers[i])
                 this.layers=_.filter(this.layers,ll=>ll.id!=id.id)
            }  
        }else{
            let i =_.findIndex(this.layers,ll=>ll.id == id)
            if(i != -1){
                    this._clearLayer(this.layers[i])
                    this.layers=_.filter(this.layers,ll=>ll.id!=id)
            }  
        }
        return this
    }
    _clearLayer(l:BaseLayer){
        return this
    }
    updateStyle(){
        d3.select(this.el).style("height",this.style.height)
                            .style("width",this.style.width)
          _.invoke(this.layers,"updateStyle")
    }
    getColorByIndex(i){
        return d3.scaleOrdinal(d3.schemeCategory10)(i)
    }
    render(ref){
        this.calculateStyle()
        
        _.invoke(this.layers,"render")
        let dom=d3.select(ref)
        if(!dom.empty()){
            dom.node().appendChild(this.el)
        }
        this.updateStyle()
        return this
    }
    ref:any
    reRender(){
        if(this.el){
           d3.select(this.el).selectAll("*").remove()
        }
    }


}