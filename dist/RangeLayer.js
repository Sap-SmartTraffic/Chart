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
    var RangeLayer = (function (_super) {
        __extends(RangeLayer, _super);
        function RangeLayer(id, conf) {
            var _this = _super.call(this) || this;
            _this.curveTypeMap = {
                linear: d3.curveLinear,
                basis: d3.curveBasis,
                cardinal: d3.curveCardinal,
                step: d3.curveStep
            };
            _this.setConfig(conf);
            return _this;
        }
        RangeLayer.prototype.drawer = function (svgNode, curveType) {
            var _this = this;
            var ds = this.chart.measures;
            var maxX = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "x"), maxY0 = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y0"), maxY1 = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y1");
            var maxY = Math.max(maxY0, maxY1);
            var xScale = d3.scaleLinear().domain([0, maxX]).range([0, Util.toPixel(this.layout.width)]);
            var yScale = d3.scaleLinear().domain([0, maxY]).range([Util.toPixel(this.layout.height), 0]);
            _.each(ds, function (d, i) {
                var area = d3.area().x(function (d) { return xScale(d.x); }).y0(function (d) { return yScale(d.y0); }).y1(function (d) { return yScale(d.y1); }).curve(_this.curveTypeMap[curveType]);
                svgNode.append("svg:g").append("path").attr("d", area(d.data)).attr("stroke", "black").attr("stroke-width", "3px").attr("fill", d.style.color || _this.chart.getColor(i));
            });
        };
        RangeLayer.prototype.renderer = function () {
            var _this = this;
            var fragment = document.createDocumentFragment();
            var svg = d3.select(fragment).append("svg").classed(this.config.className, function () { return !!_this.config.className; });
            this.drawer(svg, "linear");
            return svg.node();
        };
        return RangeLayer;
    }(BaseLayer_1.BaseLayer));
    exports.RangeLayer = RangeLayer;
});
