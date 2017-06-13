import d3 =require("d3")
import _ =require("underscore")
import {BaseLayer,ILayerConfig} from "../Core/BaseLayer"
export class TitleLayer extends BaseLayer{
    constructor(conf?){
        super(_.extend({tagName:"div",className:"title"},conf))
        this.config=_.extend(this.config,{
            value:""
        },conf)
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
interface ITitleLayerConfig extends ILayerConfig{
            value:string
}