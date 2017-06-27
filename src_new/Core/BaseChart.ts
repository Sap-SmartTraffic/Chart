import d3 =require("d3")
import _=require("underscore")
import {Evented} from "./Evented"
import {BaseLayer} from "./BaseLayer"
import {Measure} from "./Measure"
import {Util}from"./Util"
import {View} from"./View"
export class BaseChart extends Evented{
    measures:Measure[]=[]
    layers:BaseLayer[]=[]
    rootView:View
    config:IChartConfig
    constructor(...conf){
        super()
        this.config=Util.deepExtend(this.defaultConfig(),conf)
        this.rootView=new View({tagName:"div",className:this.config.className})
        this.rootView.style(this.config.style)
    }
    addClass(c){
        this.rootView.addClass(c)
        this.fire("classchange")
        return this
    }
    removeClass(c){
        this.rootView.removeClass(c)
        this.fire("classchange")
        return this
    }
    defaultConfig():IChartConfig{
        return {
            style:{
                 width:"300px",
                 height:"300px",
            },
            className:"chart"
        }
    }
    renderAt(dom:Element|HTMLElement|SVGAElement|string){
       if(_.isString(dom)){
           let n:any = d3.select(dom).node()
           n.appendChild(this.rootView.el)

       }else{
          dom.appendChild(this.rootView.el)
       }
      
       this.render()
    }
    redraw(){
        setTimeout(()=>{
            this.layers.forEach(l=>{
                l.render()
            })
        })
    }

    loadMeasures(measures:any[]) {
        _.each(measures, (d)=>{
            let measure = new Measure(d.id, d.data)
            this.addMeasure(measure)
        })
    }
    addMeasure(m:Measure){
        let i=_.findIndex(this.measures,(mm)=>mm.id==m.id)
        if(i!=-1){
            this.measures[i]=m
        }else{
            this.measures.push(m)
        }
        this.fire("measure_change")
    }
    getMeasure(t:string){
        if(t!=undefined){
            return _.filter(this.measures,m=> m.type==t)
        }else{
            return this.measures
        }
    }
    addLayer(l:BaseLayer){
        let i =_.findIndex(this.layers,ll=>ll.id == l.id)
        if(i!=-1){
           this._clearLayer(this.layers[i])
           this.layers[i]=l
        }else{
            this.layers.push(l)
            l.chart=this
            l.renderAt(this.rootView.el)
        }
        this.fire("layer_change")
        l.chart=this
        return this
    }
    getFirstMeasure(type:string){
       let rs= _.filter(this.measures,m=>m.type==type)
        return rs.length>0?rs[0]:undefined
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
        this.fire("layer_change")
        return this
    }
    _clearLayer(l:BaseLayer){
        l.clear()
        return this
    }

    stringRectCache:any=Util.CacheAble(Util.getStringRect,(s,cls,fontSize)=>s.toString().length+" "+cls+fontSize)
    
    getStringRect(s,cls?,fontSize?){
        let rect=this.stringRectCache(s,cls,fontSize)
        return {width:rect.width,height:rect.height}
    }
    getColor(color?){
        if(color === undefined)
            return d3.schemeCategory20[Math.round(Math.random()*20)]
        else if(typeof(color) == "number")
            return d3.schemeCategory20[color]
        else 
            return color
    }
    render(){
       this.redraw()
    }
}
export interface IChartConfig{
    className:string
    style:{
        width:string,
        height:string
    }
}