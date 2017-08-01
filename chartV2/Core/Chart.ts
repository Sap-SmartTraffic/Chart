import { Evented } from "./Evented";
import d3 =require("d3")
import _ =require("lodash")
import { Util } from "./Util";
let styles = Util.d3Invoke("style")
let attrs=Util.d3Invoke("attr")
export class Chart extends Evented {
    constructor(){
        super()
        this.initPanel()
    }
    private panels:{
        [key:string]:HTMLElement|SVGElement|any
    }
    initPanel(){
        this.panels={}
        this.panels["main"]=document.createElementNS("http://www.w3.org/1999/xhtml","div")
        this.panels["svg"]=d3.select(this.panels['main']).append("svg").node()
        this.panels["html"]=d3.select(this.panels['main']).append("xhtml:div").node()
        this.panels["canvas"]=d3.select(this.panels['main']).append("xhtml:canvas").node()
        d3.select(this.panels["main"]).classed("chartContainer",true)
                                      .call(styles())
    }
    getPanel(key?:string){
        if(key!=undefined){
            return this.panels[key]
        }else{
            return this.panels["main"]
        }
    }
}