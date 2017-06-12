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
define(["require", "exports", "Util", "BaseChart", "TitleLayer", "DashLayer"], function (require, exports, Util, BaseChart_1, TitleLayer_1, DashLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DashChart = (function (_super) {
        __extends(DashChart, _super);
        function DashChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.mainTitle = new TitleLayer_1.TitleLayer("title", { value: "pieChart", className: "mainTitle", textAlign: "center" });
            _this.dashLayer = new DashLayer_1.DashLayer("dash", { className: "dashChart" });
            _this.addLayer(_this.dashLayer);
            _this.addLayer(_this.mainTitle);
            _this.init();
            return _this;
        }
        DashChart.prototype.init = function () {
            var _this = this;
            this.on("chartUpdate", function () {
                ///calculate layout
                _this.mainTitle.setLayout({ width: "100%", height: _this.mainTitle.getTitleRect().height + "px" });
                _this.dashLayer.setLayout({ top: _this.mainTitle.getTitleRect().height + "px", width: Util.toPixel(_this.config.width) + "px", height: Util.toPixel(_this.config.height) - Util.toPixel(_this.mainTitle.layout.height) + "px" });
                //this.tooltipLayer.setLayout({width:"150px",height:"100px"})
            });
            this.on("measure-change", function () {
                _this.dashLayer.updateDom();
            });
        };
        return DashChart;
    }(BaseChart_1.BaseChart));
    exports.DashChart = DashChart;
});
