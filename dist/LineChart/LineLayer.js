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
    var LineLayer = (function (_super) {
        __extends(LineLayer, _super);
        function LineLayer(conf) {
            var _this = _super.call(this, conf) || this;
            _this.axisLayout = {
                xHidth: 20,
                yWidth: 20
            };
            return _this;
        }
        LineLayer.prototype.init = function () {
        };
        LineLayer.prototype.drawer = function (svgNode) {
            var _this = this;
            var ds = this.chart.measures;
            var maxX = 24, maxY = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y"), minX = 0, minY = Util.min(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y");
            var xScale = d3.scaleLinear().domain([minX, maxX]).range([this.axisLayout.yWidth, Util.toPixel(this.layout.width, this.layout.width)]);
            var yScale = d3.scaleLinear().domain([minY, maxY]).range([Util.toPixel(this.layout.height, this.layout.height) - this.axisLayout.xHidth, 0]);
            var xAxis = d3.axisLeft(xScale);
            svgNode.call(xAxis);
            var yAxis = d3.axisBottom(yScale);
            svgNode.call(yAxis);
            var lines = svgNode.append("svg:g");
            _.each(ds, function (d, i) {
                var lGen = d3.line();
                lines.append("path").attr("d", _this.smartLineGen(xScale, yScale, true, d.data)).attr("stroke", d.style.color || _this.chart.getColorByIndex(i));
            });
            return this;
        };
        LineLayer.prototype.drawAxis = function (svgNode) {
        };
        LineLayer.prototype.renderer = function () {
            var _this = this;
            var conf = this.chart.config;
            var fragment = document.createDocumentFragment();
            var svg = d3.select(fragment).append("svg").classed(this.config.className, function () { return !!_this.config.className; });
            this.drawer(svg);
            return svg.node();
        };
        LineLayer.prototype.updateDom = function () {
            var svg = d3.select(this.el);
            svg.selectAll("*").remove();
            this.drawer(svg);
            return this;
        };
        LineLayer.prototype.smartLineGen = function (xScale, yScale, isHandleNaN, ds) {
            if (ds.length < 1)
                return "M0,0";
            var lineString = "";
            var isStartPoint = true;
            if (!isHandleNaN) {
                ds = ds.filter(function (v) {
                    return !isNaN(v.y);
                });
            }
            for (var i = 0; i < ds.length; ++i) {
                if (isStartPoint) {
                    if (isNaN(ds[i].y)) {
                        isStartPoint = true;
                        continue;
                    }
                    else {
                        lineString += "M" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                        isStartPoint = false;
                    }
                }
                else {
                    if (isNaN(ds[i].y)) {
                        isStartPoint = true;
                        continue;
                    }
                    else {
                        lineString += "L" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                    }
                }
            }
            return lineString;
        };
        return LineLayer;
    }(BaseLayer_1.BaseLayer));
    exports.LineLayer = LineLayer;
});
