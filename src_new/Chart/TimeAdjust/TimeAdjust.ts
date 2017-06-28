import d3 = require("d3")
import _ = require("underscore")
import {Util} from "../../Core/Util"
import {View,IViewConfig} from "../../Core/View"

export class TimeAdjust extends View {
    constructor(id,...confs) {
        super(confs)
        this.id = id==undefined?_.uniqueId("layer"):id
    }
    id: string
    config: TimeAdjustConfig
    defaultConfig():TimeAdjustConfig {
        return {
            tagName: "svg",
            className: "timeAdjust",
            style: {
                top: "0px",
                left: "0px",
                bottom: "null",
                right: "null",
                position: "absolute",
                "z-index": 0,
                width: "50rem",
                height: "10rem"
            },
            rangeMin:"6",
            rangeMax:"18",
            focusTime:"12",
            svgPadding:"20px",
            timeParse: "%H",
            timeFormat: "%H:%M",
            lineTextPadding: "20px"
        }
    }
    setConfig(c){
        this.config=Util.deepExtend(this.config,c)
    }

    drawer(svgNode:d3.Selection<Element,{},null,null>) {
        svgNode.append("rect").attr("class","panel")
               .attr("x",Util.toPixel(this.config.svgPadding))
               .attr("y",Util.toPixel(this.config.svgPadding))
               .attr("width",Util.toPixel(this.config.style.width) - Util.toPixel(this.config.svgPadding) * 2)
               .attr("height",Util.toPixel(this.config.style.height)- Util.toPixel(this.config.svgPadding) * 2)
        
        let self = this
        let parseTime = d3.timeParse(this.config.timeParse)
        let formatTime = d3.timeFormat(this.config.timeFormat)
        let focusTime = parseTime(this.config.focusTime)

        let xScale = d3.scaleTime()
                       .domain([parseTime(this.config.rangeMin),parseTime(this.config.rangeMax)])
                       .range([Util.toPixel(this.config.svgPadding),Util.toPixel(this.config.style.width)-Util.toPixel(this.config.svgPadding)])
        let xAxis = d3.axisBottom(xScale).tickFormat(formatTime).ticks(2)
        svgNode.append("g").attr("class","axis xAxis")
               .attr("transform","translate(0,"+(Util.toPixel(this.config.style.height)-Util.toPixel(this.config.svgPadding))+")")
               .call(xAxis)
               
        let drag = d3.drag()
                     .on("start",function(){
                         svgNode.style("cursor","col-resize")
                     })
                     .on("drag",function(){
                         if(xScale.invert(d3.event.x)>=parseTime(self.config.rangeMin)&&xScale.invert(d3.event.x)<=parseTime(self.config.rangeMax)){
                             let focusText = svgNode.select(".focusText"),
                                 focusLine = svgNode.select(".focusLine")
                             let oldLineX = Number(focusLine.attr("x1")),
                                 oldTextX = Number(focusText.attr("x"))
                             d3.select(this).attr("transform","translate("+(d3.event.x-oldLineX)+",0)")
                             if(d3.event.x > Util.toPixel(self.config.style.width)/2)
                                 focusText.text(formatTime(xScale.invert(d3.event.x))).attr("x",(d3.event.x - Util.toPixel(self.config.lineTextPadding))).attr("class","focusText leftSide")
                             else 
                                 focusText.text(formatTime(xScale.invert(d3.event.x))).attr("x",(d3.event.x + Util.toPixel(self.config.lineTextPadding))).attr("class","focusText rightSide")
                             
                             self.fire("dragLine",{time:xScale.invert(d3.event.x)})
                         }   
                     })
                     .on("end",function(){
                         svgNode.style("cursor","default")
                     })
        
        svgNode.append("text").attr("class",(xScale(focusTime)>Util.toPixel(this.config.style.width)/2)?"focusText leftSide":"focusText rightSide")
               .text(formatTime(parseTime(this.config.focusTime)))
               .attr("x",(xScale(focusTime)>Util.toPixel(this.config.style.width)/2)?(xScale(focusTime)-Util.toPixel(this.config.lineTextPadding)):(xScale(focusTime)+Util.toPixel(this.config.lineTextPadding)))
               .attr("y",(Util.toPixel(this.config.style.height)/2))
        
        let focusGroup = svgNode.append("g").attr("class","focusGroup")
                                .on("mouseenter",function(){
                                    svgNode.style("cursor","col-resize")
                                })
                                .on("mouseleave",function(){
                                    svgNode.style("cursor","default")
                                })
                                .call(drag)  

        focusGroup.append("line").attr("class","focusLine")
               .attr("x1",xScale(focusTime)).attr("y1",Util.toPixel(this.config.svgPadding))
               .attr("x2",xScale(focusTime)).attr("y2",Util.toPixel(this.config.style.height)-Util.toPixel(this.config.svgPadding))
               
        let focusButton = focusGroup.append("g").attr("class","focusButton")
        focusButton.append("rect").attr("class","focusRect")
               .attr("x",xScale(focusTime)-6)
               .attr("y",(Util.toPixel(this.config.style.height)/2 - 10))
               .attr("rx","3").attr("ry","3")
               .attr("width","12")
               .attr("height","20")

        focusButton.append("line").attr("class","focusRectLine")
               .attr("x1",xScale(focusTime)-4)
               .attr("y1",(Util.toPixel(this.config.style.height)/2 - 5))
               .attr("x2",xScale(focusTime)+4)
               .attr("y2",(Util.toPixel(this.config.style.height)/2 - 5))
        
        focusButton.append("line").attr("class","focusRectLine")
               .attr("x1",xScale(focusTime)-4)
               .attr("y1",(Util.toPixel(this.config.style.height)/2))
               .attr("x2",xScale(focusTime)+4)
               .attr("y2",(Util.toPixel(this.config.style.height)/2))
        
        focusButton.append("line").attr("class","focusRectLine")
               .attr("x1",xScale(focusTime)-4)
               .attr("y1",(Util.toPixel(this.config.style.height)/2 + 5))
               .attr("x2",xScale(focusTime)+4)
               .attr("y2",(Util.toPixel(this.config.style.height)/2 + 5))
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }

    renderAt(dom:Element|HTMLElement|SVGAElement) {
        dom.appendChild(this.el)
        this.render()
    }
}

export interface TimeAdjustConfig extends IViewConfig{
    tagName:string,
    className:string,
    style:{
        top: string|undefined|null,
        left: string|undefined|null,
        bottom: string|undefined|null,
        right: string|undefined|null,
        position: string|undefined|null,
        "z-index": number|undefined|null,
        width: string,
        height: string
    }
    rangeMin: string,
    rangeMax: string,
    focusTime: string,
    svgPadding: string,
    timeParse: string,
    timeFormat: string,
    lineTextPadding: string
}