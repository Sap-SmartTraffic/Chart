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

    drawToolTip() {
        let toolTip = d3.select(this.chart.el).append("div").attr("class","toolTip")
        return toolTip
    }

    updateDom() {
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

    getToolTipText(data) {
        let sum1 = 0, sum2=0, sum3=0
        let border1 = 10, border2 = 20
        let percentage1="", percentage2="", percentage3=""
        if(data.value != null) {
            for(let i = 0; i < 4 ; i++){
                if(data.value[i] < border1)
                    sum1++
                else if(data.value[i] > border2)
                    sum3++
                else
                    sum2++
            }
            percentage1 = d3.format(".0%")(sum1/4),
            percentage2 = d3.format(".0%")(sum2/4),
            percentage3 = d3.format(".0%")(sum3/4)
        }
        
        return "<div class='tipTitle'><p>"+data.time+":00"+"-"+(data.time+1)+":00"+"</p></div>"+
               "<div class='tipItem'><p>0-"+border1+":</p><p>"+border1+"-"+border2+":</p><p>>"+border2+":</p></div>"+
               "<div class='tipValue'><p>"+percentage1+"</p><p>"+percentage2+"</p><p>"+percentage3+"</p></div>"
    }

    getDataset(count, head) {
        let dataset = []
        let data = this.chart.measure.data
        for(let i = 0; i < count; i++) {
            dataset.push({"time":(head+i)>24? (head+i-24):(head+i),"value":null})
        }
        for(let i = 0; i < data.length; i++) {
            let index = _.findIndex(dataset,{"time":data[i].time})
            dataset[index] = data[i]
        }

        return dataset
    }

    getMaxMin() {
        let dataset = this.chart.measure.data
        let maxmin = {max:null,min:null}
        if(dataset.length != 0) {
            let valueset = []
            for(let i = 0; i<dataset.length; i++) {
                valueset = _.union(valueset, dataset[i].value)
            }
            maxmin.max = _.max(valueset)
            maxmin.min = _.min(valueset)
        }
        return maxmin
    }

    drawer(svg) {
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

        let segmentCount = this.getDataset(12,0).length,
        outerRadius = Math.min(Util.toPixel(this.layout.height),Util.toPixel(this.layout.width)) / 2-10,
        middleRadius = Util.toPixel(this.layout.height) / 6,
        innerRadius = Util.toPixel(this.layout.height) / 9,
        centerX = Util.toPixel(this.layout.width) / 2,
        centerY = Util.toPixel(this.layout.height) / 2,
        innerSegmentAngle = 2 * Math.PI / segmentCount,
        outerSegmentAngle = innerSegmentAngle / 4,
        innerDurationTime = 1000,
        outerDurationTime = 1000
        
        let dataset = this.getDataset(12,0)
        let max = this.getMaxMin().max
        let min = this.getMaxMin().min
        let toolTip = this.drawToolTip()
        let doughnutTip = d3.select(this.chart.el).append("div").attr("class","doughnutTip")
                            .style("width",innerRadius * Math.sqrt(2) +"px").style("height",innerRadius * Math.sqrt(2) +"px")
                            .style("top",centerY - innerRadius * Math.sin(Math.PI/4) + Util.toPixel(this.chart.config.height)-Util.toPixel(this.layout.height) + "px").style("left",centerX - innerRadius * Math.sin(Math.PI/4) +"px")
        let doughnutTitle = doughnutTip.append("p").text("AM").attr("class","doughnutTitle").style("line-height", innerRadius * Math.sqrt(2) + "px")
            .style("opacity",0).transition().duration(innerDurationTime+outerDurationTime).styleTween("opacity",()=>{return d3.interpolate("0","1")})
        
        let scale = d3.scaleLinear().domain([min,max]).range([-1,1])
        let innerDoughnut = svg.append("g").attr("class","innerDoughnut"),
            outerDoughnut = svg.append("g").attr("class","outerDoughnut")
        dataset.forEach((d,i) => {
            let toolTipText = this.getToolTipText(d)
            let innerStartAngle = -Math.PI/2 + innerSegmentAngle * i
            let innerEndAngle = innerStartAngle + innerSegmentAngle
            innerDoughnut.append("path").attr("class","doughnut doughnut"+i).attr("fill","#d6d6d6")
                .attr("d",smartArcGen(innerStartAngle,innerStartAngle,innerRadius,middleRadius))
                .attr("stroke","#000000").attr("stroke-width","0px")
                .on("mouseenter",function(e){
                    svg.selectAll(".doughnut").style("opacity","0.5")
                    toolTip.html(toolTipText).style("display","block")
                    svg.selectAll(".doughnut"+i).transition().duration(200).style("opacity","1")
                })
                .on("mousemove",function(e){
                    toolTip.style("top",d3.event.layerY - Util.getStringRect(toolTip.text()).height - 16 +"px")
                           .style("left",d3.event.layerX - Util.getStringRect(toolTip.text()).width/2 - 35 + "px")
                   })
                .on("mouseleave",function(){
                    svg.selectAll(".doughnut").style("opacity","1")
                    toolTip.style("display","none")
                })
                .transition().duration(innerDurationTime/12).ease(d3.easeLinear).delay(innerDurationTime/12*i)
                .attrTween("d", function(a){
                    return function(t){
                        let interpolate = d3.interpolate(innerStartAngle,innerEndAngle)
                        return smartArcGen(innerStartAngle,interpolate(t),innerRadius,middleRadius)
                    }
                })
                .attr("stroke-width","0.5px")
            if(d.value != null) {
                d.value.forEach((v,n) => {
                    let outerStartAngle = innerStartAngle + outerSegmentAngle * n
                    let outerEndAngle = outerStartAngle + outerSegmentAngle
                    outerDoughnut.append("path")
                    .attr("class","doughnut doughnut"+i).attr("fill", v==null? "none":d3.scaleLinear().domain([-1, 0, 1]).range(["red", "yellow", "green"])(scale(v)))
                    .attr("d",smartArcGen(outerStartAngle, outerStartAngle, middleRadius, outerRadius))
                    .on("mouseenter",function(e){
                        svg.selectAll(".doughnut").style("opacity","0.5")
                        toolTip.html(toolTipText).style("display","block")
                        svg.selectAll(".doughnut"+i).transition().duration(200).style("opacity","1")
                    })
                    .on("mousemove",function(e){
                        toolTip.style("top",d3.event.layerY - Util.getStringRect(toolTip.text()).height - 16 +"px")
                           .style("left",d3.event.layerX - Util.getStringRect(toolTip.text()).width/2 - 35 + "px")
                    })
                    .on("mouseout",function(){
                        svg.selectAll(".doughnut").style("opacity","1")
                        toolTip.style("display","none")
                    })
                    .transition().duration(outerDurationTime/48).ease(d3.easeLinear).delay(innerDurationTime + outerDurationTime/48*n + 4*outerDurationTime/48*i)
                    .attrTween("d", function(a){
                        return function(t){
                            let interpolate = d3.interpolate(outerStartAngle, outerEndAngle)
                            return smartArcGen(outerStartAngle,interpolate(t),middleRadius,outerRadius)
                        }
                    }) 
                    .style("pointer-events","none").transition().duration(innerDurationTime+outerDurationTime).style("pointer-events","auto")
                })
            }
        })
        return this
    }

    renderer() {
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").attr("class",this.config.className)
        this.drawer(svg)
        return svg.node()
    }
 }