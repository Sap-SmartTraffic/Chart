import d3 = require('d3');
import _ = require('lodash');
import { Util } from '../../../Core/Util';
import { SingleDataChart } from '../../../Core/BaseChart';
import { BaseLayer } from '../../../Core/BaseLayer';

export class TimeAdjustLayer extends BaseLayer{
    constructor(id?,conf?){
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change data_change",()=>{
                this.updateStyle()
                this.render()
            })
        })
    }
    currentTime:Date
    chart:SingleDataChart
    parseData(d):ITimeAdjustData{
        return _.extend({
            rangeMin:"2017/07/01 06:00",
            rangeMax:"2017/07/01 18:00",
            focusTime:"2017/07/01 12:00",
            axisHeight:"20px",
            timeFormat: "%H:%M",
            lineTextPadding: "20px",
            timeRound:15
        },d)
    }
    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let data=this.parseData(this.chart.getData())
        let width=Util.toPixel(this.evaluateStyle().width)
        let height=Util.toPixel(this.evaluateStyle().height)
        svgNode.append("rect").attr("class","panel")
               .attr("x",0)
               .attr("y",0)
               .attr("width",width)
               .attr("height",height- Util.toPixel(data.axisHeight))
        
        let self = this
        let formatTime = d3.timeFormat(data.timeFormat)
        let focusTime = new Date(data.focusTime)

        let xScale = d3.scaleTime()
                       .domain([new Date(data.rangeMin),new Date(data.rangeMax)])
                       .range([6,width-6])
        
        svgNode.append("rect")
               .attr("class","axisBackground")
               .attr("x","0")
               .attr("y",height-Util.toPixel(data.axisHeight))
               .attr("width",width)
               .attr("height",Util.toPixel(data.axisHeight))
        let axis = svgNode.append("g")
                          .attr("class","axis xAxis")
                          .attr("transform",`translate(0,${Util.toPixel(this.config.style.height)-Util.toPixel(data.axisHeight)})`)
        
        axis.append("path")
            .attr("class","domain")
            .attr("stroke","#000")
            .attr("stroke-width","1")
            .attr("d",`M 0.5,0 H ${Util.toPixel(this.config.style.width)-0.5}`)
        let tick1 = axis.append("g")
                        .attr("class","tick")
                        .attr("transform","translate(0.5,0)")
        tick1.append("text")
             .attr("dy","3")
             .attr("alignment-baseline","hanging")
             .attr("text-anchor","start")
             .text(formatTime(new Date(data.rangeMin)))
        let tick2 = axis.append("g")
                        .attr("class","tick")
                        .attr("transform",`translate(${Util.toPixel(this.config.style.width)/2}, 0)`)
        tick2.append("text")
             .attr("dy","3")
             .attr("alignment-baseline","hanging")
             .attr("text-anchor","middle")
             .text(formatTime(xScale.invert(Util.toPixel(this.config.style.width)/2)))
        let tick3 = axis.append("g")
                        .attr("class","tick")
                        .attr("transform",`translate(${Util.toPixel(this.config.style.width)-0.5}, 0)`)
        tick3.append("text")
             .attr("dy","3")
             .attr("alignment-baseline","hanging")
             .attr("text-anchor","end")
             .text(formatTime(new Date(data.rangeMax)))

               
        let drag = d3.drag()
                     .on("start",function(){
                         svgNode.style("cursor","col-resize")
                     })
                     .on("drag",function(){ 
                         if(d3.event.x>=xScale(new Date(data.rangeMin))&&d3.event.x<=xScale(new Date(data.rangeMax))){
                             let currentTime = xScale.invert(d3.event.x)
                             svgNode.select(".focusLine").attr("x1",d3.event.x).attr("x2",d3.event.x)
                             svgNode.select(".focusRect").attr("x",d3.event.x-6)
                             svgNode.selectAll(".focusRectLine").attr("x1",d3.event.x-4).attr("x2",d3.event.x+4)
                             if(d3.event.x > Util.toPixel(self.config.style.width)/2)
                                 svgNode.select(".focusText").text(formatTime(currentTime)).attr("x",(xScale(currentTime) - Util.toPixel(data.lineTextPadding))).attr("class","focusText leftSide")
                             else 
                                 svgNode.select(".focusText").text(formatTime(currentTime)).attr("x",(xScale(currentTime) + Util.toPixel(data.lineTextPadding))).attr("class","focusText rightSide")
                             self.fire("draging",{dateTime:currentTime})
                         }   
                     })
                     .on("end",function(){
                         let currentTime:Date
                         if(d3.event.x>=xScale(new Date(data.rangeMin))&&d3.event.x<=xScale(new Date(data.rangeMax))){
                            currentTime = xScale.invert(d3.event.x)
                            currentTime.setSeconds(0,0)
                            let currentMinutes = currentTime.getMinutes()
                            let remainderTime = currentMinutes % data.timeRound
                            if(remainderTime != 0) {
                                if(remainderTime <= data.timeRound / 2) {
                                    currentTime.setMinutes(currentMinutes - remainderTime)
                                }
                                else {
                                    currentTime.setMinutes(currentMinutes + data.timeRound - remainderTime)
                                }
                            }
                            self.currentTime = currentTime
                            svgNode.select(".focusLine").attr("x1",xScale(currentTime)).attr("x2",xScale(currentTime))
                            svgNode.select(".focusRect").attr("x",xScale(currentTime)-6)
                            svgNode.selectAll(".focusRectLine").attr("x1",xScale(currentTime)-4).attr("x2",xScale(currentTime)+4)
                            if(d3.event.x > Util.toPixel(self.config.style.width)/2)
                                svgNode.select(".focusText").text(formatTime(currentTime)).attr("x",(xScale(currentTime) - Util.toPixel(data.lineTextPadding))).attr("class","focusText leftSide")
                            else 
                                svgNode.select(".focusText").text(formatTime(currentTime)).attr("x",(xScale(currentTime) + Util.toPixel(data.lineTextPadding))).attr("class","focusText rightSide") 
                         }
                         else if(d3.event.x<xScale(new Date(data.rangeMin))){
                             currentTime = new Date(data.rangeMin)
                             self.currentTime = currentTime
                             svgNode.select(".focusLine").attr("x1",xScale(currentTime)).attr("x2",xScale(currentTime))
                             svgNode.select(".focusRect").attr("x",xScale(currentTime)-6)
                             svgNode.selectAll(".focusRectLine").attr("x1",xScale(currentTime)-4).attr("x2",xScale(currentTime)+4)
                             svgNode.select(".focusText").text(formatTime(currentTime)).attr("x",(xScale(currentTime) + Util.toPixel(data.lineTextPadding))).attr("class","focusText rightSide") 
                         }
                         else if(d3.event.x>xScale(new Date(data.rangeMax))){
                             currentTime = new Date(data.rangeMax)
                             self.currentTime = currentTime
                             svgNode.select(".focusLine").attr("x1",xScale(currentTime)).attr("x2",xScale(currentTime))
                             svgNode.select(".focusRect").attr("x",xScale(currentTime)-6)
                             svgNode.selectAll(".focusRectLine").attr("x1",xScale(currentTime)-4).attr("x2",xScale(currentTime)+4)
                             svgNode.select(".focusText").text(formatTime(currentTime)).attr("x",(xScale(currentTime) - Util.toPixel(data.lineTextPadding))).attr("class","focusText leftSide") 
                         }
                         svgNode.style("cursor","default")
                         self.fire("dragend",{dateTime:self.currentTime})
                     })
        
        svgNode.append("text")
               .attr("class",(xScale(focusTime)>Util.toPixel(this.config.style.width)/2)?"focusText leftSide":"focusText rightSide")
               .text(formatTime(new Date(data.focusTime)))
               .attr("x",(xScale(focusTime)>Util.toPixel(this.config.style.width)/2)?(xScale(focusTime)-Util.toPixel(data.lineTextPadding)):(xScale(focusTime)+Util.toPixel(data.lineTextPadding)))
               .attr("y",(Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2)
        
        let focusGroup = svgNode.append("g")
                                .attr("class","focusGroup")
                                .on("mouseenter",function(){
                                    svgNode.style("cursor","col-resize")
                                })
                                .on("mouseleave",function(){
                                    svgNode.style("cursor","default")
                                })
                                .call(drag)  

        focusGroup.append("line")
                  .attr("class","focusLine")
                  .attr("x1",xScale(focusTime))
                  .attr("y1",0)
                  .attr("x2",xScale(focusTime))
                  .attr("y2",Util.toPixel(this.config.style.height)-Util.toPixel(data.axisHeight))
               
        let focusButton = focusGroup.append("g").attr("class","focusButton")
        focusButton.append("rect")
                   .attr("class","focusRect")
                   .attr("x",xScale(focusTime)-6)
                   .attr("y",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2 - 10))
                   .attr("rx","3").attr("ry","3")
                   .attr("width","12")
                   .attr("height","20")

        focusButton.append("line")
                   .attr("class","focusRectLine")
                   .attr("x1",xScale(focusTime)-4)
                   .attr("y1",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2 - 5))
                   .attr("x2",xScale(focusTime)+4)
                   .attr("y2",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2 - 5))
        
        focusButton.append("line")
                   .attr("class","focusRectLine")
                   .attr("x1",xScale(focusTime)-4)
                   .attr("y1",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2))
                   .attr("x2",xScale(focusTime)+4)
                   .attr("y2",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2))
        
        focusButton.append("line")
                   .attr("class","focusRectLine")
                   .attr("x1",xScale(focusTime)-4)
                   .attr("y1",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2 + 5))
                   .attr("x2",xScale(focusTime)+4)
                   .attr("y2",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2 + 5))
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
    
}

export class TimeAdjust extends SingleDataChart{
    constructor(conf?){
        super(conf)
             this.timelayer=new TimeAdjustLayer("timelayer",{
                 style:{
                     width:()=>this.config.style.width,
                     height:()=>this.config.style.height
                 }
             })
             this.timelayer.addTo(this)
             this.proxyEvents(this.timelayer,"draging","dragend")
        }
     defaultConfig(){
        return {
            style:{
                 width:"300px",
                 height:"300px",
                 position:"relative"
            },
            className:"timeAdjuster",
            el:null
        }
    }
    timelayer:TimeAdjustLayer
    setData(d){
        this.data=d
        this.fire("data_change")
    }
}

export interface ITimeAdjustData{
    focusTime:string,
    rangeMin:string,
    rangeMax:string,
    axisHeight:string,
    lineTextPadding:string,
    timeFormat:string,
    timeRound:number
}

