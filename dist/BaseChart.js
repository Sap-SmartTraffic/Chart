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
    var BaseChart = (function (_super) {
        __extends(BaseChart, _super);
        function BaseChart(conf) {
            var _this = _super.call(this) || this;
            _this.config = {
                width: "300px",
                height: "300px"
            };
            _this.isReady = false;
            _this.measures = [];
            _this.layers = [];
            if (!_this.el) {
                _this.el = d3.select(document.createDocumentFragment()).append("xhtml:div").node();
            }
            _this.setConfig(conf);
            return _this;
        }
        BaseChart.prototype.setConfig = function (c) {
            var _this = this;
            _.each(c, function (v, k) {
                _this.config[k] = v;
            });
        };
        BaseChart.prototype.addLayer = function (l) {
            var i = _.findIndex(this.layers, function (ll) { return ll.id == l.id; });
            if (i != -1) {
                this._clearLayer(this.layers[i]);
                this.layers[i] = l;
            }
            else {
                this.layers.push(l);
            }
            if (this.isReady) {
                l.render();
            }
            l.chart = this;
            return this;
        };
        BaseChart.prototype.getContainer = function () {
            return this.el;
        };
        BaseChart.prototype.removeLayer = function (id) {
            if (_.isObject(id)) {
                var i = _.findIndex(this.layers, function (ll) { return ll.id == id.id; });
                if (i != -1) {
                    this._clearLayer(this.layers[i]);
                    this.layers = _.filter(this.layers, function (ll) { return ll.id != id.id; });
                }
            }
            else {
                var i = _.findIndex(this.layers, function (ll) { return ll.id == id; });
                if (i != -1) {
                    this._clearLayer(this.layers[i]);
                    this.layers = _.filter(this.layers, function (ll) { return ll.id != id; });
                }
            }
            return this;
        };
        BaseChart.prototype._clearLayer = function (l) {
            return this;
        };
        BaseChart.prototype.updateStyle = function () {
            d3.select(this.el).style("height", this.config.height)
                .style("width", this.config.width);
        };
        BaseChart.prototype.render = function (ref) {
            _.invoke(this.layers, "render");
            var dom = d3.select(ref);
            if (!dom.empty()) {
                dom.node().appendChild(this.el);
            }
            this.updateStyle();
            return this;
        };
        return BaseChart;
    }(Evented_1.Evented));
    exports.BaseChart = BaseChart;
});
