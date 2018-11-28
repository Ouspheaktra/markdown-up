"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockParser = exports.BlocksParser = void 0;

var _orderedObject = _interopRequireDefault(require("../ordered-object"));

var _common = _interopRequireDefault(require("./common"));

var _index = require("./index");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
 * USE TO TOKENIZE SRC INTO BLOCK TOKENS
 */

var BlocksParser =
/*#__PURE__*/
function (_Parsers) {
  _inherits(BlocksParser, _Parsers);

  function BlocksParser() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BlocksParser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BlocksParser)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this._defaultParser = Paragraph;
    return _this;
  }
  /**
   * Prepare Each Token and Tokenize children
   */


  _createClass(BlocksParser, [{
    key: "_postParse",
    value: function _postParse(token) {
      var _this2 = this;

      if (_typeof(token) !== "object") return token;

      if (token.children !== undefined) {
        if (token.children.constructor !== Array) token.children = [token.children];
        token.children = token.children.map(function (children) {
          return _this2._postParse(children);
        }, this);
      }

      return token;
    }
  }, {
    key: "parseOne",
    value: function parseOne(lines) {
      var _this$findParser = this.findParser(lines),
          parser = _this$findParser.parser,
          match = _this$findParser.match;

      return this._postParse(parser.parse(lines, match));
    }
    /**
     * 
     * @param {string[]} lines 
     */

  }, {
    key: "parse",
    value: function parse(lines) {
      this._preParse(); // if not yet split the string, split


      if (lines.constructor === String) lines = lines.trim().replace(/\r\n|\r/g, '\n').replace(/\t/g, '  ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n').split('\n'); // loop until no line left

      var tokens = [];

      while (lines.length) {
        tokens.push(this.parseOne(lines));
      }

      return tokens;
    }
  }]);

  return BlocksParser;
}(_index.Parsers);

exports.BlocksParser = BlocksParser;
BlocksParser.builtin = builtin;
/**
 * BLOCK TOKENIZER BUILDER
 * extend this class to construct a block parser
 */

var BlockParser =
/*#__PURE__*/
function (_Parser) {
  _inherits(BlockParser, _Parser);

  function BlockParser() {
    _classCallCheck(this, BlockParser);

    return _possibleConstructorReturn(this, _getPrototypeOf(BlockParser).apply(this, arguments));
  }

  _createClass(BlockParser, [{
    key: "test",

    /**
     * Override this method to test
     * @param {string[]} lines 
     * @return - anything is true, call parse() and put it as second param
     */
    value: function test(lines) {
      return RegExp(this.constructor.regex).exec(lines[0]);
    }
    /**
     * 
     * @param {string[]} lines 
     * @param {*} match - what return from test()
     * @return - { tag: string } or false
     */

  }, {
    key: "parse",
    value: function parse(lines, match) {
      throw new Error("override this method");
    }
  }]);

  return BlockParser;
}(_index.Parser); /// BUILTIN ///


exports.BlockParser = BlockParser;

var Paragraph =
/*#__PURE__*/
function (_BlockParser) {
  _inherits(Paragraph, _BlockParser);

  function Paragraph() {
    var _getPrototypeOf3;

    var _this3;

    _classCallCheck(this, Paragraph);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(Paragraph)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "test", function () {
      return true;
    });

    return _this3;
  }

  _createClass(Paragraph, [{
    key: "parse",
    value: function parse(lines) {
      var children = [lines.shift()];
      var parser;

      while (lines.length && this.findParser(lines).constructor === this.constructor) {
        if (lines[0].endsWith("  ")) children.push('\n', lines.shift());else children.push(" ".concat(lines.shift()));
      }

      return {
        tag: "p",
        children: children
      };
    }
  }]);

  return Paragraph;
}(BlockParser);

var Heading =
/*#__PURE__*/
function (_BlockParser2) {
  _inherits(Heading, _BlockParser2);

  function Heading() {
    _classCallCheck(this, Heading);

    return _possibleConstructorReturn(this, _getPrototypeOf(Heading).apply(this, arguments));
  }

  _createClass(Heading, [{
    key: "parse",
    value: function parse(lines, match) {
      lines.shift();
      return {
        tag: "h".concat(match[1].length),
        children: match[2]
      };
    }
  }]);

  return Heading;
}(BlockParser);

