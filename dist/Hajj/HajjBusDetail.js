define(["require", "exports", "d3", "./LineChart", "../Measure", "../PieChart/PieChart"], function (require, exports, d3, LineChart_1, Measure_1, PieChart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HajjBusDetail = (function () {
        function HajjBusDetail() {
            this.el = d3.select(document.createDocumentFragment()).append("xhtml:div").node();
            this.lineChart1 = new LineChart_1.LineChart();
            this.lineChart2 = new LineChart_1.LineChart();
            this.pieChart1 = new PieChart_1.PieChart();
            this.pieChart2 = new PieChart_1.PieChart();
        }
        HajjBusDetail.prototype.toHtml = function () {
            var lineChart1 = d3.select(this.el).append("div").style("position", "absolute").style("left", "480px");
            var lineChart2 = d3.select(this.el).append("div").style("position", "absolute").style("left", "480px").style("top", "250px");
            this.lineChart1.setConfig({ width: "500px", height: "200px", showLegend: true, yLabel: "Km/H", showPredict: true });
            this.lineChart1.render(lineChart1.node());
            this.lineChart2.setConfig({ width: "500px", height: "200px", showLegend: false });
            this.lineChart2.render(lineChart2.node());
            var currentInfoContainer = d3.select(this.el).append("xhtml:div").style("position", "absolute").style("left", "100px").style("top", "70px");
            currentInfoContainer.append("header").append("div").text("Current Speed").classed("info-title", true);
            var section = currentInfoContainer.append("section");
            this.currentInfoValue = section.append("span").text("0").classed("info-value", true);
            section.append("span").text("Km/h").classed("info-suffix", true);
            var pieChartContainer = d3.select(this.el).append("xhtml:div").style("position", "absolute").style("left", "2px").style("top", "200px");
            this.pieChart1.setConfig({ width: "200px", height: "250px" }).render(pieChartContainer.node());
            var pieChartContainer2 = d3.select(this.el).append("xhtml:div").style("position", "absolute").style("left", "210px").style("top", "200px");
            this.pieChart2.setConfig({ width: "200px", height: "250px" }).render(pieChartContainer2.node());
            return this.el;
        };
        HajjBusDetail.prototype.setData = function (d) {
            if (d.line1) {
                var m = new Measure_1.Measure(1, d.line1, "area");
                this.lineChart1.addMeasure(m);
                var v = this.currentInfoValue.text(), newVl_1 = d.line1[d.line1.length - 1].y;
                var formatPercent_1 = d3.format(".3s");
                var currentInfoValue_1 = this.currentInfoValue;
                this.currentInfoValue.transition().duration(1000).delay(0)
                    .tween("text", function () {
                    var i = d3.interpolate(0, newVl_1);
                    return function (t) {
                        currentInfoValue_1.text(formatPercent_1(i(t)));
                    };
                });
            }
            if (d.predict) {
                var m = new Measure_1.Measure(2, d.predict, "line", { "stroke-dasharray": "2,2" });
                this.lineChart1.addMeasure(m);
            }
            if (d.line2) {
                var m = new Measure_1.Measure(1, d.line1, "bar");
                this.lineChart2.addMeasure(m);
            }
            if (d.pie1) {
                var m = new Measure_1.Measure(1, d.pie1, "pie");
                this.pieChart1.addMeasure(m);
            }
            if (d.pie2) {
                var m = new Measure_1.Measure(1, d.pie2, "pie");
                this.pieChart2.addMeasure(m);
            }
        };
        return HajjBusDetail;
    }());
    exports.HajjBusDetail = HajjBusDetail;
});
