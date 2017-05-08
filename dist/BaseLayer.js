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
define(["require", "exports", "d3", "underscore", "Evented"], function (require, exports, d3, _, Evented_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseLayer = (function (_super) {
        __extends(BaseLayer, _super);
        function BaseLayer(id, conf) {
            var _this = _super.call(this) || this;
            _this.id = id || _.uniqueId("layer");
            _this.setConfig(conf);
            return _this;
        }
        BaseLayer.prototype.addTo = function (c) {
            this.chart = c;
            this.chart.addLayer(this);
            this.chart.on("calculateStyleDone", this.updateStyle.bind(this));
            return this;
        };
        BaseLayer.prototype.setConfig = function (c) {
            var _this = this;
            if (!this.config) {
                this.config = {};
            }
            _.each(c, function (v, k) {
                _this.config[k] = v;
            });
        };
        BaseLayer.prototype.setStyle = function (s) {
            this.style = s;
            return this;
        };
        BaseLayer.prototype.updateStyle = function () {
            var el = d3.select(this.el).style("position", "absolute");
            if (this.style) {
                _.each(this.style, function (v, k) {
                    el.style(k, v);
                });
            }
        };
        BaseLayer.prototype.render = function () {
            if (this.el) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = this.renderer();
            d3.select(this.chart.getContainer()).node().appendChild(this.el);
            return this;
        };
        BaseLayer.prototype.renderer = function () {
        };
        return BaseLayer;
    }(Evented_1.Evented));
    exports.BaseLayer = BaseLayer;
});
