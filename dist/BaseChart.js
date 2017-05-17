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
define(["require", "exports", "d3", "underscore", "Evented", "Measure", "Util"], function (require, exports, d3, _, Evented_1, Measure_1, Util) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseChart = (function (_super) {
        __extends(BaseChart, _super);
        function BaseChart(conf) {
            var _this = _super.call(this) || this;
            _this.isReady = false;
            _this.measures = [];
            _this.layers = [];
            _this.config = {
                width: "600px",
                height: "400px",
                position: "absolute"
            };
            _this.stringRectCache = Util.CacheAble(Util.getStringRect, function (s, cls, fontSize) { return s.toString().length + " " + cls + fontSize; });
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
            this.update();
            return this;
        };
        BaseChart.prototype.update = function () {
            d3.select(this.el).style("width", this.config.width)
                .style("height", this.config.height)
                .style("position", this.config.position);
            this.fire("chartUpdate", { width: this.config.width, height: this.config.height });
        };
        BaseChart.prototype.getContainer = function () {
            return this.el;
        };
        BaseChart.prototype.loadMeasures = function (measures) {
            var _this = this;
            _.each(measures, function (d) {
                var measure = new Measure_1.Measure(d.id, d.data);
                _this.addMeasure(measure);
            });
        };
        BaseChart.prototype.addMeasure = function (m) {
            var i = _.findIndex(this.measures, function (mm) { return mm.id == m.id; });
            if (i != -1) {
                this.measures[i] = m;
            }
            else {
                this.measures.push(m);
            }
            this.fire("measure-change");
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
        BaseChart.prototype.getStringRect = function (s, cls, fontSize) {
            var rect = this.stringRectCache(s, cls, fontSize);
            return { width: rect.width, height: rect.height };
        };
        BaseChart.prototype.getColorByIndex = function (i) {
            return d3.schemeCategory10[i];
        };
        BaseChart.prototype.render = function (ref) {
            this.update();
            _.invoke(this.layers, "render");
            var dom = d3.select(ref);
            if (!dom.empty()) {
                dom.node().appendChild(this.el);
            }
            return this;
        };
        return BaseChart;
    }(Evented_1.Evented));
    exports.BaseChart = BaseChart;
});
