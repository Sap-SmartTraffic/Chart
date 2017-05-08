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
define(["require", "exports", "BaseChart", "TitleLayer", "LineLayer", "Util"], function (require, exports, BaseChart_1, TitleLayer_1, LineLayer_1, Util) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineChart = (function (_super) {
        __extends(LineChart, _super);
        function LineChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.mainTitle = new TitleLayer_1.TitleLayer("title", { value: "hehe" });
            _this.lineLayer = new LineLayer_1.LineLayer();
            _this.addLayer(_this.mainTitle);
            _this.addLayer(_this.lineLayer);
            _this.initHook();
            return _this;
        }
        LineChart.prototype.initHook = function () {
            var _this = this;
            this.on("chartStyleChange", function () {
                _this.mainTitle.setLayout({ width: "100%", height: _this.mainTitle.getTitleRect().height + "px" });
                _this.lineLayer.setLayout({ top: "30px", width: _this.style.width, height: Util.toPixel(_this.style.height) - _this.mainTitle.getTitleRect().height + "px" });
            });
        };
        return LineChart;
    }(BaseChart_1.BaseChart));
    exports.LineChart = LineChart;
});
