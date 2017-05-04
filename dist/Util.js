define(["require", "exports", "underscore"], function (require, exports, _) {
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
            if (key) {
                nums = nums.map(function (n) { return n[key]; });
            }
            nums.forEach(function (num) {
                n = isNaN(num) ? n : n > num ? n : num;
            });
            n = n == Number.MIN_VALUE ? 0 : n;
            return n;
        }
        Util.max = max;
        function min(ns, key) {
            var n = Number.MAX_VALUE;
            if (key) {
                ns = ns.map(function (n) { return n[key]; });
            }
            ns.forEach(function (num) {
                n = isNaN(num) ? n : n < num ? n : num;
            });
            n = n == Number.MAX_VALUE ? 0 : n;
            return n;
        }
        Util.min = min;
        Util.d3Invoke = curry(function (method, obj) {
            return function (d3Selection) {
                _.each(obj, function (v, k) {
                    d3Selection[method](k, v);
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
                    console.log("not cached", args);
                    return cache[_key.apply(null, args)] = fn.apply(null, args);
                }
            };
        }
        Util.CacheAble = CacheAble;
        function curry(f) {
            var arity = f.length;
            return function f1(r1, r2, r3) {
                var args = Array.prototype.slice.call(arguments, 0);
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
