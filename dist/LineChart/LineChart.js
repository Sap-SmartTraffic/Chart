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
define(["require", "exports", "Util", "BaseChart", "TitleLayer", "AxisLayer", "LineLayer"], function (require, exports, Util, BaseChart_1, TitleLayer_1, AxisLayer_1, LineLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineChart = (function (_super) {
        __extends(LineChart, _super);
        function LineChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.mainTitle = new TitleLayer_1.TitleLayer("title", { value: "hehe", className: "mainTitle", textAlign: "center" });
            _this.axisLayer = new AxisLayer_1.AxisLayer("axis", { xAxisTitle: "x-coordinate", yAxisTitle: "y-coordinate", className: "axis" });
            _this.lineLayer = new LineLayer_1.LineLayer("line1", { className: "line1" });
            _this.addLayer(_this.mainTitle);
            _this.addLayer(_this.lineLayer);
            _this.addLayer(_this.axisLayer);
            _this.init();
            return _this;
        }
        LineChart.prototype.init = function () {
            var _this = this;
            this.on("chartUpdate", function () {
                ///calculate layout
                _this.mainTitle.setLayout({ width: "100%", height: _this.mainTitle.getTitleRect().height + "px" });
                _this.lineLayer.setLayout({ top: _this.mainTitle.getTitleRect().height, left: _this.axisLayer.calculatePaddingLeft() + "px", width: Util.toPixel(_this.config.width) - _this.axisLayer.calculatePaddingLeft() + "px", height: Util.toPixel(_this.config.height) - _this.mainTitle.getTitleRect().height - _this.axisLayer.calculatePaddingBottom() + "px" });
                _this.axisLayer.setLayout({ top: _this.mainTitle.getTitleRect().height + "px", width: _this.config.width, height: Util.toPixel(_this.config.height) - _this.mainTitle.getTitleRect().height + "px" });
            });
        };
        return LineChart;
    }(BaseChart_1.BaseChart));
    exports.LineChart = LineChart;
});
