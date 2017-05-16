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
    var attrs = Util.d3Invoke("attr");
    var LineLayer = (function (_super) {
        __extends(LineLayer, _super);
        function LineLayer(conf) {
            var _this = _super.call(this, conf) || this;
            _this.axisLayout = {
                xHidth: 20,
                yWidth: 25
            };
            return _this;
        }
        LineLayer.prototype.init = function () {
        };
        LineLayer.prototype.drawer = function (svgNode) {
            var _this = this;
            var ds = this.chart.measures;
            var maxX = 24, maxY = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y"), minX = 0, minY = 0;
            var xScale = d3.scaleLinear().domain([minX, maxX]).range([this.axisLayout.yWidth, Util.toPixel(this.layout.width, this.layout.width) - 5]);
            var yScale = d3.scaleLinear().domain([minY, maxY]).range([Util.toPixel(this.layout.height, this.layout.height) - this.axisLayout.xHidth, 5]);
            var xAxis = d3.axisBottom(xScale);
            svgNode.append("g").classed("xAxis", true).style("transform", "translate(0px," + (Util.toPixel(this.layout.height, this.layout.height) - this.axisLayout.xHidth) + "px").call(xAxis);
            var yAxis = d3.axisLeft(yScale);
            svgNode.append("g").classed("yAxis", true).style("transform", "translate(25px,0)").call(yAxis);
            var lines = svgNode.append("svg:g");
            var areas = svgNode.append("svg:g");
            var bars = svgNode.append("svg:g");
            // _.chain(ds).filter((d:any)=>d.type=="area").each(d=>{
            //     areas.append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).call(attrs({
            //         "stroke":d.style.color||this.chart.getColorByIndex(i)
            //     })).call(attrs(d.style))
            // })
            _.each(ds, function (d, i) {
                var lGen = d3.line();
                if (d.type == "line") {
                    lines.append("path").attr("d", _this.smartLineGen(xScale, yScale, true, d.data)).call(attrs({
                        "stroke": d.style.color || _this.chart.getColorByIndex(i)
                    })).call(attrs(d.style)).attr("fill", "none");
                }
                if (d.type == "area") {
                    areas.append("path").attr("d", _this.areaGen(xScale, yScale, d.data, Util.toPixel(_this.layout.height, _this.layout.height) - _this.axisLayout.xHidth)).call(attrs({
                        "fill": d.style.color || _this.chart.getColorByIndex(i)
                    })).call(attrs(d.style));
                }
                if (d.type == "bar") {
                    var width_1 = Math.max(Util.toPixel(_this.layout.width) / 24 - 1, 1);
                    _.each(d.data, function (dd, ii) {
                        bars.append("svg:rect").call(attrs({
                            height: Util.toPixel(_this.layout.height) - yScale(dd.y) - _this.axisLayout.xHidth,
                            width: width_1,
                            fill: d.style.color || _this.chart.getColorByIndex(i),
                            x: xScale(dd.x) - width_1 / 2,
                            y: yScale(dd.y)
                        }));
                    });
                }
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
        LineLayer.prototype.areaGen = function (xScale, yScale, ds, height) {
            if (ds.length < 1)
                return "M0,0";
            var strArr = [];
            strArr.push("M" + xScale(ds[0].x) + "," + height);
            strArr.push("L" + xScale(ds[0].x) + "," + yScale(ds[0].y));
            for (var i = 1; i < ds.length; ++i) {
                strArr.push("L" + xScale(ds[i].x) + "," + yScale(ds[i].y));
            }
            strArr.push("L" + xScale(ds[ds.length - 1].x) + "," + height);
            return strArr.join();
        };
        return LineLayer;
    }(BaseLayer_1.BaseLayer));
    exports.LineLayer = LineLayer;
});
