import d3 = require("d3")
import _ = require("underscore")
import Util = require("../Core/Util")
import {BaseLayer,ILayerConfig} from "../Core/BaseLayer"

export class DashLayer extends BaseLayer {
    constructor(conf?){
        super(_.extend({tagName:"svg",className:"dashpie"},conf))
        this.config=Util.deepExtend(this.config,{rangeMax:100,padding:25},conf)
    }

    config:DashLayerConfig

    drawer(svgNode) {
        let smartArcGen = function(startAngle, endAngle, innerRadius, outerRadius) {
            let largeArc = ((endAngle - startAngle) % (Math.PI * 2)) > Math.PI ? 1 : 0,
                startX = centerX + Math.cos(startAngle) * outerRadius,
                startY = centerY + Math.sin(startAngle) * outerRadius,
                endX2 = centerX + Math.cos(startAngle) * innerRadius,
                endY2 = centerY + Math.sin(startAngle) * innerRadius,
                endX = centerX + Math.cos(endAngle) * outerRadius,
                endY = centerY + Math.sin(endAngle) * outerRadius,
                startX2 = centerX + Math.cos(endAngle) * innerRadius,
                startY2 = centerY + Math.sin(endAngle) * innerRadius
            let cmd = [
                'M', startX, startY,
                'A', outerRadius, outerRadius, 0, largeArc, 1, endX, endY,
                'L', startX2, startY2,
                'A', innerRadius, innerRadius, 0, largeArc, 0, endX2, endY2,
                'Z'
            ]
            return cmd.join(' ')
        }

        let outerRadius = this.config.width/ 2 - this.config.padding ,
            innerRadius = this.config.width / 5,
            centerX = this.config.width / 2,
            centerY = this.config.height- this.config.padding 
        
        let ds = this.chart.getFirstMeasure("dash")
        if(!ds){
            return 
        }
        let radio = ds.data / this.config.rangeMax > 1 ? 1 : ds.data / this.config.rangeMax
        let startAngle = -Math.PI,
            endAngle = startAngle + radio * Math.PI
        
        let dashGroup = svgNode.append("g").attr("class","dashGroup")
        dashGroup.append("path").attr("d",smartArcGen(-Math.PI,0,innerRadius,outerRadius)).attr("fill","#d6d6d6")
        dashGroup.append("path").attr("d",smartArcGen(startAngle,startAngle,innerRadius,outerRadius))
               .attr("fill",radio==null? "none":d3.scaleLinear().domain([0, 0.5, 1]).range(["red", "yellow", "green"])(radio))
               .transition().duration(500).ease(d3.easeLinear).delay(200)
               .attrTween("d", function(a){
                    return function(t){
                        let interpolate = d3.interpolate(startAngle,endAngle)
                        return smartArcGen(startAngle,interpolate(t),innerRadius,outerRadius)
                    }
                })
        
        dashGroup.append("text").attr("class","dataValue")
                 .attr("x",centerX)
                 .attr("y",centerY)
                 .attr("text-anchor","middle")
                 .attr("font-size","32px")
                 .text(ds.data+"km/h")
        
        dashGroup.append("text").attr("class","rangeMin")
                 .attr("x",centerX - innerRadius - (outerRadius-innerRadius)/2)
                 .attr("y",centerY)
                 .attr("dy",Util.getStringRect("0","",14).height)
                 .attr("text-anchor","middle")
                 .text("0")
                 .attr("font-size","14px")
        dashGroup.append("text").attr("class","rangeMax")
                 .attr("x",centerX + innerRadius + (outerRadius-innerRadius)/2)
                 .attr("y",centerY)
                 .attr("dy",Util.getStringRect("0","",14).height)
                 .attr("text-anchor","middle")
                 .text(this.config.rangeMax)
                 .attr("font-size","14px")
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}
interface DashLayerConfig extends ILayerConfig{
        rangeMax:number,
        padding:number
}
