"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Renderer = function Renderer(data) {
  var _this = this;

  _classCallCheck(this, Renderer);

  _defineProperty(this, "renderDefault", function (token) {
    throw Error("override this method");
  });

  _defineProperty(this, "renderChildren", function (token) {
    if (token.children && token.children.length) return _this.render(token.children);
    return [];
  });

  _defineProperty(this, "render", function (tokens) {
    return tokens.map(function (token) {
      if (token.tag in _this.renderers) return _this.renderers[token.tag](_objectSpread({}, token), _this);else return _this.renderDefault(_objectSpread({}, token));
    });
  });

  this.renderers = _objectSpread({}, this.constructor.builtin);
  this.data = data;
};

exports.default = Renderer;