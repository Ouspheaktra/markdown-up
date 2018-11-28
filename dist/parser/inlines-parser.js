"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InlineParser = exports.InlinesParser = void 0;

var _orderedObject = _interopRequireDefault(require("../ordered-object"));

var _common = _interopRequireDefault(require("./common"));

var _index = require("./index");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var builtin = new _orderedObject.default();
/**
 * USE TO TOKENIZE SRC INTO INLINE TOKENS
 */

var InlinesParser =
/*#__PURE__*/
function (_Parsers) {
  _inherits(InlinesParser, _Parsers);

  function InlinesParser() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, InlinesParser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(InlinesParser)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this._defaultParser = Text;
    return _this;
  }

  _createClass(InlinesParser, [{
    key: "_postParse",
    value: function _postParse(match, text, token) {
      var toInsert = [];

      if (token.tag !== "text" && token.text) {
        token.children = this._parsersIns.valueOf("default").parse([token.text]);
        delete token.text;
      } // prepare token


      if (token.children && token.children.constructor !== Array) token.children = [token.children]; // prepare what to insert into children

      var start = text.substr(0, match.index);
      var end = text.substr(match.index + match[0].length);
      if (start !== "") toInsert.push(start);
      toInsert.push(token);
      if (end !== "") toInsert.push(end);
      return toInsert;
    }
    /**
     * 
     * @param {string[]} tokens 
     */

  }, {
    key: "parse",
    value: function parse(tokens) {
      this._preParse();

      var toInsert, text, token;

      for (var i = 0; i < tokens.length; i++) {
        text = tokens[i]; // if it is Object
        // it means it's tokenized

        if (text.constructor === Object) {
          if (text.children) this.parse(text.children);
          continue;
        } // find parser


        var _this$findParser = this.findParser(text),
            parser = _this$findParser.parser,
            match = _this$findParser.match;

        token = parser.parse(match, text);
        toInsert = this._postParse(match, text, token); // insert parts into children

        tokens.splice.apply(tokens, [i, 1].concat(_toConsumableArray(toInsert))); // if first one is string
        // it means that string will be placed in current index
        // so substract one, otherwise that string won't be tokenized

        if (toInsert[0].constructor === String) i--; // tokenize children text

        if (token.tag !== "text" && token.children) this.parse(token.children);
      }

      return tokens;
    }
  }]);

  return InlinesParser;
}(_index.Parsers);

exports.InlinesParser = InlinesParser;
InlinesParser.builtin = builtin;
/**
 * INLINE TOKENIZER BUILDER
 * extend this class to construct a inline parser
 */

var InlineParser =
/*#__PURE__*/
function (_Parser) {
  _inherits(InlineParser, _Parser);

  function InlineParser() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, InlineParser);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(InlineParser)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _this2.text = function (text) {
      return _this2.mainParser._parsersIns.valueOf("default").parse([text]);
    };

    return _this2;
  }
  /**
   * Override this method to test
   * @param {string} text 
   * @return - anything is true, call parse() and put it as second param
   */


  _createClass(InlineParser, [{
    key: "test",
    value: function test(text) {
      try {
        return RegExp(this.constructor.regex).exec(text);
      } catch (e) {
        throw Error("something wrong with this regex: " + this.constructor.regex);
      }
    }
    /**
     * 
     * @param {string[]} test 
     * @param {*} match - what return from test()
     */

  }, {
    key: "parse",
    value: function parse(match, test) {
      throw new Error("override this method");
    }
  }]);

  return InlineParser;
}(_index.Parser); /// BUILTIN ///


exports.InlineParser = InlineParser;

var Text =
/*#__PURE__*/
function (_InlineParser) {
  _inherits(Text, _InlineParser);

  function Text() {
    var _getPrototypeOf4;

    var _this3;

    _classCallCheck(this, Text);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(Text)).call.apply(_getPrototypeOf4, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "test", function (text) {
      return {
        0: text,
        index: 0
      };
    });

    return _this3;
  }

  _createClass(Text, [{
    key: "parse",
    value: function parse(match) {
      var chars = (0, _helpers.removeDuplicate)(this.mainParser.specialChar).map(function (char) {
        return "\\".concat(char);
      }).join("");
      return {
        tag: 'text',
        text: match[0].replace(RegExp("\\\\([".concat(chars, "])")), '$1')
      };
    }
  }]);

  return Text;
}(InlineParser);

