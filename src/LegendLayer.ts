import d3 = require("d3")
import _ = require("underscore")
import Util = require ("./Util")
import {Evented} from "./Evented"
import {BaseLayer} from "./BaseLayer"
import {Measure} from "./Measure"

export class LegendLayer extends BaseLayer {
    config = {
        height:"48px",
        className:"LegendLayer",
        margin:{top:"5px",right:"20px",bottom:"5px",left:"20px"},
        legendIcon:{width:"15px",height:"15px"},
        legendText:{height:"15px"},
        legendInnerMargin:"5px",
        legendOuterMargin:"10px"
    }

    constructor(id?, conf?) {
        super()
        this.setConfig(conf)
    }
    
    /*
    calculateLegendWidth(ds:Measure[]) {
        let legendWidth = 0
        _.each(ds, (d,i)=> {
            legendWidth += this.calculayeLegendUnitWidth("标签"+d.id)
        })
        return legendWidth
    }

    calculayeLegendUnitWidth(legendText) {
        return Util.toPixel(this.config.legendIcon.width) + Util.toPixel(this.config.legendInnerMargin) + Util.getStringRect(legendText).width + Util.toPixel(this.config.legendOuterMargin)
    }

    calculateHeight(ds) {
        let availableWidth = Util.toPixel(this.layout.width) - Util.toPixel(this.config.margin.right) - Util.toPixel(this.config.margin.left)
        let legendWidth = this.calculateLegendWidth(ds)
        let legendRow = Math.ceil(legendWidth / availableWidth)
        this.config.height = legendRow * (Util.toPixel(this.config.legendIcon.height)) + Util.toPixel(this.config.margin.top) + Util.toPixel(this.config.margin.bottom) + "px"
    }
    */

    init() {

    }

    renderer() {
        let ds = this.chart.measures
        let fragment = document.createDocumentFragment()
        let legend = d3.select(fragment).append("xhtml:div").attr("class","legend-wrap")
        let legendGroup = legend.append("xhtml:div").attr("class","legendGroup")
                                .style("margin",this.config.margin.top+" "+this.config.margin.right+" "+this.config.margin.bottom+" "+this.config.margin.left)
                                .style("display","-webkit-flex")
                                .style("flex-wrap","wrap")
                                .style("justify-content","center")
        _.each(ds, (d,i)=>{
            let legendUnit = legendGroup.append("xhtml:div").attr("class","legendUnit"+i).style("display","inline-block").style("opacity","1")
            legendUnit.append("xhtml:span").style("width",this.config.legendIcon.width)
                      .style("height",this.config.legendIcon.height)
                      .style("display","inline-block")
                      .style("background-color", this.chart.getColor(i))
                      .style("margin-right",this.config.legendInnerMargin)
                      .on("mouseenter",()=>{this.chart.fire("enterLegend",{series:d.id,index:i})})
                      .on("mouseleave",()=>{this.chart.fire("leaveLegend",{})})
                      .on("click",()=>{
                          let item = legend.select(".legendUnit"+i)
                          if(item.style("opacity") == "1")
                              item.style("opacity","0.3")  
                          else 
                              item.style("opacity","1")

                          this.chart.fire("clickLegend",{series:d.id,index:i,isShow:item.style("opacity")})
                      })
            legendUnit.append("xhtml:p").style("line-height", this.config.legendText.height).text(d.id).style("margin-right", this.config.legendOuterMargin).style("display","inline-block").style("vertical-align","top")
        })
        return legend.node()
    }
}