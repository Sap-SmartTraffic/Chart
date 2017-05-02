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
define(["require", "exports", "d3", "BaseLayer"], function (require, exports, d3, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TitleLayer = (function (_super) {
        __extends(TitleLayer, _super);
        function TitleLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TitleLayer.prototype.renderer = function () {
            var conf = this.chart.config;
            var fragment = document.createDocumentFragment();
            return d3.select(fragment).append("xhtml:p").text("haha").node();
        };
        return TitleLayer;
    }(BaseLayer_1.BaseLayer));
    exports.TitleLayer = TitleLayer;
});
