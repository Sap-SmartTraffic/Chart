import d3 = require("d3")
import _ = require("underscore")
import Util=require("Util")
let attrs=Util.d3Invoke("attr")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
import {LineChart} from "./LineChart"
export class LineLayer extends BaseLayer {
    constructor(conf ? ) {
        super(conf)
        this.setConfig(conf)
    }
    config: {
        className: string,
        showPredict:boolean
    }
    init() {
       
    }
    chart:LineChart
    axisLayout={
        xHidth:20,
        yWidth:25
    }
    drawer(svg){
        let legendHeight= this.chart.config.showLegend==true?20:5
        let svgNode=d3.select(svg)
        let ds = this.chart.measures
        let maxX =24,
            maxY =  Util.max(_.chain(ds).map((d)=>d.data).reduce((d1:any[],d2:any[])=>d1.concat(d2)).value(),"y"),
            minX =0,
            minY = 0
        let xScale=d3.scaleLinear().domain([minX,maxX]).range([this.axisLayout.yWidth,Util.toPixel(this.layout.width,this.layout.width)-5])
        let yScale =d3.scaleLinear().domain([minY,maxY]).range([Util.toPixel(this.layout.height,this.layout.height)-this.axisLayout.xHidth,legendHeight])
        let xAxis=d3.axisBottom(xScale)
        svgNode.append("g").classed("xAxis",true).style("transform","translate(0px,"+(Util.toPixel(this.layout.height,this.layout.height)-this.axisLayout.xHidth)+"px").call(xAxis)
        let yAxis=d3.axisLeft(yScale)
        svgNode.append("g").classed("yAxis",true).style("transform","translate(25px,0)").call(yAxis)
        
       if(this.chart.config.showLegend){
            let legend=svgNode.append("g").classed("legend",true)
             legend.append("svg:text").text(this.chart.config.yLabel||"").call(attrs({x:this.axisLayout.yWidth+2,y:legendHeight,"font-size":"12px"}))
            if(this.chart.config.showPredict){
                    let text="Predict",xOffset=Util.toPixel(this.layout.width)-Util.getStringRect(text,null,12).width
                    legend.append("line").call(attrs({x1:xOffset-25,
                                                            y1:legendHeight/2+4,
                                                            x2:xOffset-5,
                                                            y2:legendHeight/2+4,
                                                            stroke:"black",
                                                            "stroke-width":"1px",
                                                        
                                                            "stroke-dasharray":"1,2"}))
                    legend.append("svg:text").text(text).call(attrs({
                        x:xOffset,
                        y:legendHeight,
                        "font-size":"12px",
                    }))
                }
            }


        let lines=svgNode.append("svg:g")
        let areas=svgNode.append("svg:g")
        let bars= svgNode.append("svg:g")
        // _.chain(ds).filter((d:any)=>d.type=="area").each(d=>{
        //     areas.append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).call(attrs({
        //         "stroke":d.style.color||this.chart.getColorByIndex(i)
        //     })).call(attrs(d.style))
        // })
        _.each(ds,(d:any,i)=>{
            let lGen=d3.line()
           if(d.type=="line"){
                lines.append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).call(attrs({
                    "stroke":d.style.color||this.chart.getColor(i)
                })).call(attrs(d.style)).attr("fill","none")
           }
            if(d.type=="area"){
                lines.append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).call(attrs({
                    "stroke":d.style.color||this.chart.getColor(i)
                })).call(attrs(d.style)).attr("fill","none")
                 areas.append("path").attr("d",this.areaGen(xScale,yScale,d.data,Util.toPixel(this.layout.height,this.layout.height)-this.axisLayout.xHidth)).call(attrs({
                     "fill":d.style.fill||this.chart.getColor(i),
                     "opacity":d.style.opacity||0.5
                }))
            }
            if(d.type=="bar"){
                let width=Math.max(Util.toPixel(this.layout.width)/24-1,1)
                _.each(d.data,(dd:any,ii)=>{
                   let bar= bars.append("svg:rect")
                    bar.call(attrs({
                        height:0,
                        width,
                        fill:d.style.color||this.chart.getColor(i),
                        x:xScale(dd.x)-width/2,
                        y:Util.toPixel(this.layout.height)-this.axisLayout.xHidth
                    }))
                   bar.transition().delay(ii*100).duration(500).attr("y",yScale(dd.y)).attr("height",Util.toPixel(this.layout.height)- yScale(dd.y)-this.axisLayout.xHidth)
                })
            }
        
        })
        return this
    }
    drawAxis(svgNode){
        
    }
    renderer() {
        let conf = this.chart.config
        let fragment = document.createDocumentFragment()
        let svg = d3.select(fragment).append("svg").classed(this.config.className, () => !!this.config.className)
        this.drawer(svg.node())
        return svg.node()
    }
    updateDom(){
        let svg=d3.select(this.el)
        svg.selectAll("*").remove()
        this.drawer(svg.node())
        return this
    }
    smartLineGen(xScale, yScale, isHandleNaN, ds) {
        if (ds.length < 1) return "M0,0";
        var lineString = "";
        var isStartPoint = true;
        if (!isHandleNaN) {
            ds = ds.filter(function (v) {
                return !isNaN(v.y);
            })
        }
        for (var i = 0; i < ds.length; ++i) {
            if (isStartPoint) {
                if (isNaN(ds[i].y)) {
                    isStartPoint = true;
                    continue;
                } else {
                    lineString += "M" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                    isStartPoint = false;
                }
            } else {
                if (isNaN(ds[i].y)) {
                    isStartPoint = true;
                    continue;
                } else {
                    lineString += "L" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                }
            }

        }
        return lineString;
    }
    areaGen(xScale, yScale, ds,height) {
        if (ds.length < 1) return "M0,0";
        var strArr=[]
        strArr.push("M"+xScale(ds[0].x)+","+height)
        strArr.push("L"+xScale(ds[0].x)+","+yScale(ds[0].y))
        for(let i =1;i<ds.length;++i){
            strArr.push( "L" + xScale(ds[i].x) + "," + yScale(ds[i].y))
        }
         strArr.push("L"+xScale(ds[ds.length-1].x)+","+height)
        return strArr.join();
    }
}