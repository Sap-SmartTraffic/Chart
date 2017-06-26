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
define("Core/Measure", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    var Measure = (function () {
        function Measure(id, data, type, style) {
            this.id = id == undefined ? _.uniqueId("measure") : id;
            this.data = data || [];
            this.type = type || "line";
            this.style = style || {};
        }
        return Measure;
    }());
    exports.Measure = Measure;
});
define("Core/Evented", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    var Evented = (function () {
        function Evented() {
            this.events = {};
        }
        Evented.prototype.on = function (t, fn, ctx) {
            var _this = this;
            var st = t.split(" ");
            st.forEach(function (tt) {
                _this._on(tt, fn, ctx);
            });
            return this;
        };
        Evented.prototype._on = function (t, fn, ctx) {
            if (this.events[t]) {
                if (_.some(this.events[t], function (e) { return e.fn == fn && e.ctx == ctx; })) {
                    return;
                }
                else {
                    var obj = {};
                    obj.fn = fn;
                    obj.ctx = ctx;
                    this.events[t].push(obj);
                }
            }
            else {
                this.events[t] = [];
                var obj = {};
                obj.fn = fn;
                obj.ctx = ctx;
                this.events[t].push(obj);
            }
        };
        Evented.prototype._off = function (t, fn, ctx) {
            if (!this.events[t]) {
                return this;
            }
            else {
                var nEs_1 = [];
                if (fn) {
                    this.events[t].forEach(function (o) {
                        if (o.fn != fn && o.ctx != ctx) {
                            nEs_1.push(o);
                        }
                    });
                }
                this.events[t] = nEs_1;
            }
        };
        Evented.prototype.off = function (t, fn) {
            var _this = this;
            var st = t.split(" ");
            st.forEach(function (s) { return _this._off(s, fn); });
            return this;
        };
        Evented.prototype.fire = function (t, obj) {
            if (this.events[t]) {
                this.events[t].forEach(function (o) { return o.fn.call(o.ctx, obj); });
            }
            var p = this.parent;
            if (p) {
                p.fire(t, obj);
            }
            if (t != "*") {
                this.fire("*", obj);
            }
            return this;
        };
        Evented.prototype.listen = function (o, estr, fn) {
            o.on(estr, fn);
            return this;
        };
        Evented.prototype.listenTo = function (e) {
            e.parent = this;
            return this;
        };
        Evented.prototype.clear = function () {
            this.events = {};
            this.parent = null;
        };
        return Evented;
    }());
    exports.Evented = Evented;
});
define("Core/Util", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    var Util;
    (function (Util) {
        function isEndWith(s, ed) {
            var ss = s.toString();
            var matcher = new RegExp(ed + "$");
            return matcher.test(ss);
        }
        Util.isEndWith = isEndWith;
        function toPixel(s, ctx) {
            if (_.isNumber(s)) {
                return s;
            }
            if (isEndWith(s, "px")) {
                return parseFloat(s);
            }
            if (isEndWith(s, "rem")) {
                var font = window.getComputedStyle(document.body).getPropertyValue('font-size') || "16px";
                return parseFloat(s) * parseFloat(font);
            }
            if (isEndWith(s, "%")) {
                return parseFloat(s) * toPixel(ctx) / 100;
            }
            return 0;
        }
        Util.toPixel = toPixel;
        function isBeginWith(s, bs) {
            var ss = s.toString();
            var matcher = new RegExp("^" + bs);
            return matcher.test(ss);
        }
        Util.isBeginWith = isBeginWith;
        function isContaint(s, ss) {
            var matcher = new RegExp(ss);
            return matcher.test(s.toString());
        }
        Util.isContaint = isContaint;
        function max(nums, key) {
            var n = Number.MIN_VALUE;
            if (key && nums) {
                nums = nums.map(function (n) { return n[key]; });
            }
            if (nums) {
                nums.forEach(function (num) {
                    n = isNaN(num) ? n : n > num ? n : num;
                });
            }
            n = n == Number.MIN_VALUE ? 0 : n;
            return n;
        }
        Util.max = max;
        function min(ns, key) {
            var n = Number.MAX_VALUE;
            if (key && ns) {
                ns = ns.map(function (n) { return n[key]; });
            }
            if (ns) {
                ns.forEach(function (num) {
                    n = isNaN(num) ? n : n < num ? n : num;
                });
            }
            n = n == Number.MAX_VALUE ? 0 : n;
            return n;
        }
        Util.min = min;
        Util.d3Invoke = curry(function (method, obj) {
            return function (d3Selection) {
                _.each(obj, function (v, k) {
                    if (v != undefined) {
                        d3Selection[method](k, v);
                    }
                });
                return d3Selection;
            };
        });
        // var stringCache={cla:null,font_size:0,length:0,r:{width:0,height:0}} 
        function getStringRect(str, cla, font_size) {
            var d = window.document.createElement("div");
            var p = window.document.createElement("span");
            var r = { width: 0, height: 0 };
            d.style.transform = "translate3d(0, 0, 0)";
            d.style.visibility = "hidden";
            d.className = "getStringRect";
            p.innerHTML = str;
            if (cla) {
                p.className = cla;
            }
            if (font_size) {
                p.style["font-size"] = font_size + "px";
            }
            if (!str) {
                return r;
            }
            p.style.display = "inline-block";
            d.appendChild(p);
            window.document.body.appendChild(d);
            var rec = p.getBoundingClientRect();
            r.width = rec.width;
            r.height = rec.height;
            d.remove();
            return r;
        }
        Util.getStringRect = getStringRect;
        function CacheAble(fn, keyFn) {
            var _key = function () {
                return arguments2Array(arguments).join("-");
            };
            var cache = {};
            _key = keyFn ? keyFn : _key;
            return function () {
                var args = arguments2Array(arguments);
                if (cache[_key.apply(null, args)]) {
                    return cache[_key.apply(null, args)];
                }
                else {
                    return cache[_key.apply(null, args)] = fn.apply(null, args);
                }
            };
        }
        Util.CacheAble = CacheAble;
        function curry(f) {
            var arity = f.length;
            return function f1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (args.length < arity) {
                    var f2 = function () {
                        var args2 = Array.prototype.slice.call(arguments, 0); // parameters of returned curry func
                        return f1.apply(null, args.concat(args2)); // compose the parameters for origin func f
                    };
                    return f2;
                }
                else {
                    return f.apply(null, args); //all parameters are provided call the origin function
                }
            };
        }
        Util.curry = curry;
        function arguments2Array(args) {
            var r = [];
            for (var i = 0; i < args.length; ++i) {
                r.push(args[i]);
            }
            return r;
        }
        function deepExtend(des) {
            var _this = this;
            var source = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                source[_i - 1] = arguments[_i];
            }
            if (des == undefined || des == null) {
                des = {};
            }
            _.each(source, function (s) {
                if (_.isArray(s)) {
                    var args = [des].concat(s);
                    deepExtend.apply(_this, args);
                }
                else {
                    _.each(s, function (v, k) {
                        if (_.isObject(v)) {
                            if (_.isUndefined(des[k])) {
                                des[k] = {};
                            }
                            deepExtend(des[k], v);
                        }
                        else {
                            des[k] = v;
                        }
                    });
                }
            });
            return des;
        }
        Util.deepExtend = deepExtend;
        function enableAutoResize(dom, fn) {
            function getComputedStyle(element, prop) {
                if (element.currentStyle) {
                    return element.currentStyle[prop];
                }
                if (window.getComputedStyle) {
                    return window.getComputedStyle(element, null).getPropertyValue(prop);
                }
                return element.style[prop];
            }
            if (getComputedStyle(dom, 'position') == 'static') {
                dom.style.position = 'relative';
            }
            for (var i = 0; i < dom.childNodes.length; ++i) {
                if (dom.childNodes[i].className == "autoResier") {
                    dom.removeChild(dom.childNodes[i]);
                }
            }
            var oldWidth = dom.offsetWidth, oldHeight = dom.offsetHeight, refId = 0;
            var d1 = window.document.createElement("div");
            var d2 = window.document.createElement("div");
            var d3 = window.document.createElement("div");
            d1.className = "autoResier";
            d1.setAttribute("style", " position: absolute; left: 0; top: 0; right: 0; overflow:hidden; visibility: hidden; bottom: 0; z-index: -1");
            d2.setAttribute("style", "position: absolute; left: 0; top: 0; right: 0; overflow:scroll; bottom: 0; z-index: -1");
            d3.setAttribute("style", "position: absolute; left: 0; top: 0; transition: 0s ;height: 100000px;width:100000px");
            d2.appendChild(d3);
            d1.appendChild(d2);
            dom.appendChild(d1);
            d2.scrollLeft = 100000;
            d2.scrollTop = 100000;
            d2.onscroll = function (e) {
                d2.scrollLeft = 100000;
                d2.scrollTop = 100000;
                if ((dom.offsetHeight != oldHeight || dom.offsetWidth != oldWidth) && refId === 0) {
                    refId = requestAnimationFrame(onresize);
                }
            };
            function onresize() {
                refId = 0;
                if (fn) {
                    fn({ oldHeight: oldHeight, oldWidth: oldWidth, height: dom.offsetHeight, width: dom.offsetWidth });
                }
                oldWidth = dom.offsetWidth, oldHeight = dom.offsetHeight;
            }
        }
        Util.enableAutoResize = enableAutoResize;
    })(Util || (Util = {}));
    return Util;
});
define("Core/View", ["require", "exports", "d3", "Core/Evented", "Core/Util"], function (require, exports, d3, Evented_1, Util) {
    "use strict";
    exports.__esModule = true;
    var styles = Util.d3Invoke("style");
    var attrs = Util.d3Invoke("attr");
    var View = (function (_super) {
        __extends(View, _super);
        function View() {
            var confs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                confs[_i] = arguments[_i];
            }
            var _this = _super.call(this) || this;
            _this.config = Util.deepExtend(_this.defaultConfig(), confs);
            _this.initView();
            return _this;
        }
        View.prototype.defaultConfig = function () {
            return { tagName: "div", className: "view", style: null };
        };
        View.prototype.initView = function () {
            if (this.config.tagName == "svg") {
                this.el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            }
            else {
                this.el = document.createElementNS("http://www.w3.org/1999/xhtml", this.config.tagName);
            }
            this.elD3 = d3.select(this.el);
            this.elD3.classed(this.config.className, true);
            this.style(this.config.style);
            return this;
        };
        View.prototype.appendTo = function (dom) {
            dom.node().appendChild(this.el);
            return this;
        };
        View.prototype.style = function (s) {
            this.elD3.call(styles(s));
            return this;
        };
        View.prototype.attr = function (a) {
            this.elD3.call(attrs(a));
            return this;
        };
        View.prototype.render = function (ctx) {
            return this;
        };
        View.prototype.addClass = function (c) {
            this.elD3.classed(c, true);
            return this;
        };
        View.prototype.removeClass = function (c) {
            this.elD3.classed(c, false);
            return this;
        };
        return View;
    }(Evented_1.Evented));
    exports.View = View;
});
define("Core/BaseLayer", ["require", "exports", "underscore", "Core/Util", "Core/View"], function (require, exports, _, Util, View_1) {
    "use strict";
    exports.__esModule = true;
    var BaseLayer = (function (_super) {
        __extends(BaseLayer, _super);
        function BaseLayer(id) {
            var confs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                confs[_i - 1] = arguments[_i];
            }
            var _this = _super.call(this, confs) || this;
            _this.rendered = false;
            _this.id = id == undefined ? _.uniqueId("layer") : id;
            return _this;
        }
        BaseLayer.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "layer",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    "z-index": 0,
                    width: "300px",
                    height: "300px"
                }
            };
        };
        BaseLayer.prototype.setConfig = function (c) {
            this.config = Util.deepExtend(this.config, c);
            this.style(this.config.style);
            return this;
        };
        BaseLayer.prototype.addTo = function (c) {
            this.chart = c;
            this.chart.addLayer(this);
            return this;
        };
        BaseLayer.prototype.render = function () {
            this.el.innerHTML = "";
            return this;
        };
        BaseLayer.prototype.renderAt = function (dom) {
            dom.appendChild(this.el);
            this.render();
        };
        BaseLayer.prototype.clear = function () {
            this.el.remove();
            this.el = null;
            _super.prototype.clear.call(this);
        };
        return BaseLayer;
    }(View_1.View));
    exports.BaseLayer = BaseLayer;
});
define("Core/BaseChart", ["require", "exports", "d3", "underscore", "Core/Evented", "Core/Measure", "Core/Util", "Core/View"], function (require, exports, d3, _, Evented_2, Measure_1, Util, View_2) {
    "use strict";
    exports.__esModule = true;
    var BaseChart = (function (_super) {
        __extends(BaseChart, _super);
        function BaseChart() {
            var conf = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                conf[_i] = arguments[_i];
            }
            var _this = _super.call(this) || this;
            _this.measures = [];
            _this.layers = [];
            _this.stringRectCache = Util.CacheAble(Util.getStringRect, function (s, cls, fontSize) { return s.toString().length + " " + cls + fontSize; });
            _this.config = Util.deepExtend(_this.defaultConfig(), conf);
            _this.rootView = new View_2.View({ tagName: "div", className: _this.config.className });
            _this.rootView.style(_this.config.style);
            return _this;
        }
        BaseChart.prototype.addClass = function (c) {
            this.rootView.addClass(c);
            this.fire("classchange");
            return this;
        };
        BaseChart.prototype.removeClass = function (c) {
            this.rootView.removeClass(c);
            this.fire("classchange");
            return this;
        };
        BaseChart.prototype.defaultConfig = function () {
            return {
                style: {
                    width: "300px",
                    height: "300px"
                },
                className: "chart"
            };
        };
        BaseChart.prototype.renderAt = function (dom) {
            if (_.isString(dom)) {
                var n = d3.select(dom).node();
                n.appendChild(this.rootView.el);
            }
            else {
                dom.appendChild(this.rootView.el);
            }
            this.render();
        };
        BaseChart.prototype.redraw = function () {
            var _this = this;
            setTimeout(function () {
                _this.layers.forEach(function (l) {
                    l.render();
                });
            });
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
            this.fire("measure_change");
        };
        BaseChart.prototype.getMeasure = function (t) {
            if (t != undefined) {
                return _.filter(this.measures, function (m) { return m.type == t; });
            }
            else {
                return this.measures;
            }
        };
        BaseChart.prototype.addLayer = function (l) {
            var i = _.findIndex(this.layers, function (ll) { return ll.id == l.id; });
            if (i != -1) {
                this._clearLayer(this.layers[i]);
                this.layers[i] = l;
            }
            else {
                this.layers.push(l);
                l.chart = this;
                l.renderAt(this.rootView.el);
            }
            this.fire("layer_change");
            l.chart = this;
            return this;
        };
        BaseChart.prototype.getFirstMeasure = function (type) {
            var rs = _.filter(this.measures, function (m) { return m.type == type; });
            return rs.length > 0 ? rs[0] : undefined;
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
            this.fire("layer_change");
            return this;
        };
        BaseChart.prototype._clearLayer = function (l) {
            l.clear();
            return this;
        };
        BaseChart.prototype.getStringRect = function (s, cls, fontSize) {
            var rect = this.stringRectCache(s, cls, fontSize);
            return { width: rect.width, height: rect.height };
        };
        BaseChart.prototype.getColor = function (color) {
            if (color === undefined)
                return d3.schemeCategory20[Math.round(Math.random() * 20)];
            else if (typeof (color) == "number")
                return d3.schemeCategory20[color];
            else
                return color;
        };
        BaseChart.prototype.render = function () {
            this.redraw();
        };
        return BaseChart;
    }(Evented_2.Evented));
    exports.BaseChart = BaseChart;
});
define("Layer/TitleLayer", ["require", "exports", "Core/BaseLayer"], function (require, exports, BaseLayer_1) {
    "use strict";
    exports.__esModule = true;
    var TitleLayer = (function (_super) {
        __extends(TitleLayer, _super);
        function TitleLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TitleLayer.prototype.defaultConfig = function () {
            return {
                tagName: "div",
                className: "title",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    "z-index": 0,
                    width: "20rem",
                    height: "20rem"
                },
                value: ""
            };
        };
        TitleLayer.prototype.setTitle = function (t) {
            this.config.value = t;
            this.render();
        };
        TitleLayer.prototype.render = function () {
            var t = this.config.value;
            var node = this.elD3.select("p");
            if (node.empty()) {
                node = this.elD3.append("p");
            }
            node.text(t);
            return this;
        };
        return TitleLayer;
    }(BaseLayer_1.BaseLayer));
    exports.TitleLayer = TitleLayer;
});
define("Layer/RangeLayer", ["require", "exports", "d3", "Core/Util", "Core/BaseLayer"], function (require, exports, d3, Util, BaseLayer_2) {
    "use strict";
    exports.__esModule = true;
    var RangeLayer = (function (_super) {
        __extends(RangeLayer, _super);
        function RangeLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RangeLayer.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "rangeChart",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    "z-index": 0,
                    width: "200rem",
                    height: "100rem"
                },
                padding: {
                    top: "10px",
                    right: "10px",
                    bottom: "20px",
                    left: "40px"
                }
            };
        };
        RangeLayer.prototype.drawer = function (svgNode) {
            var ds = this.chart.getFirstMeasure("range");
            if (!ds) {
                return;
            }
            var maxY = Util.max(ds.data, "max"), minY = Util.min(ds.data, "min");
            var width = Util.toPixel(this.config.style.width) - Util.toPixel(this.config.padding.left) - Util.toPixel(this.config.padding.right);
            var height = Util.toPixel(this.config.style.height) - Util.toPixel(this.config.padding.top) - Util.toPixel(this.config.padding.bottom);
            var xScale = d3.scaleTime()
                .domain([+d3.min(ds.data, function (d) { return d.time; }), +d3.max(ds.data, function (d) { return d.time; })])
                .range([Util.toPixel(this.config.padding.left), width]);
            var yScale = d3.scaleLinear()
                .domain([0, maxY])
                .range([height, Util.toPixel(this.config.padding.top)]);
            var xAxis = d3.axisBottom(xScale).ticks(24).tickFormat(d3.timeFormat("%H:%M")), yAxis = d3.axisLeft(yScale);
            svgNode.append("g").attr("class", "axis xAxis")
                .attr("transform", "translate(0," + (height + Util.toPixel(this.config.padding.top)) + ")")
                .call(xAxis);
            svgNode.append("g").attr("class", "axis yAxis")
                .attr("transform", "translate(" + Util.toPixel(this.config.padding.left) + "," + Util.toPixel(this.config.padding.top) + ")")
                .call(yAxis);
            var gradientColor = svgNode.append("defs").append("linearGradient").attr("id", "linearColor")
                .attr("x1", "0%").attr("y1", "0%")
                .attr("x2", "0%").attr("y2", "100%");
            gradientColor.append("stop").attr("offset", "0%").attr("style", "stop-color:steelblue;stop-opacity:1");
            gradientColor.append("stop").attr("offset", "100%").attr("style", "stop-color:aqua;stop-opacity:1");
            var area = d3.area()
                .x(function (d) { return xScale(d.time); })
                .y0(function (d) { return yScale(d.min); })
                .y1(function (d) { return yScale(d.max); });
            svgNode.append("g").attr("class", "areaGroup").append("path")
                .attr("class", "area").attr("d", area(ds.data)).attr("fill", "url(#linearColor)");
            svgNode.append("line").attr("class", "focusLine")
                .attr("x1", xScale(d3.timeParse("%H")("12")))
                .attr("y1", height + Util.toPixel(this.config.padding.top))
                .attr("x2", xScale(d3.timeParse("%H")("12")))
                .attr("y2", Util.toPixel(this.config.padding.top));
            this.chart.on("dragLine", function (d) {
                svgNode.select(".focusLine").attr("x1", xScale(d.time)).attr("x2", xScale(d.time));
            });
        };
        // setFocusLine(time) {
        //     d3.select(".focusLine").attr("x1",xScale(time)).attr("x2",xScale(time))
        // }
        RangeLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return RangeLayer;
    }(BaseLayer_2.BaseLayer));
    exports.RangeLayer = RangeLayer;
});
define("Layer/FocusPanel", ["require", "exports", "d3", "Core/Util", "Core/BaseLayer"], function (require, exports, d3, Util, BaseLayer_3) {
    "use strict";
    exports.__esModule = true;
    var FocusPanel = (function (_super) {
        __extends(FocusPanel, _super);
        function FocusPanel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FocusPanel.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "focusPanel",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: "null",
                    right: "null",
                    position: "absolute",
                    "z-index": 0,
                    width: "50rem",
                    height: "10rem"
                },
                rangeMin: "6",
                rangeMax: "18",
                focusTime: "12",
                padding: 20
            };
        };
        FocusPanel.prototype.drawer = function (svgNode) {
            var gradientColor = svgNode.append("defs").append("radialGradient").attr("id", "radialColor")
                .attr("cx", "50%").attr("cy", "50%")
                .attr("r", "50%")
                .attr("fx", "50%").attr("fy", "50%");
            gradientColor.append("stop").attr("offset", "0%").attr("style", "stop-color:aqua;stop-opacity:1");
            gradientColor.append("stop").attr("offset", "100%").attr("style", "stop-color:steelblue;stop-opacity:1");
            svgNode.append("rect").attr("class", "panel")
                .attr("x", this.config.padding)
                .attr("y", this.config.padding)
                .attr("width", Util.toPixel(this.config.style.width) - this.config.padding * 2)
                .attr("height", Util.toPixel(this.config.style.height) - this.config.padding * 2)
                .attr("fill", "url(#radialColor)");
            var parseTime = d3.timeParse("%H");
            var xScale = d3.scaleTime()
                .domain([parseTime(this.config.rangeMin), parseTime(this.config.rangeMax)])
                .range([this.config.padding, Util.toPixel(this.config.style.width) - this.config.padding]);
            var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M"));
            svgNode.append("g").attr("class", "axis xAxis")
                .attr("transform", "translate(0," + (Util.toPixel(this.config.style.height) - this.config.padding) + ")")
                .call(xAxis);
            var focusTime = parseTime(this.config.focusTime);
            var self = this;
            var drag = d3.drag()
                .on("start", function () {
                svgNode.style("cursor", "col-resize");
            })
                .on("drag", function () {
                if (xScale.invert(d3.event.x) >= parseTime(self.config.rangeMin) && xScale.invert(d3.event.x) <= parseTime(self.config.rangeMax)) {
                    d3.select(this).attr("x1", d3.event.x).attr("x2", d3.event.x);
                    self.chart.fire("dragLine", { time: xScale.invert(d3.event.x) });
                }
            })
                .on("end", function () {
                svgNode.style("cursor", "default");
            });
            svgNode.append("line").attr("class", "focusLine")
                .attr("x1", xScale(focusTime)).attr("y1", Util.toPixel(this.config.style.height) - this.config.padding)
                .attr("x2", xScale(focusTime)).attr("y2", this.config.padding)
                .on("mouseenter", function () {
                svgNode.style("cursor", "col-resize");
            })
                .on("mouseleave", function () {
                svgNode.style("cursor", "default");
            })
                .call(drag);
        };
        FocusPanel.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return FocusPanel;
    }(BaseLayer_3.BaseLayer));
    exports.FocusPanel = FocusPanel;
});
define("Chart/RangeChart/RangeChart", ["require", "exports", "Core/Measure", "d3", "underscore", "Core/BaseChart", "Layer/RangeLayer", "Layer/FocusPanel"], function (require, exports, Measure_2, d3, _, BaseChart_1, RangeLayer_1, FocusPanel_1) {
    "use strict";
    exports.__esModule = true;
    var RangeChart = (function (_super) {
        __extends(RangeChart, _super);
        function RangeChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.rangeLayer = new RangeLayer_1.RangeLayer("rangechart", {
                style: {
                    top: "40px",
                    width: _this.config.style.width,
                    height: _this.config.style.height
                }
            });
            _this.focusPanel = new FocusPanel_1.FocusPanel("focuspanel", {
                style: {
                    top: "300px",
                    left: "30px"
                }
            });
            _this.on("measure_change", _this.rangeLayer.render, _this.rangeLayer);
            _this.addLayer(_this.rangeLayer);
            _this.addLayer(_this.focusPanel);
            return _this;
        }
        RangeChart.prototype.data = function (data) {
            var parseTime = d3.timeParse("%H");
            _.each(data, function (d, i) {
                d.time = parseTime(d.time);
            });
            var m = new Measure_2.Measure("0", data, "range");
            this.addMeasure(m);
            return this;
        };
        return RangeChart;
    }(BaseChart_1.BaseChart));
    exports.RangeChart = RangeChart;
});
