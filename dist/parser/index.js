"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = exports.Parsers = void 0;

var _orderedObject = _interopRequireDefault(require("../ordered-object"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Parsers =
/*#__PURE__*/
function () {
  function Parsers() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var specialChar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Parsers);

    this.specialChar = specialChar;
    this.parsers = this.constructor.builtin.clone();
    this._defaultParser = Parser;
    this._emptyParser = Empty;
    this._parsersIns = new _orderedObject.default();
    this.data = data;
  }

  _createClass(Parsers, [{
    key: "_preParse",
    value: function _preParse() {
      if (JSON.stringify(["empty"].concat(_toConsumableArray(this.parsers.keys()), ["default"])) === JSON.stringify(this._parsersIns.keys())) return;
      this._parsersIns = new _orderedObject.default();

      var _arr = [["empty", this._emptyParser]].concat(_toConsumableArray(this.parsers.entries()), [["default", this._defaultParser]]);

      for (var _i = 0; _i < _arr.length; _i++) {
        var _arr$_i = _slicedToArray(_arr[_i], 2),
            key = _arr$_i[0],
            val = _arr$_i[1];

        this._parsersIns.add(key, new val(this));
      }
    }
  }, {
    key: "findParser",
    value: function findParser(lines) {
      var match, parser; // test each parser

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._parsersIns.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          parser = _step.value;
          // eslint-disable-next-line
          if (match = parser.test(lines)) break;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return {
        parser: parser,
        match: match
      };
    }
  }, {
    key: "parse",
    value: function parse(input) {
      throw Error("override this method");
    }
  }]);

  return Parsers;
}();

exports.Parsers = Parsers;

var Parser =
/*#__PURE__*/
function () {
  function Parser(mainParser) {
    _classCallCheck(this, Parser);

    this.mainParser = mainParser;
    this.data = mainParser.data;
    this.empty = mainParser._emptyParser.token;
    this.findParser = mainParser.findParser.bind(mainParser);
    var specialChar = this.constructor.specialChar;

    if (specialChar) {
      var _this$mainParser$spec;

      if (specialChar.constructor !== Array) specialChar = [specialChar];

      (_this$mainParser$spec = this.mainParser.specialChar).push.apply(_this$mainParser$spec, _toConsumableArray(specialChar));
    }
  }

  _createClass(Parser, [{
    key: "test",
    value: function test(input) {
      throw Error("override this method");
    }
  }, {
    key: "parse",
    value: function parse(input) {
      throw new Error("override this method");
    }
  }]);

  return Parser;
}();

exports.Parser = Parser;

var Empty =
/*#__PURE__*/
function (_Parser) {
  _inherits(Empty, _Parser);

  function Empty() {
    _classCallCheck(this, Empty);

    return _possibleConstructorReturn(this, _getPrototypeOf(Empty).apply(this, arguments));
  }

  _createClass(Empty, [{
    key: "test",
    value: function test(input) {
      return (input.constructor === Array ? input[0] : input) === "";
    }
  }, {
    key: "parse",
    value: function parse(lines) {
      lines.shift();
      return this.constructor.token;
    }
  }]);

  return Empty;
}(Parser);

Empty.token = {
  tag: 'empty'
};