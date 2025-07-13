"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = require("@react-pdf/renderer");
var _styles = _interopRequireDefault(require("./styles.js"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const W = [4, 38, 10, 8, 10, 10, 10, 10].map(e => e / 100);
function StockTable({
  products
}) {
  const totalMRP = products.reduce((agg, curr) => agg + curr.available * curr.mrp, 0);
  const totalCost = products.reduce((agg, curr) => agg + curr.cost, 0);
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
        children: "Opening"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[5]
        }],
        children: "Received"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellH, {
          flex: W[6]
        }],
        children: "Consumed"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellHLast, {
          flex: W[7]
        }],
        children: "Closing"
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
        children: prod.available + prod.consumed - prod.bought
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[5],
          textAlign: 'right'
        }],
        children: prod.bought
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellD, {
          flex: W[6],
          textAlign: 'right'
        }],
        children: prod.consumed
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.cellDLast, {
          flex: W[7],
          textAlign: 'right'
        }],
        children: prod.available
      })]
    }, prod._id)), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
      style: {
        fontSize: 10,
        marginTop: 12
      },
      children: ["Total MRP: ", totalMRP.toFixed(2), " INR"]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
      style: {
        fontSize: 10,
        marginTop: 12
      },
      children: ["Total Cost: ", totalCost.toFixed(2), " INR"]
    })]
  });
}
var _default = exports.default = StockTable;