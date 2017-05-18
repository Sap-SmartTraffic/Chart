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
        //the method of painting arc
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
        
        //Calculate toolTip data and text
        let getToolTipText = function(data) {
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
        
        //doughnut painting config
        let root = this.chart.el
        let PI = Math.PI,
            cos = Math.cos,
            sin = Math.sin,
            sqrt = Math.sqrt
        let outerRadius =Math.min( Util.toPixel(this.layout.height),Util.toPixel(this.layout.width)) / 2-10,
            middleRadius = Util.toPixel(this.layout.height) / 6,
            innerRadius = Util.toPixel(this.layout.height) / 9,
            centerX = Util.toPixel(this.layout.width) / 2,
            centerY = Util.toPixel(this.layout.height) / 2,
            innerSegmentAngle = 2 * PI / 12,
            outerSegmentAngle = innerSegmentAngle / 4,
            innerDurationTime = 1000,
            outerDurationTime = 1000
        
        //data pre-process
        let dataset = _.sortBy(this.chart.measure.data,"time")
        let valueset = []
        for(let i = 0; i<dataset.length; i++) {
            valueset = _.union(valueset, dataset[i].value)
        }
        let max = _.max(valueset)
        let min = _.min(valueset)
        if(dataset.length < 12) {
            for(let i = 0; i < 12; i++) {
                if(dataset[i].time != i){
                    dataset.splice(i,0,{"time":i})
                }
            }
        }
        
        //toolTip and title dom
        let toolTip = d3.select(root).append("div").attr("class","toolTip")
        let doughnutTip = d3.select(root).append("div").attr("class","doughnutTip")
                            .style("width",innerRadius * sqrt(2) +"px").style("height",innerRadius * sqrt(2) +"px")
                            .style("top",centerY  - innerRadius * sin(PI/4) +"px").style("left",centerX - innerRadius * sin(PI/4) +"px")
        let doughnutTitle = d3.select(doughnutTip.node()).append("p").text("AM").attr("class","doughnutTitle").style("line-height", innerRadius * sqrt(2) + "px")
            .style("opacity",0).transition().duration(innerDurationTime+outerDurationTime).styleTween("opacity",()=>{return d3.interpolate("0","1")})
        
        //doughnut painting
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").attr("class","pie")
        let scale = d3.scaleLinear().domain([min,max]).range([-1,1])
        let innerDoughnut = svg.append("g").attr("class","innerDoughnut"),
            outerDoughnut = svg.append("g").attr("class","outerDoughnut")
        //innerDoughnut paingting
        dataset.forEach((d,i) => {
            let innerStartAngle = -PI/2 + innerSegmentAngle * i
            let innerEndAngle = innerStartAngle + innerSegmentAngle
            innerDoughnut.append("path").attr("class","doughnut doughnut"+i).attr("fill","#d6d6d6")
                .attr("d",smartArcGen(innerStartAngle,innerStartAngle,innerRadius,middleRadius))
                .attr("stroke","#000000").attr("stroke-width","0px")
                .on("mouseenter",function(e){
                  d3.selectAll(".doughnut").style("opacity","0.5")
                    toolTip.html(getToolTipText(d)).style("display","block")
                    d3.selectAll(".doughnut"+i).transition().duration(200).style("opacity","1")
                })
                .on("mousemove",function(e){
                    toolTip.style("top",d3.event.layerY - Util.getStringRect(toolTip.text()).height - 16 +"px")
                           .style("left",d3.event.layerX - Util.getStringRect(toolTip.text()).width/2 - 35 + "px")
                   })
                .on("mouseout",function(){
                    d3.selectAll(".doughnut").style("opacity","1")
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
            //outerDoughnut painting
            if(d.value != null) {
                d.value.forEach((v,n) => {
                    let outerStartAngle = innerStartAngle + outerSegmentAngle * n
                    let outerEndAngle = outerStartAngle + outerSegmentAngle
                    outerDoughnut.append("path")
                    .attr("class","doughnut doughnut"+i).attr("fill", v==null? "none":d3.scaleLinear().domain([-1, 0, 1]).range(["red", "yellow", "green"])(scale(v)))
                    .attr("d",smartArcGen(outerStartAngle, outerStartAngle, middleRadius, outerRadius))
                    .attr("stroke","gray")
                    .attr("stroke-width","0px")
                    .on("mouseenter",function(e){
                    d3.selectAll(".doughnut").style("opacity","0.5")
                        toolTip.html(getToolTipText(d)).style("display","block")
                        d3.selectAll(".doughnut"+i).transition().duration(200).style("opacity","1")
                    })
                    .on("mousemove",function(e){
                        toolTip.style("top",d3.event.layerY - Util.getStringRect(toolTip.text()).height - 16 +"px")
                           .style("left",d3.event.layerX - Util.getStringRect(toolTip.text()).width/2 - 35 + "px")
                    })
                    .on("mouseout",function(){
                        d3.selectAll(".doughnut").style("opacity","1")
                        toolTip.style("display","none")
                    })
                    .transition().duration(outerDurationTime/48).ease(d3.easeLinear).delay(innerDurationTime + outerDurationTime/48*n + 4*outerDurationTime/48*i)
                    .attrTween("d", function(a){
                        return function(t){
                            let interpolate = d3.interpolate(outerStartAngle, outerEndAngle)
                            return smartArcGen(outerStartAngle,interpolate(t),middleRadius,outerRadius)
                        }
                    }) 
                    .attr("stroke-width","0.5px")
                    .style("pointer-events","none").transition().duration(innerDurationTime+outerDurationTime).style("pointer-events","auto")
                })
            }
        })

        return svg.node()
    }
 }