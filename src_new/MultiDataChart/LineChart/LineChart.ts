import d3 =require("d3")
import _ = require("underscore")
import {Util} from "../../Core/Util"
import {MultiDataChart} from "../../MultiDataChart/MultiDataChart"
import {BaseLayer,ILayerConfig,ILayerStyle} from "../../Core/BaseLayer"
import {AxisLayer} from "../../MultiDataChart/AxisLayer"

export class LineLayer extends BaseLayer {
    constructor(id?,conf?) {
        super(id,conf)
        this.on("addToChart",()=>{
            this.chart.on("style_change data_change",()=>{
                this.update()
            })
        })
    }
    config: LineLayerConfig
    defaultConfig(): LineLayerConfig {
        return {
            tagName: "svg",
            className: "lineChart",
            style: {
                top: "0px",
                left: "0px",
                bottom: null,
                right: null,
                position: "absolute",
                zindex: 0,
                width: "400rem",
                height: "200rem"
            },
            curveType: "linear",
            isDot: false,
            isArea: true
        }
    }

    chart:MultiDataChart

    curveTypeMap = {
        linear: d3.curveLinear,
        basis: d3.curveBasis,
        cardinal: d3.curveCardinal,
        step: d3.curveStep
    }

    drawer(svgNode:d3.Selection<Element,{},null,null>){
        let ds = this.chart.getAllMeasure()
        if(!ds || typeof(ds) == undefined || ds.length==0) {
            return
        }
        let series = ds.length
        let maxX = this.chart.max("x"),
            maxY = this.chart.max("y")
        let width = Util.toPixel(this.config.style.width),
            height = Util.toPixel(this.config.style.height)
        
        let xScale = d3.scaleLinear()
                       .domain([0,maxX])
                       .range([0, width])
        let yScale = d3.scaleLinear()
                       .domain([0,maxY])
                       .range([height,0])

        let line = d3.line<{x:number,y:number}>()
                     .x(function(v){return xScale(v.x)})
                     .y(function(v){return yScale(v.y)})
                     .curve(this.curveTypeMap[this.config.curveType])
        
        _.each(ds,(d,i)=>{
            let group = svgNode.append("svg:g")
                               .attr("class","series")
                               .attr("id","series"+i)
            group.append("path")
                 .attr("d",line(d.data))
                 .attr("stroke",this.chart.getColor(i))
                 .attr("stroke-width","2px")
                 .attr("fill","none")

            if(this.config.isDot) {
                _.each(d.data,(v:LineData,k)=>{
                    group.append("circle")
                         .attr("cx",xScale(v.x))
                         .attr("cy",yScale(v.y))
                         .attr("r","4")
                         .attr("fill",this.chart.getColor(i))
                })
            }

            if(this.config.isArea) {
                let area = d3.area<{x:number,y:number}>()
                             .x((d)=>{return xScale(d.x)})
                             .y0(Util.toPixel(this.config.style.height))
                             .y1((d)=>{return yScale(d.y)})
                group.append("g")
                     .append("path")
                     .attr("d",area(d.data))
                     .attr("stroke-width","0px")
                     .attr("fill",this.chart.getColor(i))
                     .style("opacity","0.3")
            }
        })
        return this
    }

    render() {
        this.el.innerHTML=""
        this.drawer(this.elD3)
        return this
    }
}

export interface LineLayerConfig extends ILayerConfig {
    curveType: string,
    isDot: boolean,
    isArea: boolean
}

export interface LineData {
    x:number,
    y:number
}

export class LineChart extends MultiDataChart {
    lineLayer:LineLayer
    axisLayer:AxisLayer

    constructor(conf?) {
        super(conf)
        this.axisLayer = new AxisLayer("axis",{
            style: {
                width: this.config.style.width,
                height: this.config.style.height
            }
        })
        this.lineLayer = new LineLayer("line",{
            style: {
                top: this.axisLayer.config.padding.top,
                left: this.axisLayer.config.padding.left,
                width: Util.toPixel(this.config.style.width) - Util.toPixel(this.axisLayer.config.padding.left)-Util.toPixel(this.axisLayer.config.padding.right),
                height: Util.toPixel(this.config.style.height)- Util.toPixel(this.axisLayer.config.padding.top)-Util.toPixel(this.axisLayer.config.padding.bottom)
            }
        })
        this.axisLayer.addTo(this)
        this.lineLayer.addTo(this)
    }

    setConfig(c:LineLayerConfig){
        this.lineLayer.setConfig(_.pick(c,"key"))
        this.axisLayer.setConfig(_.pick(c,"key"))
    }
}

