import d3= require("d3")
import {LineChart} from "./LineChart"
import {LineLayer} from "./LineLayer"
import {Measure}from "../Measure"
import {PieChart} from "../PieChart/PieChart"
export class HajjBusDetail{
    el=d3.select(document.createDocumentFragment()).append("xhtml:div").node()
    lineChart1=new LineChart()
    lineChart2=new LineChart()
    pieChart1= new PieChart()
    pieChart2 = new PieChart()
    currentInfoValue:any
    toHtml(){
        let lineChart1=d3.select(this.el).append("div").style("position","absolute").style("left","480px")
        let lineChart2=d3.select(this.el).append("div").style("position","absolute").style("left","480px").style("top","250px")
        this.lineChart1.setConfig({width:"500px",height:"200px",showLegend:true,yLabel:"Km/H",showPredict:true})
        this.lineChart1.render(lineChart1.node())
        this.lineChart2.setConfig({width:"500px",height:"200px",showLegend:false})
        this.lineChart2.render(lineChart2.node())
        let currentInfoContainer=d3.select(this.el).append("xhtml:div").style("position","absolute").style("left","100px").style("top","70px")
            currentInfoContainer.append("header").append("div").text("Current Speed").classed("info-title",true)
            let section=currentInfoContainer.append("section")
        this.currentInfoValue= section.append("span").text("0").classed("info-value",true)
        section.append("span").text("Km/h").classed("info-suffix",true)
        let pieChartContainer=d3.select(this.el).append("xhtml:div").style("position","absolute").style("left","2px").style("top","200px")
        this.pieChart1.setConfig({width:"200px",height:"250px"}).render(pieChartContainer.node())
        let pieChartContainer2=d3.select(this.el).append("xhtml:div").style("position","absolute").style("left","210px").style("top","200px")
        this.pieChart2.setConfig({width:"200px",height:"250px"}).render(pieChartContainer2.node())
        return this.el
    }
   setData(d){
       if(d.line1){
            let m= new Measure(1,d.line1,"area")
            this.lineChart1.addMeasure(m)
            let v=this.currentInfoValue.text(),newVl=d.line1[d.line1.length-1].y
            let formatPercent = d3.format(".3s");
            let currentInfoValue=this.currentInfoValue
            this.currentInfoValue.transition().duration(1000).delay(0)
                .tween("text", function() {
                var i = d3.interpolate(0, newVl);
                return function(t) {
                   currentInfoValue.text(formatPercent(i(t)));
                };
                });
       }
       if(d.predict){
            let m= new Measure(2,d.predict,"line",{"stroke-dasharray":"2,2"})
            this.lineChart1.addMeasure(m)
       }
       if(d.line2){
            let m= new Measure(1,d.line1,"bar")
            this.lineChart2.addMeasure(m)
       }
       if(d.pie1){
           let m =new Measure(1,d.pie1,"pie")
            this.pieChart1.addMeasure(m)
       }
       if(d.pie2){
             let m =new Measure(1,d.pie2,"pie")
            this.pieChart2.addMeasure(m)
       }
    }
}