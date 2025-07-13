"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = require("@react-pdf/renderer");
var _styles = _interopRequireDefault(require("./styles.js"));
var _Header = _interopRequireDefault(require("./Header.js"));
var _StockTable = _interopRequireDefault(require("./StockTable.js"));
var _moment = _interopRequireDefault(require("moment"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function StockReport({
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
        children: "STOCK REPORT"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Header.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
        style: {
          marginVertical: 10
        },
        children: [data.during && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: ["Purchase Duration: ", (0, _moment.default)(data.during.from).format('DD-MM-YYYY'), " to ", (0, _moment.default)(data.during.to).format('DD-MM-YYYY')]
        }), data.less && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: ["Minimum Quantity Limit: ", data.less]
        }), data.more && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: ["Maximum Quantity Limit: ", data.more]
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_StockTable.default, {
        products: data.products
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
var _default = exports.default = StockReport;