Heading.regex = /^(#{1,6}) *([^\n]+)/;
builtin.add("heading", Heading);

var Heading12 =
/*#__PURE__*/
function (_BlockParser3) {
  _inherits(Heading12, _BlockParser3);

  function Heading12() {
    _classCallCheck(this, Heading12);

    return _possibleConstructorReturn(this, _getPrototypeOf(Heading12).apply(this, arguments));
  }

  _createClass(Heading12, [{
    key: "test",
    value: function test(lines) {
      if (lines.length >= 2) return /^(-|=)\1*$/.exec(lines[1]);
      return false;
    }
  }, {
    key: "parse",
    value: function parse(lines, match) {
      var children = lines.shift();
      lines.shift();
      return {
        tag: "h".concat(match[1] === "=" ? 1 : 2),
        children: children
      };
    }
  }]);

  return Heading12;
}(BlockParser);

builtin.add("heading12", Heading12);

var Hr =
/*#__PURE__*/
function (_BlockParser4) {
  _inherits(Hr, _BlockParser4);

  function Hr() {
    _classCallCheck(this, Hr);

    return _possibleConstructorReturn(this, _getPrototypeOf(Hr).apply(this, arguments));
  }

  _createClass(Hr, [{
    key: "parse",
    value: function parse(lines, match) {
      lines.shift();
      return {
        tag: 'hr'
      };
    }
  }]);

  return Hr;
}(BlockParser);

Hr.regex = /^([-*_]){3,}$/;
builtin.add("hr", Hr);

var List =
/*#__PURE__*/
function (_BlockParser5) {
  _inherits(List, _BlockParser5);

  function List() {
    _classCallCheck(this, List);

    return _possibleConstructorReturn(this, _getPrototypeOf(List).apply(this, arguments));
  }

  _createClass(List, [{
    key: "_depth",
    value: function _depth(match) {
      var preDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var depth = Math.floor(match[1].length / 2) - preDepth;
      if (depth < 0) depth = 0;
      return depth;
    }
  }, {
    key: "_type",
    value: function _type(match) {
      return isNaN(+match[2][0]) ? 'ul' : 'ol';
    }
  }, {
    key: "_li",
    value: function _li(match) {
      return {
        tag: 'li',
        children: [match[3]]
      };
    }
  }, {
    key: "_wli",
    value: function _wli(tag, depth) {
      return {
        tag: tag,
        children: [],
        depth: depth
      };
    }
  }, {
    key: "_append",
    value: function _append(parent, child) {
      parent.children.push(child);
      child.parent = parent;
    }
  }, {
    key: "_findSameDepth",
    value: function _findSameDepth(wli, depth) {
      if (depth > wli.depth) return null;
      var curWli = wli;

      while (curWli.depth !== depth) {
        curWli = curWli.parent.parent;
      }

      return curWli;
    }
  }, {
    key: "_removeUnnec",
    value: function _removeUnnec(el) {
      delete el.parent;
      delete el.depth;

      if (el.children) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = el.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            this._removeUnnec(child);
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
      }
    }
  }, {
    key: "parse",
    value: function parse(lines, match) {
      lines.shift();

      var type = this._type(match);

      var preDepth = this._depth(match);

      var root = this._wli(type, this._depth(match, preDepth));

      if (type === "ol") root.start = +match[2];

      var li = this._li(match);

      this._append(root, li);

      var prevWli = root,
          wli,
          findWli,
          depth; // eslint-disable-next-line

      while (match = this.test(lines) || lines.length && lines[0].startsWith("  ") && (match = true)) {
        // line break;
        if (match === true) {
          (0, _helpers.lastItem)(prevWli.children).children[0] += lines.shift().slice(1);
          continue;
        } // prepare


        type = this._type(match);
        depth = this._depth(match, preDepth); // diffirent type at root

        if (depth === 0 && type !== root.tag) break; // li & wli

        li = this._li(match);
        findWli = this._findSameDepth(prevWli, depth); // if greater depth

        if (findWli === null) {
          wli = this._wli(type, depth);

          this._append(wli, li);

          this._append((0, _helpers.lastItem)(prevWli.children), wli);
        } // found wli
        else {
            // same type
            if (findWli.tag === type) this._append(findWli, li); // different type
            else {
                wli = this._wli(type, depth);

                this._append(wli, li);

                this._append(findWli.parent, wli);
              }
          }

        prevWli = li.parent;
        lines.shift();
      }

      this._removeUnnec(root);

      return root;
    }
  }]);

  return List;
}(BlockParser);

List.regex = /^(\s*)([-*+]|\d+\.) (.*)/;
builtin.add("li", List);

var FenceCode =
/*#__PURE__*/
function (_BlockParser6) {
  _inherits(FenceCode, _BlockParser6);

  function FenceCode() {
    _classCallCheck(this, FenceCode);

    return _possibleConstructorReturn(this, _getPrototypeOf(FenceCode).apply(this, arguments));
  }

  _createClass(FenceCode, [{
    key: "parse",
    value: function parse(lines, match) {
      lines.shift();
      var codes = [];

      while (lines.length) {
        if (!lines[0].startsWith("```")) codes.push(lines.shift());else {
          lines.shift();
          break;
        }
      }

      return {
        tag: 'block_code',
        children: codes.join('\n'),
        language: match[1]
      };
    }
  }]);

  return FenceCode;
}(BlockParser);

