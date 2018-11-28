"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = OrderedObject;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function OrderedObject() {
  var keyArr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var valArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var key = keyArr;
  var val = valArr;
  return {
    add: function add(k, v) {
      if (key.indexOf(k) > 0) return Error("Key : ".concat(k, " already exists"));
      key.push(k);
      val.push(v);
    },
    set: function set(k, v) {
      var id = key.indexOf(k);
      if (id < 0) throw Error("Key '".concat(k, "' not found"));
      val[id] = v;
    },
    valueOf: function valueOf(k) {
      for (var i in key) {
        if (key[i] === k) return val[i];
      }

      return false;
    },
    keys: function keys() {
      return key.slice();
    },
    values: function values() {
      return val.slice();
    },
    entries: function entries() {
      var out = [];

      for (var i in key) {
        out.push([key[i], val[i]]);
      }

      return out;
    },
    addBefore: function addBefore(k, v, beforeKey) {
      var id = key.indexOf(beforeKey);
      if (id < 0) throw Error("Key '".concat(beforeKey, "' not found"));
      key.splice(id, 0, k);
      val.splice(id, 0, v);
    },
    addAfter: function addAfter(k, v, afterKey) {
      var id = key.indexOf(afterKey);
      if (id < 0) throw Error("Key '".concat(afterKey, "' not found"));
      id++;
      key.splice(id, 0, k);
      val.splice(id, 0, v);
    },
    addFirst: function addFirst(k, v) {
      key.unshift(k);
      val.unshift(v);
    },
    clone: function clone() {
      return OrderedObject(_toConsumableArray(key), _toConsumableArray(val));
    },

    get length() {
      return key.length;
    }

  };
}