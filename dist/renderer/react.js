"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = _interopRequireDefault(require("."));

var _react = _interopRequireDefault(require("react"));

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ReactRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(ReactRenderer, _Renderer);

  function ReactRenderer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ReactRenderer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ReactRenderer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "renderDefault", function (token) {
      var props = {};
      Object.entries(token).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            attr = _ref2[0],
            val = _ref2[1];

        if (attr === "tag" || attr === "children" || val === undefined) return true;
        props[attr] = val;
      });
      return _react.default.createElement.apply(_react.default, [token.tag, props].concat(_toConsumableArray(_this.renderChildren(token))));
    });

    return _this;
  }

  return ReactRenderer;
}(_.default);

exports.default = ReactRenderer;

var hN = function hN(token, _ref3) {
  var renderChildren = _ref3.renderChildren;
  return _react.default.createElement.apply(_react.default, [token.tag, {
    id: (0, _helpers.gatherText)(token.children)
  }].concat(_toConsumableArray(renderChildren(token))));
};

ReactRenderer.builtin = {
  empty: function empty() {
    return "";
  },
  text: function text(token) {
    return token.text;
  },
  h1: hN,
  h2: hN,
  h3: hN,
  h4: hN,
  h5: hN,
  h6: hN,
  block_code: function block_code(token, _ref4) {
    var renderChildren = _ref4.renderChildren;
    return _react.default.createElement("pre", null, _react.default.createElement.apply(_react.default, ["code", {
      className: token.language ? "language-".concat(token.language) : ""
    }].concat(_toConsumableArray(renderChildren(token)))));
  }
};