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
            _this.isInit = false;
            _this.layout = {
                left: "0px", right: "", top: "0px", bottom: "", width: "300px", height: "300px", zIndex: 10
            };
            _this.id = id || _.uniqueId("layer");
            _this.setConfig(conf);
            return _this;
        }
        BaseLayer.prototype.addTo = function (c) {
            this.chart = c;
            this.chart.addLayer(this);
            //this.chart.on("calculateStyleDone",this.updateStyle.bind(this))
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
        BaseLayer.prototype.setLayout = function (s) {
            var _this = this;
            _.each(s, function (v, k) {
                _this.layout[k] = v;
            });
            // if(s.left!=undefined){
            //     this.layout.left=Util.toPixel(s.left,this.chart.style.width)
            // }
            // if(s.right!=undefined){
            //     this.layout.right=Util.toPixel(s.right,this.chart.style.width)
            // }
            // if(s.width!=undefined){
            //     this.layout.width=Util.toPixel(s.width,this.chart.style.width)
            // }
            // if(s.height!=undefined){
            //     this.layout.height=Util.toPixel(s.height,this.chart.style.height)
            // }
            // if(s.top!=undefined){
            //     this.layout.top=Util.toPixel(s.width,this.chart.style.height)
            // }
            // if(s.bottom!=undefined){
            //     this.layout.bottom=Util.toPixel(s.height,this.chart.style.height)
            // }
            this.update();
            return this;
        };
        BaseLayer.prototype.calculateLayout = function () {
            return this;
        };
        BaseLayer.prototype.updateLayout = function () {
            var el = d3.select(this.el).style("position", "absolute");
            if (this.layout) {
                _.each(this.layout, function (v, k) {
                    el.style(k, v);
                });
            }
        };
        BaseLayer.prototype.updateDom = function () { };
        BaseLayer.prototype.update = function () {
            if (this.el) {
                this.calculateLayout();
                this.updateLayout();
                this.updateDom();
            }
        };
        BaseLayer.prototype.render = function () {
            if (this.el) {
                d3.select(this.chart.getContainer()).node().appendChild(this.el);
            }
            else {
                this.calculateLayout();
                this.updateLayout();
                this.el = this.renderer();
                d3.select(this.chart.getContainer()).node().appendChild(this.el);
            }
            return this;
        };
        BaseLayer.prototype.renderer = function () { };
        return BaseLayer;
    }(Evented_1.Evented));
    exports.BaseLayer = BaseLayer;
});
