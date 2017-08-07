import d3 =require("d3")
import _ = require('lodash');
import {BaseLayer,ILayerConfig} from "../../Core/BaseLayer"
export class TitleLayer extends BaseLayer{
    defaultConfig():ITitleLayerConfig{
        return {
                tagName:"div",
                className:"title",
                style:{
                    top:"0px",
                    left:"0px",
                    bottom:null,
                    right:null,
                    position:"absolute",
                    zindex:0,
                    width:"40rem",
                    height:"2rem",
                },
                value:""
            }
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
            value:string
}