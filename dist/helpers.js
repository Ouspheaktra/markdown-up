"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regexToString = exports.clearObject = exports.lastItem = exports.removeDuplicate = void 0;

var removeDuplicate = function removeDuplicate(arrArg) {
  return arrArg.filter(function (elem, pos, arr) {
    return arr.indexOf(elem) === pos;
  });
};

exports.removeDuplicate = removeDuplicate;

var lastItem = function lastItem(array) {
  return array.length ? array[array.length - 1] : undefined;
};

exports.lastItem = lastItem;

var clearObject = function clearObject(obj) {
  return Object.keys(obj).forEach(function (k) {
    return obj.hasOwnProperty(k) && delete obj[k];
  });
};

exports.clearObject = clearObject;

var regexToString = function regexToString(regex) {
  regex = regex.toString();
  regex = regex.substring(1, regex.length - 1);
  return regex;
};

exports.regexToString = regexToString;