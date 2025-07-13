"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = require("@react-pdf/renderer");
var _index = _interopRequireDefault(require("./bill-pdf/index.js"));
var _helloWorld = _interopRequireDefault(require("./hello-world.js"));
var _index2 = _interopRequireDefault(require("./delivery-note/index.js"));
var _index3 = _interopRequireDefault(require("./product-stock/index.js"));
var _index4 = _interopRequireDefault(require("./sale-report/index.js"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const typeMap = {
  'hello-world': _helloWorld.default,
  'bill': _index.default,
  'delivery-note': _index2.default,
  'product-stock': _index3.default,
  'sale-report': _index4.default
};
class PDFEngine {
  static async generatePDFStream(type, data = {}) {
    const PDFDoc = typeMap[type] || _helloWorld.default;
    const stream = await (0, _renderer.renderToStream)(/*#__PURE__*/(0, _jsxRuntime.jsx)(PDFDoc, {
      data: data
    }));
    return stream;
  }
}
var _default = exports.default = PDFEngine;