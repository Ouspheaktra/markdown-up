"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "HTMLRenderer", {
  enumerable: true,
  get: function get() {
    return _html.default;
  }
});
Object.defineProperty(exports, "ReactRenderer", {
  enumerable: true,
  get: function get() {
    return _react.default;
  }
});
Object.defineProperty(exports, "BlocksParser", {
  enumerable: true,
  get: function get() {
    return _blocksParser.BlocksParser;
  }
});
Object.defineProperty(exports, "BlockParser", {
  enumerable: true,
  get: function get() {
    return _blocksParser.BlockParser;
  }
});
Object.defineProperty(exports, "InlinesParser", {
  enumerable: true,
  get: function get() {
    return _inlinesParser.InlinesParser;
  }
});
Object.defineProperty(exports, "InlineParser", {
  enumerable: true,
  get: function get() {
    return _inlinesParser.InlineParser;
  }
});
exports.helpers = exports.MarkdownUp = exports.default = void 0;

var _html = _interopRequireDefault(require("./renderer/html"));

var _react = _interopRequireDefault(require("./renderer/react"));

var _blocksParser = require("./parser/blocks-parser");

var _inlinesParser = require("./parser/inlines-parser");

var helpers = _interopRequireWildcard(require("./helpers"));

exports.helpers = helpers;

var rendererHelpers = _interopRequireWildcard(require("./renderer/helpers"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MarkdownUp =
/*#__PURE__*/
function () {
  function MarkdownUp(renderer) {
    _classCallCheck(this, MarkdownUp);

    this.specialChar = [];
    this.data = {};
    this.blocksParser = new _blocksParser.BlocksParser(this.data, this.specialChar);
    this.inlinesParser = new _inlinesParser.InlinesParser(this.data, this.specialChar);
    this.renderer = new renderer(this.data);
    this.blockParsers = this.blocksParser.parsers;
    this.inlineParsers = this.inlinesParser.parsers;
    this.renderers = this.renderer.renderers;
  }

  _createClass(MarkdownUp, [{
    key: "parse",
    value: function parse(src) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      helpers.clearObject(this.data);
      Object.assign(this.data, data);
      this.data.ref = {};
      return this.inlinesParser.parse(this.blocksParser.parse(src));
    }
  }, {
    key: "render",
    value: function render(src) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.renderer.render(typeof src === "string" ? this.parse(src, data) : src);
    }
  }]);

  return MarkdownUp;
}();

exports.MarkdownUp = exports.default = MarkdownUp;
Object.assign(helpers, rendererHelpers);