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
        function TitleLayer(conf) {
            return _super.call(this, conf) || this;
        }
        TitleLayer.prototype.init = function () {
        };
        TitleLayer.prototype.renderer = function () {
            var conf = this.chart.config;
            var fragment = document.createDocumentFragment();
            return d3.select(fragment).append("xhtml:p").text(this.config.value).classed(this.config.className, true).node();
        };
        return TitleLayer;
    }(BaseLayer_1.BaseLayer));
    exports.TitleLayer = TitleLayer;
});
