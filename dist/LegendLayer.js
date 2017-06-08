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
define(["require", "exports", "d3", "underscore", "BaseLayer"], function (require, exports, d3, _, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LegendLayer = (function (_super) {
        __extends(LegendLayer, _super);
        function LegendLayer(id, conf) {
            var _this = _super.call(this) || this;
            _this.config = {
                height: "48px",
                className: "LegendLayer",
                margin: { top: "5px", right: "20px", bottom: "5px", left: "20px" },
                legendIcon: { width: "15px", height: "15px" },
                legendText: { height: "15px" },
                legendInnerMargin: "5px",
                legendOuterMargin: "10px"
            };
            _this.setConfig(conf);
            return _this;
        }
        /*
        calculateLegendWidth(ds:Measure[]) {
            let legendWidth = 0
            _.each(ds, (d,i)=> {
                legendWidth += this.calculayeLegendUnitWidth("标签"+d.id)
            })
            return legendWidth
        }
    
        calculayeLegendUnitWidth(legendText) {
            return Util.toPixel(this.config.legendIcon.width) + Util.toPixel(this.config.legendInnerMargin) + Util.getStringRect(legendText).width + Util.toPixel(this.config.legendOuterMargin)
        }
    
        calculateHeight(ds) {
            let availableWidth = Util.toPixel(this.layout.width) - Util.toPixel(this.config.margin.right) - Util.toPixel(this.config.margin.left)
            let legendWidth = this.calculateLegendWidth(ds)
            let legendRow = Math.ceil(legendWidth / availableWidth)
            this.config.height = legendRow * (Util.toPixel(this.config.legendIcon.height)) + Util.toPixel(this.config.margin.top) + Util.toPixel(this.config.margin.bottom) + "px"
        }
        */
        LegendLayer.prototype.init = function () {
        };
        LegendLayer.prototype.renderer = function () {
            var _this = this;
            var ds = this.chart.measures;
            var fragment = document.createDocumentFragment();
            var legend = d3.select(fragment).append("xhtml:div").attr("class", "legend-wrap");
            var legendGroup = legend.append("xhtml:div").attr("class", "legendGroup")
                .style("margin", this.config.margin.top + " " + this.config.margin.right + " " + this.config.margin.bottom + " " + this.config.margin.left)
                .style("display", "-webkit-flex")
                .style("flex-wrap", "wrap")
                .style("justify-content", "center");
            _.each(ds, function (d, i) {
                var legendUnit = legendGroup.append("xhtml:div").attr("class", "legendUnit" + i).style("display", "inline-block").style("opacity", "1");
                legendUnit.append("xhtml:span").style("width", _this.config.legendIcon.width)
                    .style("height", _this.config.legendIcon.height)
                    .style("display", "inline-block")
                    .style("background-color", _this.chart.getColor(i))
                    .style("margin-right", _this.config.legendInnerMargin)
                    .on("mouseenter", function () { _this.chart.fire("enterLegend", { series: d.id, index: i }); })
                    .on("mouseleave", function () { _this.chart.fire("leaveLegend", {}); })
                    .on("click", function () {
                    var item = legend.select(".legendUnit" + i);
                    if (item.style("opacity") == "1")
                        item.style("opacity", "0.3");
                    else
                        item.style("opacity", "1");
                    _this.chart.fire("clickLegend", { series: d.id, index: i, isShow: item.style("opacity") });
                });
                legendUnit.append("xhtml:p").style("line-height", _this.config.legendText.height).text(d.id).style("margin-right", _this.config.legendOuterMargin).style("display", "inline-block").style("vertical-align", "top");
            });
            return legend.node();
        };
        return LegendLayer;
    }(BaseLayer_1.BaseLayer));
    exports.LegendLayer = LegendLayer;
});
