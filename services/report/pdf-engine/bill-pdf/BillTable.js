"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = require("@react-pdf/renderer");
var _bill = require("../../utils/bill.js");
var _styles = _interopRequireDefault(require("./styles.js"));
var _Total = _interopRequireDefault(require("./Total.js"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const W = [4, 29, 8, 7, 4, 7, 9, 5, 8, 8, 11].map(e => e / 100);
function BillTable({
  order
}) {
  const products = (0, _bill.calculateTableEntries)(order);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
      fixed: true,
      style: {
        display: 'flex',
        flexDirection: 'row'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[0]
        }],
        children: "S.No"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[1]
        }],
        children: "Product Name"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[2]
        }],
        children: "HSN Code"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[3]
        }],
        children: "MRP"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[4]
        }],
        children: "Qty"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[5]
        }],
        children: "Rate"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[6]
        }],
        children: "Amount"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[7]
        }],
        children: "Disc%"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[8]
        }],
        children: "Disc Amt"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[9]
        }],
        children: "GST(18%)"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellHLast, {
          flex: W[10]
        }],
        children: "Net Amt"
      })]
    }), products.map((prod, i) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
      wrap: false,
      style: {
        display: 'flex',
        flexDirection: 'row'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[0],
          textAlign: 'right'
        }],
        children: i + 1
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[1]
        }],
        children: prod.name
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[2],
          textAlign: 'center'
        }],
        children: prod.hsn
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[3],
          textAlign: 'right'
        }],
        children: prod.mrp.toFixed(2)
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[4],
          textAlign: 'right'
        }],
        children: prod.quantity
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[5],
          textAlign: 'right'
        }],
        children: prod.rate.toFixed(2)
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[6],
          textAlign: 'right'
        }],
        children: prod.gross.toFixed(2)
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[7],
          textAlign: 'center'
        }],
        children: prod.discount
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[8],
          textAlign: 'right'
        }],
        children: prod.discountAmt.toFixed(2)
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[9],
          textAlign: 'right'
        }],
        children: (prod.sgst + prod.cgst).toFixed(2)
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellDLast, {
          flex: W[10],
          textAlign: 'right'
        }],
        children: prod.net.toFixed(2)
      })]
    }, prod._id)), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Total.default, {
      products: products
    })]
  });
}
var _default = exports.default = BillTable;