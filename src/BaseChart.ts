import d3 =require("d3")
import _=require("underscore")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
import {Measure} from "Measure"
import Util=require("Util")
export class BaseChart extends Evented {
    el:any
    isReady:boolean=false
    measures:Measure[]=[]
    layers:BaseLayer[]=[]

    config={
        width:"600px",
        height:"400px",
        position:"absolute"
    }

    constructor(conf?){
        super()
        if(!this.el){
            this.el=d3.select(document.createDocumentFragment()).append("xhtml:div").node()    
        }
        this.setConfig(conf)
    }

    setConfig(c){
        _.each(c,(v,k)=>{
            this.config[k]=v
        })
        this.update()
    }

    update(){
        d3.select(this.el).style("width",this.config.width)
                          .style("height",this.config.height)
                          .style("position",this.config.position)
        this.fire("chartUpdate",{width:this.config.width,height:this.config.height})

    }

    getContainer(){
        return this.el
    }

    loadMeasures(measures:any[]) {
        _.each(measures, (d)=>{
            let measure = new Measure(d.id, d.data)
            this.addMeasure(measure)
        })
    }
    
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

    stringRectCache:any=Util.CacheAble(Util.getStringRect,(s,cls,fontSize)=>s.toString().length+" "+cls+fontSize)
    
    getStringRect(s,cls?,fontSize?){
        let rect=this.stringRectCache(s,cls,fontSize)
        return {width:rect.width,height:rect.height}
    }

    getColorByIndex(i){
        return d3.schemeCategory10[i]
    }

    render(ref){
        this.update()
        _.invoke(this.layers,"render")
        let dom = d3.select(ref)
        if(!dom.empty()){
            dom.node().appendChild(this.el)
        }
        return this
    }
}