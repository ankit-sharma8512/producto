"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = require("@react-pdf/renderer");
var _jsxRuntime = require("react/jsx-runtime");
function HelloWorldPDF() {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Document, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Page, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: {
          fontSize: 20,
          textAlign: 'center',
          marginTop: 450
        },
        children: "Hello World"
      })
    })
  });
}
var _default = exports.default = HelloWorldPDF;