FenceCode.regex = /^``` *(.*)/;
builtin.add("fence_code", FenceCode);

var IndentCode =
/*#__PURE__*/
function (_BlockParser7) {
  _inherits(IndentCode, _BlockParser7);

  function IndentCode() {
    _classCallCheck(this, IndentCode);

    return _possibleConstructorReturn(this, _getPrototypeOf(IndentCode).apply(this, arguments));
  }

  _createClass(IndentCode, [{
    key: "parse",
    value: function parse(lines, match) {
      var codes = [];

      do {
        lines.shift();
        codes.push(match[1]);
      } while (lines.length && (match = this.test(lines)));

      return {
        tag: 'block_code',
        text: codes.join('\n')
      };
    }
  }]);

  return IndentCode;
}(BlockParser);

IndentCode.regex = /^ {4}(.*)/;
builtin.add("indent_code", IndentCode);

var BlockQuote =
/*#__PURE__*/
function (_BlockParser8) {
  _inherits(BlockQuote, _BlockParser8);

  function BlockQuote() {
    _classCallCheck(this, BlockQuote);

    return _possibleConstructorReturn(this, _getPrototypeOf(BlockQuote).apply(this, arguments));
  }

  _createClass(BlockQuote, [{
    key: "parse",
    value: function parse(lines, match) {
      var all = [];

      do {
        lines.shift();
        all.push(match[1]);
      } while (lines.length && (match = this.test(lines)));

      return {
        tag: "blockquote",
        children: this.mainParser.parse(all)
      };
    }
  }]);

  return BlockQuote;
}(BlockParser);

BlockQuote.regex = /^> *(.*)/;
builtin.add("blockquote", BlockQuote);

var Reference =
/*#__PURE__*/
function (_BlockParser9) {
  _inherits(Reference, _BlockParser9);

  function Reference() {
    _classCallCheck(this, Reference);

    return _possibleConstructorReturn(this, _getPrototypeOf(Reference).apply(this, arguments));
  }

  _createClass(Reference, [{
    key: "parse",
    value: function parse(lines, match) {
      lines.shift();
      this.data.ref[match[1]] = {
        href: match[2],
        title: match[3]
      };
      return this.empty;
    }
  }]);

  return Reference;
}(BlockParser);

Reference.regex = "^\\[(.+?)\\]: *".concat(_common.default.link, "$");
builtin.add("reference", Reference);

var Table =
/*#__PURE__*/
function (_BlockParser10) {
  _inherits(Table, _BlockParser10);

  function Table() {
    var _getPrototypeOf4;

    var _this4;

    _classCallCheck(this, Table);

    for (var _len3 = arguments.length, a = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      a[_key3] = arguments[_key3];
    }

    _this4 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(Table)).call.apply(_getPrototypeOf4, [this].concat(a)));
    _this4.dataRegex = /(?<!\\)\|.+?(?=(?<!\\)\|)/g;
    _this4.alignRegex = '\\| *:? *[-]+ *:? *';
    return _this4;
  }

  _createClass(Table, [{
    key: "_addVerticalLine",
    value: function _addVerticalLine(string) {
      if (!string.startsWith("|")) string = "| ".concat(string);
      if (!string.endsWith("|") && !string.endsWith("\\|")) string += "|";
      return string;
    }
  }, {
    key: "test",
    value: function test(lines) {
      if (lines.length < 2) return false;

      var line0 = this._addVerticalLine(lines[0]);

      var line1 = this._addVerticalLine(lines[1]);

      if (RegExp("^(".concat(this.alignRegex, ")+\\|?$")).exec(line1)) {
        var heads = line0.match(this.dataRegex);
        var aligns = line1.match(RegExp(this.alignRegex, 'g'));
        if (heads.length === aligns.length) return {
          heads: heads,
          aligns: aligns,
          length: heads.length
        };
      }

      return false;
    }
  }, {
    key: "_genRow",
    value: function _genRow(data, aligns, isBody) {
      return data.map(function (row) {
        return {
          tag: "tr",
          children: row.map(function (col, id) {
            return {
              tag: isBody ? "td" : "th",
              align: aligns[id],
              children: col
            };
          })
        };
      });
    }
  }, {
    key: "parse",
    value: function parse(lines, _ref) {
      var heads = _ref.heads,
          aligns = _ref.aligns,
          length = _ref.length;
      lines.shift();
      lines.shift();
      heads = heads.map(function (one) {
        return one.substr(1).trim();
      });
      aligns = aligns.map(function (one) {
        var inn = one.substr(1).trim();
        var left = inn.startsWith(":");
        var right = inn.endsWith(":");
        if (left && right) return "center";else if (left) return "left";else if (right) return "right";else return "";
      });
      var data = [];
      var matches;

      while (lines.length && (matches = this._addVerticalLine(lines[0]).match(this.dataRegex)) && matches.length === length && (lines.shift() || true)) {
        data.push(matches.map(function (one) {
          return one.substr(1).trim();
        }).slice(0, heads.length));
      }

      return {
        tag: "table",
        children: [{
          tag: "thead",
          children: this._genRow([heads], aligns, false)
        }, {
          tag: "tbody",
          children: this._genRow(data, aligns, true)
        }]
      };
    }
  }]);

  return Table;
}(BlockParser);

Table.specialChar = "|";
builtin.add("table", Table);