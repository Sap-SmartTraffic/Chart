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
define(["require", "exports", "d3", "underscore", "BaseLayer"], function (require, exports, d3, _, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineLayer = (function (_super) {
        __extends(LineLayer, _super);
        function LineLayer(conf) {
            return _super.call(this, conf) || this;
        }
        LineLayer.prototype.init = function () {
        };
        LineLayer.prototype.renderer = function () {
            var _this = this;
            var conf = this.chart.config;
            var fragment = document.createDocumentFragment();
            var svg = d3.select(fragment).append("svg").classed(this.config.className, function () { return !!_this.config.className; });
            var ds = this.chart.measures;
            var maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE, minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
            _.chain(ds).map(function (d) { return d.data; }).reduce(function (d1, d2) { return d1.concat(d2); }).value().forEach(function (d) {
                maxX = Math.max(d.x, maxX);
                maxY = Math.max(d.x, maxY);
                minX = Math.min(d.x, minX);
                minY = Math.min(d.x, minY);
            });
            // ds.map((d) => d.data).reduce((d1, d2) => d1.concat(d2)).forEach(d => {
            //     maxX = Math.max(d.x, maxX)
            //     maxY = Math.max(d.x, maxY)
            //     minX = Math.min(d.x, minX)
            //     minY = Math.min(d.x, minY)
            // })
            var lines = svg.append("svg:g");
            var xScale = d3.scaleLinear().domain([minX, maxX]).range([0, 300]);
            var yScale = d3.scaleLinear().domain([minY, maxY]).range([300, 0]);
            _.each(ds, function (d, i) {
                var lGen = d3.line();
                lines.append("path").attr("d", _this.smartLineGen(xScale, yScale, true, d.data)).attr("stroke", d.style.color || _this.chart.getColorByIndex(i));
            });
            return svg.node();
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
