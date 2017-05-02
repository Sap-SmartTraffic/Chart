define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Evented = (function () {
        function Evented() {
            this.events = {};
        }
        Evented.prototype.on = function (t, fn, ctx) {
            var _this = this;
            var st = t.split(" ");
            st.forEach(function (t) {
                var obj = {};
                obj.fn = fn;
                obj.ctx = ctx;
                if (!_this.events[t]) {
                    _this.events[t] = [];
                }
                _this.events[t].push(obj);
            });
            return this;
        };
        Evented.prototype._off = function (t, fn, ctx) {
            if (!this.events[t]) {
                return this;
            }
            else {
                var nEs_1 = [];
                this.events[t].forEach(function (o) {
                    if (o.fn != fn && o.ctx != ctx) {
                        nEs_1.push(o);
                    }
                });
                this.events = nEs_1;
            }
            return this;
        };
        Evented.prototype.off = function (t, fn, ctx) {
            if (!this.events[t]) {
                return this;
            }
            else {
                var nEs_2 = [];
                this.events[t].forEach(function (o) {
                    if (o.fn != fn && o.ctx != ctx) {
                        nEs_2.push(o);
                    }
                });
                this.events = nEs_2;
            }
            return this;
        };
        Evented.prototype.fire = function (t, obj) {
            if (!this.events[t]) {
                return this;
            }
            else {
                this.events[t].forEach(function (o) { return o.fn.call(o.ctx, obj); });
                return this;
            }
        };
        return Evented;
    }());
    exports.Evented = Evented;
});
