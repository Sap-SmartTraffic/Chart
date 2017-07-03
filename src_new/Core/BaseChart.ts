import d3 =require("d3")
import _=require("underscore")
import {Evented} from "./Evented"
import {BaseLayer} from "./BaseLayer"
import {Measure} from "./Measure"
import {Util}from"./Util"
import {View} from"./View"
export class BaseChart extends Evented{
<<<<<<< HEAD
    isRender:boolean = false
=======
    isRender:boolean=false
>>>>>>> origin/master
    measures:Measure[]=[]
    layers:BaseLayer[]=[]
    rootView:View
    config:IChartConfig
    constructor(conf){
        super()
        this.config=Util.deepExtend(this.defaultConfig(),conf)
        this.rootView=new View({tagName:"div",className:this.config.className})
        this.rootView.style(this.config.style)
<<<<<<< HEAD
        if(this.config.el) {
            this.renderAt(this.config.el)
        }
    }

    getLayerContainer() {
=======
        if(this.config.el){
            this.renderAt(this.config.el)
        }
    }
    getLayerContainer(){
>>>>>>> origin/master
        return this.rootView
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
                 position:"relative"
            },
            className:"chart",
            el:null
        }
    }
<<<<<<< HEAD

    setStyle(c) {
        this.config.style = _.extend(this.config.style, c)
        this.fire("style_change",{style:this.config.style})
    }

=======
    setStyle(c){
        this.config.style=_.extend(this.config.style,c)
        this.fire("style_change",{style:this.config.style})
    }
>>>>>>> origin/master
    renderAt(dom:Element|HTMLElement|SVGAElement|string){
       if(_.isString(dom)){
            let n:any = d3.select(dom).node()
           n.appendChild(this.rootView.el)

       }else{
          dom.appendChild(this.rootView.el)
       }
<<<<<<< HEAD
      
       this.fire("rendered")
       this.isRender = true
=======
       this.fire("rendered")
       this.isRender=true
>>>>>>> origin/master
    }

    // loadMeasures(measures:any[]) {
    //     _.each(measures, (d)=>{
    //         let measure = new Measure(d.id, d.data, d.type)
    //         let i=_.findIndex(this.measures,(mm)=>mm.id==d.id)
    //         if(i!=-1){
    //             this.measures[i]=d
    //         }else{
    //             this.measures.push(d)
    //         }
    //     })
    //     this.fire("measure_change")
    // }
    
    // addMeasure(m:Measure){
    //     let i=_.findIndex(this.measures,(mm)=>mm.id==m.id)
    //     if(i!=-1){
    //         this.measures[i]=m
    //     }else{
    //         this.measures.push(m)
    //     }
    //     this.fire("measure_change")
    // }
<<<<<<< HEAD

    // getMeasures(t:string){
    //     if(t!=undefined){
    //         return _.filter(this.measures,m=> m.type==t)
    //     }else{
    //         return this.measures
    //     }
    // }

=======

    // getMeasures(t:string){
    //     if(t!=undefined){
    //         return _.filter(this.measures,m=> m.type==t)
    //     }else{
    //         return this.measures
    //     }
    // }
>>>>>>> origin/master
    addLayer(l:BaseLayer){
        let i =_.findIndex(this.layers,ll=>ll.id == l.id)
        if(i!=-1){
           this._clearLayer(this.layers[i])
           this.layers[i]=l
        }else{
            this.layers.push(l)
        }
        l._onAdd(this)
        this.fire("layer_add layer_change",l)
        return this
    }
<<<<<<< HEAD

=======
>>>>>>> origin/master
    // getFirstMeasure(type:string){
    //    let rs= _.filter(this.measures,m=>m.type==type)
    //     return rs.length>0?rs[0]:undefined
    // }
<<<<<<< HEAD

=======
>>>>>>> origin/master
    removeLayer(id){
        if(_.isObject(id)){
            let i =_.findIndex(this.layers,ll=>ll.id == id.id)
            if(i!=-1){
                 this._clearLayer(this.layers[i])
                 this.layers=_.filter(this.layers,ll=>ll.id!=id.id)
<<<<<<< HEAD
            }  
            this.fire("layer_remove layer_change",{layer: this.layers[i]})
=======
            }
            this.fire("layer_remove layer_change",{layer:this.layers[i]})  
>>>>>>> origin/master
        }else{
            let i =_.findIndex(this.layers,ll=>ll.id == id)
            if(i != -1){
                    this._clearLayer(this.layers[i])
                    this.layers=_.filter(this.layers,ll=>ll.id!=id)
<<<<<<< HEAD
            }  
            this.fire("layer_remove layer_change",{layer: this.layers[i]})
=======
            }
            this.fire("layer_remove layer_change",{layer:this.layers[i]})
>>>>>>> origin/master
        }
        return this
    }

    _clearLayer(l:BaseLayer){
        l.clear()
        //clear callback
        return this
    }

<<<<<<< HEAD
    // stringRectCache:any=Util.CacheAble(Util.getStringRect,(s,cls,fontSize)=>s.toString().length+" "+cls+fontSize)
=======
   // stringRectCache:any=Util.CacheAble(Util.getStringRect,(s,cls,fontSize)=>s.toString().length+" "+cls+fontSize)
>>>>>>> origin/master
    
    // getStringRect(s,cls?,fontSize?){
    //     let rect=this.stringRectCache(s,cls,fontSize)
    //     return {width:rect.width,height:rect.height}
    // }
    // getColor(color?){
    //     if(color === undefined)
    //         return d3.schemeCategory20[Math.round(Math.random()*20)]
    //     else if(typeof(color) == "number")
    //         return d3.schemeCategory20[color]
    //     else 
    //         return color
    // }
<<<<<<< HEAD
    
    whenReady(callback:Function,ctx?) {
        if(this.isRender) {
            callback.call(ctx,null)
=======

    whenReady(callback:Function,ctx?){
        if(this.isRender){
            callback.call(ctx||null)
>>>>>>> origin/master
        }
        this.on("rendered",callback,ctx)
    }
}

export interface IChartConfig{
    className:string
    style:{
        width:string,
        height:string,
<<<<<<< HEAD
        position:string|null
    }
    el:any
}

export class SingleDataChart extends BaseChart {
    data:any

    getData(){
       return this.data
=======
        position:string|null,
    }
    el:any
}
export class SingleDateChart extends BaseChart{
    data:any
    getData(){
        return this.data
    }
    setData(d){
        this.fire("data_change",{data:d,oldData:this.data})
        this.data=d
>>>>>>> origin/master
    }
    
    setData(d){
        this.fire("data_change",{data:d,oldData:this.data=d})
        this.data=d
    }		      
}