var Strong =
/*#__PURE__*/
function (_InlineParser2) {
  _inherits(Strong, _InlineParser2);

  function Strong() {
    _classCallCheck(this, Strong);

    return _possibleConstructorReturn(this, _getPrototypeOf(Strong).apply(this, arguments));
  }

  _createClass(Strong, [{
    key: "test",
    value: function test(text) {
      return this.constructor.regex.exec(text) || this.constructor.regex2.exec(text);
    }
  }, {
    key: "parse",
    value: function parse(match) {
      return {
        tag: 'strong',
        children: match[2]
      };
    }
  }]);

  return Strong;
}(InlineParser);

Strong.regex = /(?<!\*.*)(?<!\\)(\*)\1(.+?)\1\1(?!.*\1)/;
Strong.regex2 = /(?<!_)(?<!\\)(_)\1(.+?)\1\1(?!\1)/;
Strong.specialChar = ["*", "_"];
builtin.add("strong", Strong);

var Emphasize =
/*#__PURE__*/
function (_InlineParser3) {
  _inherits(Emphasize, _InlineParser3);

  function Emphasize() {
    _classCallCheck(this, Emphasize);

    return _possibleConstructorReturn(this, _getPrototypeOf(Emphasize).apply(this, arguments));
  }

  _createClass(Emphasize, [{
    key: "parse",
    value: function parse(match) {
      return {
        tag: 'em',
        children: match[2]
      };
    }
  }]);

  return Emphasize;
}(InlineParser);

Emphasize.regex = /(?<!\\)(\*|_)(.+?)\1/;
builtin.add("emphasize", Emphasize);

var NewLine =
/*#__PURE__*/
function (_InlineParser4) {
  _inherits(NewLine, _InlineParser4);

  function NewLine() {
    _classCallCheck(this, NewLine);

    return _possibleConstructorReturn(this, _getPrototypeOf(NewLine).apply(this, arguments));
  }

  _createClass(NewLine, [{
    key: "parse",
    value: function parse() {
      return {
        tag: 'br'
      };
    }
  }]);

  return NewLine;
}(InlineParser);

NewLine.regex = /^\n$/;
builtin.add("new_line", NewLine);

var StrikeThrough =
/*#__PURE__*/
function (_InlineParser5) {
  _inherits(StrikeThrough, _InlineParser5);

  function StrikeThrough() {
    _classCallCheck(this, StrikeThrough);

    return _possibleConstructorReturn(this, _getPrototypeOf(StrikeThrough).apply(this, arguments));
  }

  _createClass(StrikeThrough, [{
    key: "parse",
    value: function parse(match) {
      return {
        tag: 'del',
        children: match[1]
      };
    }
  }]);

  return StrikeThrough;
}(InlineParser);

StrikeThrough.regex = /(?<!\\)~~(.+?)~~/;
StrikeThrough.specialChar = "~";
builtin.add("strike_through", StrikeThrough);

var InlineCode =
/*#__PURE__*/
function (_InlineParser6) {
  _inherits(InlineCode, _InlineParser6);

  function InlineCode() {
    _classCallCheck(this, InlineCode);

    return _possibleConstructorReturn(this, _getPrototypeOf(InlineCode).apply(this, arguments));
  }

  _createClass(InlineCode, [{
    key: "parse",
    value: function parse(match) {
      return {
        tag: 'code',
        text: match[1]
      };
    }
  }]);

  return InlineCode;
}(InlineParser);

InlineCode.regex = /(?<!\\)`([^`\n]+?)`/;
InlineCode.specialChar = "`";
builtin.add("code", InlineCode);
/* LINK N IMAGE */

