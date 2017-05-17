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
    var LegendLayer = (function (_super) {
        __extends(LegendLayer, _super);
        function LegendLayer(id, conf) {
            var _this = _super.call(this) || this;
            _this.setConfig(conf);
            return _this;
        }
        LegendLayer.prototype.init = function () {
        };
        LegendLayer.prototype.addLegend = function (legend) {
            this.config.legendGroup.push(legend);
        };
        LegendLayer.prototype.removeLegend = function (legend) {
            var target = _.findIndex(this.config.legendGroup, legend);
            this.config.legendGroup.splice(target, 1);
        };
        LegendLayer.prototype.renderer = function () {
            var _this = this;
            var ds = this.chart.measures;
            var fragment = document.createDocumentFragment();
            var legend = d3.select(fragment).append("xhtml:div").node();
            _.each(ds, function (d, i) {
                d3.select(legend).append("xhtml:div").style("width", "20px").style("height", "20px").style("background", _this.chart.getColorByIndex(i)).style("float", "left").style("margin-right", "5px");
                d3.select(legend).append("xhtml:p").style("line-height", "20px").style("float", "left").text("标签" + i).style("margin-right", "10px");
            });
            return legend;
        };
        return LegendLayer;
    }(BaseLayer_1.BaseLayer));
    exports.LegendLayer = LegendLayer;
});
