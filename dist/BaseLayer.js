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
define(["require", "exports", "d3", "Evented"], function (require, exports, d3, Evented_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseLayer = (function (_super) {
        __extends(BaseLayer, _super);
        function BaseLayer() {
            return _super.call(this) || this;
        }
        BaseLayer.prototype.addTo = function (c) {
            this.chart = c;
            this.chart.addLayer(this);
            return this;
        };
        BaseLayer.prototype.setStyle = function (s) {
            this.style = s;
        };
        BaseLayer.prototype.updateStyle = function () {
            var el = d3.select(this.el).style("position", "relative");
            if (this.style) {
                el.style("left", this.style.left);
                el.style("right", this.style.right);
                el.style("bottom", this.style.bottom);
                el.style("top", this.style.top);
                el.style("width", this.style.width);
                el.style("height", this.style.height);
            }
        };
        BaseLayer.prototype.render = function () {
            if (this.el) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = this.renderer();
            this.updateStyle();
            d3.select(this.chart.getContainer()).node().appendChild(this.el);
            return this;
        };
        BaseLayer.prototype.renderer = function () {
        };
        return BaseLayer;
    }(Evented_1.Evented));
    exports.BaseLayer = BaseLayer;
});
