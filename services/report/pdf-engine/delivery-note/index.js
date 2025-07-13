"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = require("@react-pdf/renderer");
var _styles = _interopRequireDefault(require("./styles.js"));
var _Header = _interopRequireDefault(require("./Header.js"));
var _Footer = _interopRequireDefault(require("./Footer.js"));
var _Total = _interopRequireDefault(require("./Total.js"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function DeliveryNote({
  data
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Document, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Page, {
      size: "A4",
      style: _styles.default.page,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        fixed: true,
        style: {
          fontSize: 10,
          textAlign: 'center',
          marginBottom: 12,
          textDecoration: 'underline'
        },
        children: "DELIVERY NOTE"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Header.default, {
        bill: data
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
          style: {
            fontSize: 10,
            fontWeight: 700
          },
          children: "Description of Items"
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: ["Total Items: ", data.order.length]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: ["Total Quantity: ", data.order.reduce((agg, curr) => agg + curr.quantity, 0)]
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Total.default, {
        order: data.order
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Footer.default, {
        data: data
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: {
          position: 'absolute',
          bottom: 10,
          right: 10,
          fontSize: 8
        },
        fixed: true,
        render: ({
          pageNumber,
          totalPages
        }) => `Page ${pageNumber}/${totalPages}`
      })]
    })
  });
}
var _default = exports.default = DeliveryNote;