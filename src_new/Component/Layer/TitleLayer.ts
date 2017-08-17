import d3 =require("d3")
import _ = require('lodash')
import { Util } from "../../Core/Util"
import {BaseLayer,ILayerConfig} from "../../Core/BaseLayer"
export class TitleLayer extends BaseLayer{
    defaultConfig():ITitleLayerConfig{
        return Util.deepExtend(super.defaultConfig(),{
            tagName:"div", 
            className:"title", 
            style:{height:"2rem"}, 
            value:""
        })
    }
    config:ITitleLayerConfig
    setTitle(t){
        this.config.value=t
        this.render()
    }
    render(){
        let t=this.config.value
        let node=this.elD3.select("p")
        if(node.empty()){
            node=this.elD3.append("p")
        }
        node.text(t)
        return this
    }
}
export interface ITitleLayerConfig extends ILayerConfig{
    value?:string
}