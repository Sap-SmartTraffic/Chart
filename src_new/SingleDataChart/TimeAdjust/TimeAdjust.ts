import d3 = require('d3');
import _ = require('underscore');
import { Util } from '../../Core/Util';
import { SingleDataChart } from '../../Core/BaseChart';
import { BaseLayer } from '../../Core/BaseLayer';

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
            rangeMin:"6",
            rangeMax:"18",
            focusTime:"12",
            axisHeight:"20px",
            timeParse: "%H",
            timeFormat: "%H:%M",
            lineTextPadding: "20px"
        },d)
    }
    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        let data=this.parseData(this.chart.getData())
        let width=Util.toPixel(this.evaluateStyle().width)
        let heigh  =Util.toPixel(this.evaluateStyle().height)
        svgNode.append("rect").attr("class","panel")
               .attr("x",0)
               .attr("y",0)
               .attr("width",width)
               .attr("height",heigh- Util.toPixel(data.axisHeight))
        
        let self = this
        let parseTime = d3.timeParse(data.timeParse)
        let formatTime = d3.timeFormat(data.timeFormat)
        let focusTime = parseTime(data.focusTime)

        let xScale = d3.scaleTime()
                       .domain([parseTime(data.rangeMin),parseTime(data.rangeMax)])
                       .range([5,width-5])
        
        svgNode.append("rect").attr("class","axisBackground")
               .attr("x","0").attr("y",heigh-Util.toPixel(data.axisHeight))
               .attr("width",width).attr("height",Util.toPixel(data.axisHeight))
        let axis = svgNode.append("g").attr("class","axis xAxis")
                          .attr("transform","translate(0,"+(Util.toPixel(this.config.style.height)-Util.toPixel(data.axisHeight))+")")
        
        axis.append("path").attr("class","domain").attr("stroke","#000").attr("stroke-width","1")
            .attr("d","M 0.5,0 H"+(Util.toPixel(this.config.style.width)-0.5))
        let tick1 = axis.append("g").attr("class","tick").attr("transform","translate(0.5,0)")
        tick1.append("text").attr("dy","3").attr("alignment-baseline","hanging")
             .attr("text-anchor","start").text(formatTime(parseTime(data.rangeMin)))
        let tick2 = axis.append("g").attr("class","tick").attr("transform","translate("+ Util.toPixel(this.config.style.width)/2 +",0)")
        tick2.append("text").attr("dy","3").attr("alignment-baseline","hanging")
             .attr("text-anchor","middle").text(formatTime(xScale.invert(Util.toPixel(this.config.style.width)/2)))
        let tick3 = axis.append("g").attr("class","tick").attr("transform","translate("+(Util.toPixel(this.config.style.width)-0.5)+",0)")
        tick3.append("text").attr("dy","3").attr("alignment-baseline","hanging")
             .attr("text-anchor","end").text(formatTime(parseTime(data.rangeMax)))

               
        let drag = d3.drag()
                     .on("start",function(){
                         svgNode.style("cursor","col-resize")
                     })
                     .on("drag",function(){
                        
                         if(xScale.invert(d3.event.x)>=parseTime(data.rangeMin)&&xScale.invert(d3.event.x)<=parseTime(data.rangeMax)){
                             let focusText = svgNode.select(".focusText"),
                                 focusLine = svgNode.select(".focusLine")
                             let oldLineX = Number(focusLine.attr("x1")),
                                 oldTextX = Number(focusText.attr("x"))
                             d3.select(this).attr("transform","translate("+(d3.event.x-oldLineX)+",0)")
                             if(d3.event.x > Util.toPixel(self.config.style.width)/2)
                                 focusText.text(formatTime(xScale.invert(d3.event.x))).attr("x",(d3.event.x - Util.toPixel(data.lineTextPadding))).attr("class","focusText leftSide")
                             else 
                                 focusText.text(formatTime(xScale.invert(d3.event.x))).attr("x",(d3.event.x + Util.toPixel(data.lineTextPadding))).attr("class","focusText rightSide")
                             self.currentTime=xScale.invert(d3.event.x)
                             self.fire("draging",{dateTime:xScale.invert(d3.event.x)})
                         }   
                     })
                     .on("end",function(){
                         svgNode.style("cursor","default")
                         let data=xScale.invert(d3.event.x)

                         self.fire("dragend",{dateTime:self.currentTime})
                     })
        
        svgNode.append("text").attr("class",(xScale(focusTime)>Util.toPixel(this.config.style.width)/2)?"focusText leftSide":"focusText rightSide")
               .text(formatTime(parseTime(data.focusTime)))
               .attr("x",(xScale(focusTime)>Util.toPixel(this.config.style.width)/2)?(xScale(focusTime)-Util.toPixel(data.lineTextPadding)):(xScale(focusTime)+Util.toPixel(data.lineTextPadding)))
               .attr("y",(Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2)
        
        let focusGroup = svgNode.append("g").attr("class","focusGroup")
                                .on("mouseenter",function(){
                                    svgNode.style("cursor","col-resize")
                                })
                                .on("mouseleave",function(){
                                    svgNode.style("cursor","default")
                                })
                                .call(drag)  

        focusGroup.append("line").attr("class","focusLine")
               .attr("x1",xScale(focusTime)).attr("y1",0)
               .attr("x2",xScale(focusTime)).attr("y2",Util.toPixel(this.config.style.height)-Util.toPixel(data.axisHeight))
               
        let focusButton = focusGroup.append("g").attr("class","focusButton")
        focusButton.append("rect").attr("class","focusRect")
               .attr("x",xScale(focusTime)-6)
               .attr("y",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2 - 10))
               .attr("rx","3").attr("ry","3")
               .attr("width","12")
               .attr("height","20")

        focusButton.append("line").attr("class","focusRectLine")
               .attr("x1",xScale(focusTime)-4)
               .attr("y1",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2 - 5))
               .attr("x2",xScale(focusTime)+4)
               .attr("y2",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2 - 5))
        
        focusButton.append("line").attr("class","focusRectLine")
               .attr("x1",xScale(focusTime)-4)
               .attr("y1",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2))
               .attr("x2",xScale(focusTime)+4)
               .attr("y2",((Util.toPixel(this.config.style.height) - Util.toPixel(data.axisHeight))/2))
        
        focusButton.append("line").attr("class","focusRectLine")
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
       
    timelayer:TimeAdjustLayer
    setData(d:ITimeAdjustData){
        this.data=d
    }
}

export interface ITimeAdjustData{
    timeParse:string,
    focusTime:string,
    rangeMin:string,
    rangeMax:string,
    axisHeight:string,
    lineTextPadding:string,
    timeFormat:string
}

