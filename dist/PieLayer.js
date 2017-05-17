var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "d3", "underscore", "Util", "BaseLayer"], function (require, exports, d3, _, Util, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PieLayer = (function (_super) {
        __extends(PieLayer, _super);
        function PieLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.setConfig(conf);
            return _this;
        }
        PieLayer.prototype.renderer = function () {
            var root = this.chart.el;
            var PI = Math.PI, cos = Math.cos, sin = Math.sin, sqrt = Math.sqrt;
            var outerRadius = Util.toPixel(this.layout.height) / 3, innerRadius = Util.toPixel(this.layout.height) / 6, innerestRadius = Util.toPixel(this.layout.height) / 9, centerX = Util.toPixel(this.layout.width) / 2, centerY = Util.toPixel(this.layout.height) / 2;
            var smartArcGen = function (startAngle, endAngle, innerRadius, outerRadius) {
                var largeArc = ((endAngle - startAngle) % (PI * 2)) > PI ? 1 : 0, startX = centerX + cos(startAngle) * outerRadius, startY = centerY + sin(startAngle) * outerRadius, endX2 = centerX + cos(startAngle) * innerRadius, endY2 = centerY + sin(startAngle) * innerRadius, endX = centerX + cos(endAngle) * outerRadius, endY = centerY + sin(endAngle) * outerRadius, startX2 = centerX + cos(endAngle) * innerRadius, startY2 = centerY + sin(endAngle) * innerRadius;
                var cmd = [
                    'M', startX, startY,
                    'A', outerRadius, outerRadius, 0, largeArc, 1, endX, endY,
                    'L', startX2, startY2,
                    'A', innerRadius, innerRadius, 0, largeArc, 0, endX2, endY2,
                    'Z'
                ];
                return cmd.join(' ');
            };
            var fragment = document.createDocumentFragment();
            var svg = d3.select(fragment).append("svg").attr("class", "pie");
            var ds = this.chart.measures;
            _.each(ds, function (d, i) {
                var max = Util.max(d.data, "value");
                var min = Util.min(d.data, "value");
                var scale = d3.scaleLinear().domain([0, max]).range([0, 1]);
                var segmentAngle = 2 * PI / 12;
                var toolTip = d3.select(root).append("div").attr("class", "toolTip");
                var doughnutTip = d3.select(root).append("div").attr("class", "doughnutTip")
                    .style("width", innerestRadius * sqrt(2) + "px").style("height", innerestRadius * sqrt(2) + "px")
                    .style("top", centerY + 38 - innerestRadius * sin(PI / 4) + "px").style("left", centerX - innerestRadius * sin(PI / 4) + "px");
                var doughnutTitle = d3.select(doughnutTip.node()).append("p").text("AM").attr("class", "doughnutTitle").style("line-height", innerestRadius * sqrt(2) + "px")
                    .style("opacity", 0).transition().duration(1000).styleTween("opacity", function () { return d3.interpolate("0", "1"); });
                var innerDoughnut = svg.append("g"), outerDoughnut = svg.append("g");
                d.data.forEach(function (v, n) {
                    var startAngle = -PI / 2 + segmentAngle * n;
                    var endAngle = startAngle + segmentAngle;
                    var midAngle = (startAngle + endAngle) / 2;
                    outerDoughnut.append("path")
                        .attr("class", "outerDoughnut").attr("id", "arc" + n).attr("fill", v.value == null ? "none" : d3.interpolate("green", "red")(scale(v.value)))
                        .attr("d", smartArcGen(startAngle, startAngle, innerRadius, outerRadius))
                        .on("mouseenter", function (e) {
                        d3.selectAll(".outerDoughnut").style("opacity", "0.5");
                        toolTip.text("时间: " + v.time + " " + "数量: " + v.value).style("display", "block");
                        d3.select("#arc" + n).transition().duration(200)
                            .attr("transform", "translate(" + (10 * cos(midAngle)) + "," + (10 * sin(midAngle)) + ")")
                            .style("opacity", "1");
                    })
                        .on("mousemove", function (e) {
                        toolTip.style("top", d3.event.y - Util.getStringRect(toolTip.text()).height - 16 + "px")
                            .style("left", d3.event.x - Util.getStringRect(toolTip.text()).width / 2 - 35 + "px");
                    })
                        .on("mouseout", function () {
                        d3.selectAll(".outerDoughnut").style("opacity", "1");
                        d3.select("#arc" + n).transition().duration(200).attr("transform", "translate(0)");
                        toolTip.style("display", "none");
                    })
                        .transition().duration(100).ease(d3.easeLinear).delay(1200 + 100 * n)
                        .attrTween("d", function (a) {
                        return function (t) {
                            var interpolate = d3.interpolate(startAngle, endAngle);
                            return smartArcGen(startAngle, interpolate(t), innerRadius, outerRadius);
                        };
                    })
                        .style("pointer-events", "none").transition().style("pointer-events", "auto");
                    innerDoughnut.append("path").attr("class", "innerDoughnut").attr("fill", "#d6d6d6")
                        .attr("d", smartArcGen(startAngle, startAngle, innerestRadius, innerRadius))
                        .transition().duration(100).ease(d3.easeLinear).delay(100 * n)
                        .attrTween("d", function (a) {
                        return function (t) {
                            var interpolate = d3.interpolate(startAngle, endAngle);
                            return smartArcGen(startAngle, interpolate(t), innerestRadius, innerRadius);
                        };
                    });
                });
            });
            return svg.node();
        };
        return PieLayer;
    }(BaseLayer_1.BaseLayer));
    exports.PieLayer = PieLayer;
});
