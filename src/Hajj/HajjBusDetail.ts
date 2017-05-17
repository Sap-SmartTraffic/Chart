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
    toHtml(){
        let lineChart1=d3.select(this.el).append("div").style("position","absolute").style("left","480px")
        let lineChart2=d3.select(this.el).append("div").style("position","absolute").style("left","480px").style("top","250px")
        this.lineChart1.setConfig({width:"500px",height:"200px"})
        this.lineChart1.render(lineChart1.node())
        this.lineChart2.setConfig({width:"500px",height:"200px"})
        this.lineChart2.render(lineChart2.node())
        let pieChartContainer=d3.select(this.el).append("xhtml:div").style("position","absolute").style("left","2px").style("top","200px")
       this.pieChart1.setConfig({width:"200px",height:"250px"}).render(pieChartContainer.node())
        let pieChartContainer2=d3.select(this.el).append("xhtml:div").style("position","absolute").style("left","210px").style("top","200px")
        this.pieChart2.setConfig({width:"200px",height:"250px"}).render(pieChartContainer2.node())
        return this.el
    }
   setData(d){
       if(d.line1){
            let m= new Measure(1,d.line1,"bar")
            this.lineChart1.addMeasure(m)
       }
       if(d.line2){
            let m= new Measure(1,d.line1,"area")
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