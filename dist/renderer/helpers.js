"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = exports.gatherText = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gatherText = function gatherText(children) {
  var text = "";

  if (children) {
    if (children.constructor !== Array) children = [children];
    children.forEach(function (child) {
      if (child.tag === "text") text += child.text;else text += gatherText(child.children);
    });
  }

  return text;
};

exports.gatherText = gatherText;

var createElement = function createElement(tag) {
  return function (token, _ref) {
    var renderChildren = _ref.renderChildren,
        data = _ref.data;

    var props = _objectSpread({}, token, {
      data: data
    });

    delete props.children;
    delete props.tag;
    return _react.default.createElement.apply(_react.default, [tag, props].concat(_toConsumableArray(renderChildren(token))));
  };
};

exports.createElement = createElement;