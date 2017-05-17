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
define(["require", "exports", "BaseChart", "./LineLayer", "Util"], function (require, exports, BaseChart_1, LineLayer_1, Util) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineChart = (function (_super) {
        __extends(LineChart, _super);
        function LineChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.config = {
                width: "600px",
                height: "400px",
                position: "absolute",
                showLegend: false,
                showPredict: false,
                yLabel: ""
            };
            _this.setConfig(conf);
            // this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle"})
            _this.lineLayer = new LineLayer_1.LineLayer();
            // this.addLayer(this.mainTitle)
            _this.addLayer(_this.lineLayer);
            _this.init();
            return _this;
        }
        LineChart.prototype.init = function () {
            var _this = this;
            this.on("chartUpdate", function () {
                ///calculate layout
                //  this.mainTitle.setLayout({width:"100%",height:this.mainTitle.getTitleRect().height+"px"})
                _this.lineLayer.setLayout({ top: "0px",
                    width: _this.config.width,
                    height: Util.toPixel(_this.config.height) + "px" });
            });
            this.on("measure-change", function () {
                _this.lineLayer.updateDom();
            });
        };
        LineChart.prototype.showLegend = function () {
        };
        return LineChart;
    }(BaseChart_1.BaseChart));
    exports.LineChart = LineChart;
});
