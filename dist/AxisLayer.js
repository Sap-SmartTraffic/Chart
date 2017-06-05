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
    var AxisLayer = (function (_super) {
        __extends(AxisLayer, _super);
        function AxisLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.config = {
                type: "line",
                ticks: 6,
                tickSize: "6px",
                tickPadding: "3px",
                smallPadding: "10px",
                xAxisTitle: "",
                yAxisTitle: "",
                verticalGridLine: true,
                horizontalGridLine: true,
                className: ""
            };
            _this.setConfig(conf);
            return _this;
        }
        AxisLayer.prototype.calculateExtremum = function () {
            var ds = this.chart.measures;
            var maxX, maxY, minX, minY;
            if (this.config.type == "line") {
                maxX = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "x");
                maxY = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y");
                minX = Util.min(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "x");
                minY = Util.min(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y");
            }
            else if (this.config.type == "range") {
                maxX = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "x");
                minX = Util.min(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "x");
                var maxY0 = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y0"), maxY1 = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y1"), minY0 = Util.min(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y0"), minY1 = Util.min(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y1");
                maxY = Math.max(maxY0, maxY1);
                minY = Math.min(minY0, minY1);
            }
            return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
        };
        AxisLayer.prototype.calculateYaxisWidth = function () {
            var valueString = this.calculateExtremum().maxY.toString();
            return Util.toPixel(this.config.tickSize) + Util.toPixel(this.config.tickPadding) + Util.getStringRect(valueString).width;
        };
        AxisLayer.prototype.calculateXaxisHeight = function () {
            var valueString = this.calculateExtremum().maxX.toString();
            return Util.toPixel(this.config.tickSize) + Util.toPixel(this.config.tickPadding) + Util.getStringRect(valueString).height;
        };
        AxisLayer.prototype.calculatePaddingLeft = function () {
            return this.calculateYaxisWidth() + Util.getStringRect(this.config.yAxisTitle).height + Util.toPixel(this.config.smallPadding);
        };
        AxisLayer.prototype.calculatePaddingBottom = function () {
            return this.calculateXaxisHeight() + Util.getStringRect(this.config.xAxisTitle).height + Util.toPixel(this.config.smallPadding);
        };
        AxisLayer.prototype.drawer = function (svgNode) {
            var maxX = this.calculateExtremum().maxX;
            var maxY = this.calculateExtremum().maxY;
            var yAxisWidth = this.calculateYaxisWidth();
            var xAxisHeight = this.calculateXaxisHeight();
            var yAxisTitleHeight = Util.getStringRect(this.config.yAxisTitle).height;
            var xAxisTitleHeight = Util.getStringRect(this.config.xAxisTitle).height;
            var yAxisTitleWidth = Util.getStringRect(this.config.yAxisTitle).width;
            var xAxisTitleWidth = Util.getStringRect(this.config.xAxisTitle).width;
            var xScale = d3.scaleLinear().domain([0, maxX]).range([0, Util.toPixel(this.layout.width) - this.calculatePaddingLeft() - Util.toPixel(this.config.smallPadding)]);
            var yScale = d3.scaleLinear().domain([0, maxY]).range([Util.toPixel(this.layout.height) - this.calculatePaddingBottom() - Util.toPixel(this.config.smallPadding), 0]);
            if (this.config.verticalGridLine) {
                var xInner = d3.axisBottom(xScale).tickSize(Util.toPixel(this.layout.height) - this.calculatePaddingBottom() - Util.toPixel(this.config.smallPadding)).ticks(this.config.ticks).tickFormat("");
                svgNode.append("svg:g").call(xInner).attr("transform", "translate(" + this.calculatePaddingLeft() + "," + Util.toPixel(this.config.smallPadding) + ")").attr("class", "grid-line");
            }
            if (this.config.horizontalGridLine) {
                var yInner = d3.axisLeft(yScale).tickSize(Util.toPixel(this.layout.width) - this.calculatePaddingLeft() - Util.toPixel(this.config.smallPadding)).ticks(this.config.ticks).tickFormat("");
                svgNode.append("svg:g").call(yInner).attr("transform", "translate(" + (Util.toPixel(this.layout.width) - Util.toPixel(this.config.smallPadding)) + "," + Util.toPixel(this.config.smallPadding) + ")").attr("class", "grid-line");
            }
            var xAxis = d3.axisBottom(xScale).ticks(this.config.ticks);
            svgNode.append("svg:g").attr("class", "axis").call(xAxis).attr("transform", "translate(" + this.calculatePaddingLeft() + "," + (Util.toPixel(this.layout.height) - this.calculatePaddingBottom()) + ")");
            var yAxis = d3.axisLeft(yScale).ticks(this.config.ticks);
            svgNode.append("svg:g").attr("class", "axis").call(yAxis).attr("transform", "translate(" + this.calculatePaddingLeft() + "," + Util.toPixel(this.config.smallPadding) + ")");
            svgNode.append("svg:text").attr("class", "AxisTitle").attr("id", "xAxisTitle").text(this.config.xAxisTitle).attr("transform", "translate(" + (Util.toPixel(this.layout.width) + this.calculatePaddingLeft() - xAxisTitleWidth) / 2 + "," + (Util.toPixel(this.layout.height) - xAxisTitleHeight) + ")");
            svgNode.append("svg:text").attr("class", "AxisTitle").attr("id", "yAxisTitle").text(this.config.yAxisTitle).attr("transform", "rotate(-90),translate(" + (0 - (Util.toPixel(this.layout.height) - this.calculatePaddingBottom() + yAxisTitleWidth) / 2 + "," + yAxisTitleHeight + ")"));
            return this;
        };
        AxisLayer.prototype.renderer = function () {
            var _this = this;
            var conf = this.chart.config;
            var fragment = document.createDocumentFragment();
            var svg = d3.select(fragment).append("div").append("svg").classed(this.config.className, function () { return !!_this.config.className; });
            this.drawer(svg);
            return svg.node();
        };
        AxisLayer.prototype.updateDom = function () {
            var svg = d3.select(this.el);
            svg.selectAll("*").remove();
            this.drawer(svg);
            return this;
        };
        return AxisLayer;
    }(BaseLayer_1.BaseLayer));
    exports.AxisLayer = AxisLayer;
});
