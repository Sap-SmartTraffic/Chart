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
    var BarLayer = (function (_super) {
        __extends(BarLayer, _super);
        function BarLayer(id, conf) {
            var _this = _super.call(this) || this;
            _this.setConfig(conf);
            return _this;
        }
        BarLayer.prototype.drawer = function (svgNode) {
            var _this = this;
            var ds = this.chart.measures;
            var series = ds.length;
            var xMarks = ds[0].data.length;
            var maxY = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y");
            var xScale = d3.scaleBand().domain(_.range(xMarks)).rangeRound([0, Util.toPixel(this.layout.width)]).paddingInner(0.1).paddingOuter(0.2);
            var seriesScale = d3.scaleBand().domain(_.range(series)).rangeRound([0, xScale.bandwidth()]);
            var yScale = d3.scaleLinear().domain([0, maxY]).range([0, Util.toPixel(this.layout.height)]);
            _.each(ds, function (d, i) {
                var group = svgNode.append("g").attr("class", "series" + i).attr("transform", "translate(" + (i * seriesScale.bandwidth()) + ",0)");
                _.each(d.data, function (v, k) {
                    group.append("rect").attr("id", "rect" + k)
                        .attr("x", xScale(k)).attr("y", Util.toPixel(_this.layout.height))
                        .attr("width", seriesScale.bandwidth()).attr("height", yScale(v.y))
                        .attr("fill", _this.chart.getColor(i))
                        .on("mousemove", function () { _this.chart.fire("showTooltip", { xMark: v.x, series: d.id, value: v.y }); })
                        .on("mouseleave", function () { _this.chart.fire("hideTooltip"); })
                        .transition().duration(1000)
                        .attr("y", Util.toPixel(_this.layout.height) - yScale(v.y));
                });
            });
        };
        BarLayer.prototype.renderer = function () {
            var _this = this;
            var fragment = document.createDocumentFragment();
            var svg = d3.select(fragment).append("svg").classed(this.config.className, function () { return !!_this.config.className; });
            this.drawer(svg);
            return svg.node();
        };
        return BarLayer;
    }(BaseLayer_1.BaseLayer));
    exports.BarLayer = BarLayer;
});
