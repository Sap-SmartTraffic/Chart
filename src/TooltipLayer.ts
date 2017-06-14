import d3 = require("d3")
import _ = require("underscore")
import Util = require("./Util")
import {Evented} from "./Evented"
import {BaseLayer} from "./BaseLayer"

export class TooltipLayer extends BaseLayer{
    constructor(id?, conf?) {
        super()
        this.setConfig(conf)
    }

    eventHandler() {
        this.chart.on("showTooltip",(d)=>{
            d3.select(this.el).style("display","block")
                          .style("top",d3.event.layerY + "px")
                          .style("left",d3.event.layerX + Util.toPixel(this.layout.width) / 2 + "px")
                          .html(this.getTooltipContent(d))
        })
        this.chart.on("hideTooltip",()=>{
            d3.select(this.el).style("display","none")
        })
    }

    getTooltipContent(data) {
        let textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>"+ data.xMark +"</th></tr>"
        let text =  "<tr><td class='name'><span style='background-color:"+ this.chart.getColor(data.index) +"'></span>" + "系列" + data.series + "</td><td class='value'>"+ data.value +"</td></tr>"
        let textEnd = "</tbody></table>"
        return textStart + text + textEnd
    }

    renderer() {
        this.eventHandler()
        let ds = this.chart.measures
        let fragment = document.createDocumentFragment()
        let tooltip = d3.select(fragment).append("xhtml:div").attr("class","tooltip-container").style("pointer-events","none").style("display","none")
        return tooltip.node()
    }
} 