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
define(["require", "exports", "Evented"], function (require, exports, Evented_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Measure = (function (_super) {
        __extends(Measure, _super);
        function Measure(id, data, type, style) {
            var _this = _super.call(this) || this;
            _this.id = id || 0;
            _this.data = data || [];
            _this.type = type || "line";
            _this.style = style || {};
            return _this;
        }
        return Measure;
    }(Evented_1.Evented));
    exports.Measure = Measure;
});
