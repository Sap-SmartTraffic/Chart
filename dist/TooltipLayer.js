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
    var TooltipLayer = (function (_super) {
        __extends(TooltipLayer, _super);
        function TooltipLayer(id, conf) {
            var _this = _super.call(this) || this;
            _this.setConfig(conf);
            return _this;
        }
        TooltipLayer.prototype.eventHandler = function () {
            var _this = this;
            this.chart.on("showTooltip", function (d) {
                d3.select(_this.el).style("display", "block")
                    .style("top", d3.event.layerY + "px")
                    .style("left", d3.event.layerX + Util.toPixel(_this.layout.width) / 2 + "px")
                    .html(_this.getTooltipContent(d));
            });
            this.chart.on("hideTooltip", function () {
                d3.select(_this.el).style("display", "none");
            });
        };
        TooltipLayer.prototype.getTooltipContent = function (data) {
            var textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>" + data.xMark + "</th></tr>";
            var text = "<tr><td class='name'><span style='background-color:" + this.chart.getColor(data.index) + "'></span>" + "系列" + data.series + "</td><td class='value'>" + data.value + "</td></tr>";
            var textEnd = "</tbody></table>";
            return textStart + text + textEnd;
        };
        TooltipLayer.prototype.renderer = function () {
            this.eventHandler();
            var ds = this.chart.measures;
            var fragment = document.createDocumentFragment();
            var tooltip = d3.select(fragment).append("xhtml:div").attr("class", "tooltip-container").style("pointer-events", "none").style("display", "none");
            return tooltip.node();
        };
        return TooltipLayer;
    }(BaseLayer_1.BaseLayer));
    exports.TooltipLayer = TooltipLayer;
});
