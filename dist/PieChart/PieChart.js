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
define(["require", "exports", "Util", "BaseChart", "PieLayer"], function (require, exports, Util, BaseChart_1, PieLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PieChart = (function (_super) {
        __extends(PieChart, _super);
        function PieChart(conf) {
            var _this = _super.call(this, conf) || this;
            //this.mainTitle=new TitleLayer("title",{value:"hehe",className:"mainTitle",textAlign:"center"})
            _this.pieLayer = new PieLayer_1.PieLayer("pie", { className: "pieChart" });
            _this.addLayer(_this.pieLayer);
            _this.init();
            return _this;
        }
        PieChart.prototype.init = function () {
            var _this = this;
            this.on("chartUpdate", function () {
                ///calculate layout
                //this.mainTitle.setLayout({width:"100%", height:this.mainTitle.getTitleRect().height+"px"})
                _this.pieLayer.setLayout({ top: "0px", width: Util.toPixel(_this.config.width) + "px", height: (Util.toPixel(_this.config.height)) + "px" });
            });
            this.on("measure-change", function () {
                _this.pieLayer.updateDom();
            });
        };
        return PieChart;
    }(BaseChart_1.BaseChart));
    exports.PieChart = PieChart;
});
