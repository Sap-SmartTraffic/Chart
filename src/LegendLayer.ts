import d3 = require("d3")
import _ = require("underscore")
import Util = require ("Util")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"

export class LegendLayer extends BaseLayer {
    config: {
        legendGroup: string[]
        className: string
    }

    constructor(id?, conf?) {
        super()
        this.setConfig(conf)
    }

    init() {

    }

    addLegend(legend: string) {
        this.config.legendGroup.push(legend)
    }

    removeLegend(legend: string) {
        let target = _.findIndex(this.config.legendGroup, legend)
        this.config.legendGroup.splice(target, 1)
    }

    renderer() {
        let ds = this.chart.measures
        let fragment = document.createDocumentFragment()
        let legend = d3.select(fragment).append("xhtml:div").node()
        _.each(ds, (d,i)=>{
            d3.select(legend).append("xhtml:div").style("width","20px").style("height","20px").style("background", this.chart.getColorByIndex(i)).style("float","left").style("margin-right","5px")
            d3.select(legend).append("xhtml:p").style("line-height", "20px").style("float", "left").text("标签"+i).style("margin-right", "10px")
        })
        return legend
    }
}