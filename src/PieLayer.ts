import d3 = require("d3")
import _ = require("underscore")
import Util = require("Util")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
export class PieLayer extends BaseLayer {
    constructor(id? , conf?) {
        super(id, conf)
        this.setConfig(conf)
    }

    config: {
        className: string
    }
    updateDom(){
        if(this.el){
             let parent=this.el.parentNode
                let newEl =this.renderer()
                if(parent){
                    this.el.parentNode.removeChild(this.el);
                
                    parent.appendChild(newEl)
                }
            this.el=newEl
            this.updateLayout()

        }
       
        return this
    }
    renderer() {
        let root = this.chart.el
        let PI = Math.PI,
            cos = Math.cos,
            sin = Math.sin,
            sqrt = Math.sqrt
        let outerRadius =Math.min( Util.toPixel(this.layout.height),Util.toPixel(this.layout.width)) / 2-10,
            innerRadius = Util.toPixel(this.layout.height) / 6,
            innerestRadius = Util.toPixel(this.layout.height) / 9,
            centerX = Util.toPixel(this.layout.width) / 2,
            centerY = Util.toPixel(this.layout.height) / 2

        let smartArcGen = function(startAngle, endAngle, innerRadius, outerRadius) {
            let largeArc = ((endAngle - startAngle) % (PI * 2)) > PI ? 1 : 0,
            startX = centerX + cos(startAngle) * outerRadius,
            startY = centerY + sin(startAngle) * outerRadius,
            endX2 = centerX + cos(startAngle) * innerRadius,
            endY2 = centerY + sin(startAngle) * innerRadius,
            endX = centerX + cos(endAngle) * outerRadius,
            endY = centerY + sin(endAngle) * outerRadius,
            startX2 = centerX + cos(endAngle) * innerRadius,
            startY2 = centerY + sin(endAngle) * innerRadius
            let cmd = [
                'M', startX, startY,
                'A', outerRadius, outerRadius, 0, largeArc, 1, endX, endY,
                'L', startX2, startY2,
                'A', innerRadius, innerRadius, 0, largeArc, 0, endX2, endY2,
                'Z'
            ]
            return cmd.join(' ')
        }

        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").attr("class","pie")
        let ds = this.chart.measures
        _.each(ds, (d,i)=>{
            let max = Util.max(d.data,"value")
            let min = Util.min(d.data,"value")
            let scale = d3.scaleLinear().domain([min,max]).range([-1,1])
            let segmentAngle = 2 * PI / 24
            let toolTip = d3.select(root).append("div").attr("class","toolTip")
            let doughnutTip = d3.select(root).append("div").attr("class","doughnutTip")
                                .style("width",innerestRadius * sqrt(2) +"px").style("height",innerestRadius * sqrt(2) +"px")
                                .style("top",centerY  - innerestRadius * sin(PI/4) +"px").style("left",centerX - innerestRadius * sin(PI/4) +"px")
            let doughnutTitle = d3.select(doughnutTip.node()).append("p").text("AM").attr("class","doughnutTitle").style("line-height", innerestRadius * sqrt(2) + "px")
                .style("opacity",0).transition().duration(1000).styleTween("opacity",()=>{return d3.interpolate("0","1")})
            let innerDoughnut = svg.append("g"),
                outerDoughnut = svg.append("g")
            d.data.forEach((v,n) => {
                let startAngle = -PI/2 + segmentAngle * n
                let endAngle = startAngle + segmentAngle
                let midAngle = (startAngle + endAngle) / 2
                outerDoughnut.append("path")
                   .attr("class","outerDoughnut").attr("id","arc"+n).attr("fill", v.value==null? "none":d3.scaleLinear().domain([-1, 0, 1]).range(["red", "yellow", "green"])(scale(v.value)))
                   .attr("d",smartArcGen(startAngle, startAngle, innerRadius, outerRadius))
                   .attr("stroke","gray")
                   .attr("stroke-width","0px")
                   .on("mouseenter",function(e){
                       d3.selectAll(".outerDoughnut").style("opacity","0.5")
                       toolTip.text("时间: "+v.time + " " + "数量: " + v.value).style("display","block")
                       d3.select(this).transition().duration(200)
                         .attr("transform", "translate(" + (10 * cos(midAngle)) + "," + (10 * sin(midAngle)) + ")")
                         .style("opacity","1")
                   })
                   .on("mousemove",function(e){
                       console.log(d3.event)
                       toolTip.style("top",d3.event.layerY - Util.getStringRect(toolTip.text()).height - 16 +"px")
                              .style("left",d3.event.layerX - Util.getStringRect(toolTip.text()).width/2 - 35 + "px")
                   })
                   .on("mouseout",function(){
                       d3.selectAll(".outerDoughnut").style("opacity","1")
                       d3.select(this).transition().duration(200).attr("transform","translate(0)")
                       toolTip.style("display","none")
                   })
                   .transition().duration(50).ease(d3.easeLinear).delay(960+50*n)
                   .attrTween("d", function(a){
                       return function(t){
                           let interpolate = d3.interpolate(startAngle,endAngle)
                           return smartArcGen(startAngle,interpolate(t),innerRadius,outerRadius)
                       }
                   }) 
                   .attr("stroke-width","0.5px")
                   .style("pointer-events","none").transition().style("pointer-events","auto")

               
            })
            for(let i=0;i<24;++i){
                  let startAngle = -PI/2 + segmentAngle * i
                let endAngle = startAngle + segmentAngle
                let midAngle = (startAngle + endAngle) / 2
                 innerDoughnut.append("path").attr("class","innerDoughnut").attr("fill","#d6d6d6")
                   .attr("d",smartArcGen(startAngle,startAngle,innerestRadius,innerRadius))
                   .transition().duration(40).ease(d3.easeLinear).delay(40*i)
                   .attrTween("d", function(a){
                       return function(t){
                           let interpolate = d3.interpolate(startAngle,endAngle)
                           return smartArcGen(startAngle,interpolate(t),innerestRadius,innerRadius)
                       }
                   })
            }
        })
        return svg.node()
    }
 }