var Link =
/*#__PURE__*/
function (_InlineParser7) {
  _inherits(Link, _InlineParser7);

  function Link() {
    _classCallCheck(this, Link);

    return _possibleConstructorReturn(this, _getPrototypeOf(Link).apply(this, arguments));
  }

  _createClass(Link, [{
    key: "parse",
    value: function parse(match) {
      var _out;

      var out = (_out = {
        tag: this.constructor.tag
      }, _defineProperty(_out, this.constructor.href, match[2]), _defineProperty(_out, "title", match[3]), _out);
      if (this.constructor.tag === 'a') out.children = match[1];
      return out;
    }
  }]);

  return Link;
}(InlineParser);

Link.tag = 'a';
Link.href = 'href';
Link.regex = RegExp("(?<!\\\\)\\[(.+?)\\]\\(".concat(_common.default.link, "\\)"));
Link.specialChar = "[";

var Image =
/*#__PURE__*/
function (_Link) {
  _inherits(Image, _Link);

  function Image() {
    _classCallCheck(this, Image);

    return _possibleConstructorReturn(this, _getPrototypeOf(Image).apply(this, arguments));
  }

  return Image;
}(Link);

Image.tag = 'img';
Image.href = 'src';
Image.regex = RegExp("(?<!\\\\)!".concat((0, _helpers.regexToString)(Link.regex)));
Image.specialChar = "!";

var LinkRef =
/*#__PURE__*/
function (_InlineParser8) {
  _inherits(LinkRef, _InlineParser8);

  function LinkRef() {
    _classCallCheck(this, LinkRef);

    return _possibleConstructorReturn(this, _getPrototypeOf(LinkRef).apply(this, arguments));
  }

  _createClass(LinkRef, [{
    key: "parse",
    value: function parse(match) {
      var text = match[1];
      var refName = match[2] || text;

      if (this.data.ref[refName]) {
        var _out2;

        var data = this.data.ref[refName];
        if (text === refName) text = data.title;
        var out = (_out2 = {
          tag: this.constructor.tag,
          alt: text
        }, _defineProperty(_out2, this.constructor.href, data.href), _defineProperty(_out2, "title", data.title), _out2);
        if (this.constructor.tag === 'a') out.children = text;
        return out;
      }

      return this.text(match[0]);
    }
  }]);

  return LinkRef;
}(InlineParser);

LinkRef.tag = Link.tag;
LinkRef.href = Link.href;
LinkRef.regex = RegExp('(?<!\\\\)\\[(.+?)\\](?:\\[(.+?)\\])?');

var ImageRef =
/*#__PURE__*/
function (_LinkRef) {
  _inherits(ImageRef, _LinkRef);

  function ImageRef() {
    _classCallCheck(this, ImageRef);

    return _possibleConstructorReturn(this, _getPrototypeOf(ImageRef).apply(this, arguments));
  }

  return ImageRef;
}(LinkRef);

ImageRef.tag = Image.tag;
ImageRef.href = Image.href;
ImageRef.regex = RegExp("!".concat((0, _helpers.regexToString)(LinkRef.regex)));
builtin.add("image", Image);
builtin.add("link", Link);
builtin.add("image_ref", ImageRef);
builtin.add("link_ref", LinkRef);

var AutoLink =
/*#__PURE__*/
function (_InlineParser9) {
  _inherits(AutoLink, _InlineParser9);

  function AutoLink() {
    _classCallCheck(this, AutoLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(AutoLink).apply(this, arguments));
  }

  _createClass(AutoLink, [{
    key: "parse",
    value: function parse(match) {
      return {
        tag: 'a',
        href: match[1],
        text: match[1]
      };
    }
  }]);

  return AutoLink;
}(InlineParser);

AutoLink.regex = RegExp('\\b(https?:\\/{2}\\S+)\\b');

var SurroundedAutoLink =
/*#__PURE__*/
function (_AutoLink) {
  _inherits(SurroundedAutoLink, _AutoLink);

  function SurroundedAutoLink() {
    _classCallCheck(this, SurroundedAutoLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(SurroundedAutoLink).apply(this, arguments));
  }

  return SurroundedAutoLink;
}(AutoLink);

SurroundedAutoLink.regex = RegExp("(?<!\\\\)<".concat((0, _helpers.regexToString)(AutoLink.regex), ">"));
SurroundedAutoLink.specialChar = "<";
builtin.add("surrounded_auto_link", SurroundedAutoLink);
builtin.add("auto_link", AutoLink);