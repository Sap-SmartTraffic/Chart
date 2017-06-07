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
define(["require", "exports", "Util", "BaseChart", "TitleLayer", "AxisLayer", "BarLayer", "LegendLayer", "TooltipLayer"], function (require, exports, Util, BaseChart_1, TitleLayer_1, AxisLayer_1, BarLayer_1, LegendLayer_1, TooltipLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BarChart = (function (_super) {
        __extends(BarChart, _super);
        function BarChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.mainTitle = new TitleLayer_1.TitleLayer("title", { value: "hehe", className: "mainTitle", textAlign: "center" });
            _this.axisLayer = new AxisLayer_1.AxisLayer("axis", { type: "ordinal", xAxisTitle: "日期", yAxisTitle: "当天参与活动的人数", verticalGridLine: false, className: "axisLayer" });
            _this.barLayer = new BarLayer_1.BarLayer("bar", { className: "bar" });
            _this.legendLayer = new LegendLayer_1.LegendLayer("legend", { className: "legend" });
            _this.tooltipLayer = new TooltipLayer_1.TooltipLayer("toolTip", { className: "tooltip" });
            _this.addLayer(_this.mainTitle);
            _this.addLayer(_this.axisLayer);
            _this.addLayer(_this.barLayer);
            _this.addLayer(_this.legendLayer);
            _this.addLayer(_this.tooltipLayer);
            _this.init();
            return _this;
        }
        BarChart.prototype.init = function () {
            var _this = this;
            this.on("chartUpdate", function () {
                _this.mainTitle.setLayout({ width: _this.config.width, height: _this.mainTitle.getTitleRect().height + "px" });
                _this.legendLayer.setLayout({ top: Util.toPixel(_this.config.height) - Util.toPixel(_this.legendLayer.config.height) + "px", width: _this.config.width, height: _this.legendLayer.config.height + "px" });
                _this.axisLayer.setLayout({ top: _this.mainTitle.getTitleRect().height + "px",
                    width: _this.config.width,
                    height: Util.toPixel(_this.config.height) - _this.mainTitle.getTitleRect().height - Util.toPixel(_this.legendLayer.layout.height) + "px" });
                _this.barLayer.setLayout({ top: _this.mainTitle.getTitleRect().height + Util.toPixel(_this.axisLayer.config.smallPadding) + "px",
                    left: _this.axisLayer.calculatePaddingLeft() + "px",
                    width: Util.toPixel(_this.config.width) - _this.axisLayer.calculatePaddingLeft() - Util.toPixel(_this.axisLayer.config.smallPadding) + "px",
                    height: Util.toPixel(_this.config.height) - _this.mainTitle.getTitleRect().height - _this.axisLayer.calculatePaddingBottom() - Util.toPixel(_this.axisLayer.config.smallPadding) - Util.toPixel(_this.legendLayer.layout.height) + "px" });
                _this.tooltipLayer.setLayout({ width: "150px" });
            });
            this.on("showTooltip", function (data) {
                _this.tooltipLayer.showTooltip(data);
            });
            this.on("hideTooltip", function () {
                _this.tooltipLayer.hideTooltip();
            });
        };
        BarChart.prototype.calculateLayout = function () {
        };
        return BarChart;
    }(BaseChart_1.BaseChart));
    exports.BarChart = BarChart;
});
