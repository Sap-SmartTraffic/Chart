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
        function LineLayer(id, conf) {
            var _this = _super.call(this, conf) || this;
            _this.config = {
                className: "lineLayer",
                curveType: "linear",
                isDot: false,
                isArea: true
            };
            /*
            smartLineGen(xScale, yScale, isHandleNaN, ds) {
                if (ds.length < 1) return "M0,0";
                var lineString = "";
                var isStartPoint = true;
                if (!isHandleNaN) {
                    ds = ds.filter(function (v) {
                        return !isNaN(v.y);
                    })
                }
                for (var i = 0; i < ds.length; ++i) {
                    if (isStartPoint) {
                        if (isNaN(ds[i].y)) {
                            isStartPoint = true;
                            continue;
                        } else {
                            lineString += "M" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                            isStartPoint = false;
                        }
                    } else {
                        if (isNaN(ds[i].y)) {
                            isStartPoint = true;
                            continue;
                        } else {
                            lineString += "L" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                        }
                    }
        
                }
                return lineString;
            }
            */
            _this.curveTypeMap = {
                linear: d3.curveLinear,
                basis: d3.curveBasis,
                cardinal: d3.curveCardinal,
                step: d3.curveStep
            };
            _this.setConfig(conf);
            return _this;
        }
        LineLayer.prototype.eventHandler = function (svg) {
            this.chart.on("enterLegend", function (d) {
                svg.selectAll(".series").each(function () {
                    if (d3.select(this).attr("id") != ("series" + d.index))
                        d3.select(this).transition().duration(200).style("opacity", "0.2");
                });
            });
            this.chart.on("leaveLegend", function () {
                svg.selectAll(".series").transition().duration(200).style("opacity", "1");
            });
            this.chart.on("clickLegend", function (d) {
            });
        };
        LineLayer.prototype.drawer = function (svgNode) {
            var _this = this;
            var ds = this.chart.measures;
            var series = ds.length;
            var maxX = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "x"), maxY = Util.max(_.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value(), "y");
            var xScale = d3.scaleLinear()
                .domain([0, maxX])
                .range([0, Util.toPixel(this.layout.width)]);
            var yScale = d3.scaleLinear()
                .domain([0, maxY])
                .range([Util.toPixel(this.layout.height), 0]);
            var line = d3.line().x(function (v) { return xScale(v.x); })
                .y(function (v) { return yScale(v.y); })
                .curve(this.curveTypeMap[this.config.curveType]);
            _.each(ds, function (d, i) {
                var group = svgNode.append("svg:g").attr("class", "series").attr("id", "series" + i);
                group.append("path")
                    .attr("d", line(d.data))
                    .attr("stroke", d.style.color || _this.chart.getColor(i))
                    .attr("stroke-width", "2px")
                    .attr("fill", "none");
                if (_this.config.isDot) {
                    _.each(d.data, function (v, k) {
                        group.append("circle")
                            .attr("cx", xScale(v.x))
                            .attr("cy", yScale(v.y))
                            .attr("r", "4")
                            .attr("fill", _this.chart.getColor(i))
                            .on("mousemove", function () { _this.chart.fire("showTooltip", { xMark: v.x, index: i, series: d.id, value: v.y }); })
                            .on("mouseleave", function () { _this.chart.fire("hideTooltip"); });
                    });
                }
                if (_this.config.isArea) {
                    var area = d3.area().x(function (d) { return xScale(d.x); }).y0(Util.toPixel(_this.layout.height)).y1(function (d) { return yScale(d.y); });
                    group.append("g").append("path").attr("d", area(d.data)).attr("stroke-width", "0px").attr("fill", d.style.color || _this.chart.getColor(i)).style("opacity", "0.3");
                }
                //svgNode.append("svg:g").append("path").attr("d",this.smartLineGen(xScale,yScale,true,d.data)).attr("stroke",d.style.color||this.chart.getColor(i)).attr("fill","none")
            });
            return this;
        };
        LineLayer.prototype.renderer = function () {
            var _this = this;
            var fragment = document.createDocumentFragment();
            var svg = d3.select(fragment).append("svg").classed(this.config.className, function () { return !!_this.config.className; });
            this.drawer(svg);
            this.eventHandler(svg);
            return svg.node();
        };
        LineLayer.prototype.updateDom = function () {
            var svg = d3.select(this.el);
            svg.selectAll("*").remove();
            this.drawer(svg);
            return this;
        };
        return LineLayer;
    }(BaseLayer_1.BaseLayer));
    exports.LineLayer = LineLayer;
});
