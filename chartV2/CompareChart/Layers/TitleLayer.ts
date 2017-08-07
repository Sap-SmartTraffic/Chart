
import { BaseLayer } from "../../Core/BaseLayer";
export class TitleLayer extends BaseLayer {
    textNode:HTMLElement|any
    private _title:string
    value(t){
        this._title=t
        this.render()
        return this
    }
    render(){
        this.el.innerHTML=""
        this.elD3.append("xhtml:p").classed("title",true).text(this._title)
        return this
    }
    

}