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
define(["require", "exports", "Util", "BaseChart", "TitleLayer", "PieLayer"], function (require, exports, Util, BaseChart_1, TitleLayer_1, PieLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DoublePieChart = (function (_super) {
        __extends(DoublePieChart, _super);
        function DoublePieChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.mainTitle = new TitleLayer_1.TitleLayer("title", { value: "hehe", className: "mainTitle", textAlign: "center" });
            _this.pieLayer1 = new PieLayer_1.PieLayer("pie1", { className: "pieChart1" });
            _this.pieLayer2 = new PieLayer_1.PieLayer("pie2", { className: "pieChart2" });
            _this.addLayer(_this.mainTitle);
            _this.addLayer(_this.pieLayer1);
            _this.addLayer(_this.pieLayer2);
            _this.init();
            return _this;
        }
        DoublePieChart.prototype.init = function () {
            var _this = this;
            this.on("chartUpdate", function () {
                ///calculate layout
                _this.mainTitle.setLayout({ width: "100%", height: _this.mainTitle.getTitleRect().height + "px" });
                _this.pieLayer1.setLayout({ top: _this.mainTitle.getTitleRect().height + "px", width: Util.toPixel(_this.config.width) / 2 + "px", height: (Util.toPixel(_this.config.height) - _this.mainTitle.getTitleRect().height) + "px" });
                _this.pieLayer2.setLayout({ top: _this.mainTitle.getTitleRect().height + "px", left: Util.toPixel(_this.config.width) / 2 + "px", width: Util.toPixel(_this.config.width) / 2 + "px", height: (Util.toPixel(_this.config.height) - _this.mainTitle.getTitleRect().height) + "px" });
            });
        };
        return DoublePieChart;
    }(BaseChart_1.BaseChart));
    exports.DoublePieChart = DoublePieChart;
});
