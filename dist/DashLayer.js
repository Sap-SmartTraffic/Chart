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
define(["require", "exports", "d3", "Util", "BaseLayer"], function (require, exports, d3, Util, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DashLayer = (function (_super) {
        __extends(DashLayer, _super);
        function DashLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.config = {
                className: "dash",
                rangeMax: 100,
                padding: 25
            };
            _this.setConfig(conf);
            return _this;
        }
        DashLayer.prototype.drawer = function (svgNode) {
            var smartArcGen = function (startAngle, endAngle, innerRadius, outerRadius) {
                var largeArc = ((endAngle - startAngle) % (Math.PI * 2)) > Math.PI ? 1 : 0, startX = centerX + Math.cos(startAngle) * outerRadius, startY = centerY + Math.sin(startAngle) * outerRadius, endX2 = centerX + Math.cos(startAngle) * innerRadius, endY2 = centerY + Math.sin(startAngle) * innerRadius, endX = centerX + Math.cos(endAngle) * outerRadius, endY = centerY + Math.sin(endAngle) * outerRadius, startX2 = centerX + Math.cos(endAngle) * innerRadius, startY2 = centerY + Math.sin(endAngle) * innerRadius;
                var cmd = [
                    'M', startX, startY,
                    'A', outerRadius, outerRadius, 0, largeArc, 1, endX, endY,
                    'L', startX2, startY2,
                    'A', innerRadius, innerRadius, 0, largeArc, 0, endX2, endY2,
                    'Z'
                ];
                return cmd.join(' ');
            };
            var outerRadius = Util.toPixel(this.layout.width) / 2 - this.config.padding, innerRadius = Util.toPixel(this.layout.width) / 5, centerX = Util.toPixel(this.layout.width) / 2, centerY = Util.toPixel(this.layout.height) - this.config.padding;
            var ds = this.chart.measure;
            var radio = ds.data / this.config.rangeMax > 1 ? 1 : ds.data / this.config.rangeMax;
            var startAngle = -Math.PI, endAngle = startAngle + radio * Math.PI;
            var dashGroup = svgNode.append("g").attr("class", "dashGroup");
            dashGroup.append("path").attr("d", smartArcGen(-Math.PI, 0, innerRadius, outerRadius)).attr("fill", "#d6d6d6");
            dashGroup.append("path").attr("d", smartArcGen(startAngle, startAngle, innerRadius, outerRadius))
                .attr("fill", radio == null ? "none" : d3.scaleLinear().domain([0, 0.5, 1]).range(["red", "yellow", "green"])(radio))
                .transition().duration(500).ease(d3.easeLinear).delay(200)
                .attrTween("d", function (a) {
                return function (t) {
                    var interpolate = d3.interpolate(startAngle, endAngle);
                    return smartArcGen(startAngle, interpolate(t), innerRadius, outerRadius);
                };
            });
            dashGroup.append("text").attr("class", "dataValue")
                .attr("x", centerX)
                .attr("y", centerY)
                .attr("text-anchor", "middle")
                .attr("font-size", "32px")
                .text(ds.data + "km/h");
            dashGroup.append("text").attr("class", "rangeMin")
                .attr("x", centerX - innerRadius - (outerRadius - innerRadius) / 2)
                .attr("y", centerY)
                .attr("dy", Util.getStringRect("0", "", 14).height)
                .attr("text-anchor", "middle")
                .text("0")
                .attr("font-size", "14px");
            dashGroup.append("text").attr("class", "rangeMax")
                .attr("x", centerX + innerRadius + (outerRadius - innerRadius) / 2)
                .attr("y", centerY)
                .attr("dy", Util.getStringRect("0", "", 14).height)
                .attr("text-anchor", "middle")
                .text(this.config.rangeMax)
                .attr("font-size", "14px");
        };
        DashLayer.prototype.renderer = function () {
            var _this = this;
            var fragment = document.createDocumentFragment();
            var svg = d3.select(fragment).append("svg").classed(this.config.className, function () { return !!_this.config.className; });
            this.drawer(svg);
            return svg.node();
        };
        DashLayer.prototype.updateDom = function () {
            var svg = d3.select(this.el);
            svg.selectAll("*").remove();
            this.drawer(svg);
            return this;
        };
        return DashLayer;
    }(BaseLayer_1.BaseLayer));
    exports.DashLayer = DashLayer;
});
