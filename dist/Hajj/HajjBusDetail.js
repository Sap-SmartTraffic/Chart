define(["require", "exports", "d3", "./LineChart", "../Measure"], function (require, exports, d3, LineChart_1, Measure_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HajjBusDetail = (function () {
        function HajjBusDetail() {
            this.el = d3.select(document.createDocumentFragment()).append("xhtml:div").node();
            this.lineChart1 = new LineChart_1.LineChart();
            this.lineChart2 = new LineChart_1.LineChart();
        }
        HajjBusDetail.prototype.toHtml = function () {
            var lineChart1 = d3.select(this.el).append("div").style("position", "absolute").style("left", "400px");
            var lineChart2 = d3.select(this.el).append("div").style("position", "absolute").style("left", "400px").style("top", "250px");
            this.lineChart1.setConfig({ width: "500px", height: "200px" });
            this.lineChart1.render(lineChart1.node());
            this.lineChart2.setConfig({ width: "500px", height: "200px" });
            this.lineChart2.render(lineChart2.node());
            return this.el;
        };
        HajjBusDetail.prototype.setData = function (d) {
            if (d.line1) {
                var m = new Measure_1.Measure(1, d.line1, "bar");
                this.lineChart1.addMeasure(m);
            }
            if (d.line2) {
                var m = new Measure_1.Measure(1, d.line1, "area");
                this.lineChart2.addMeasure(m);
            }
        };
        return HajjBusDetail;
    }());
    exports.HajjBusDetail = HajjBusDetail;
});
