"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = require("@react-pdf/renderer");
var _styles = _interopRequireDefault(require("./styles.js"));
var _moment = _interopRequireDefault(require("moment"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Header({
  bill
}) {
  const buyer = bill.buyerId || bill.buyer;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
    fixed: true,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
      style: [_styles.default.rowsb, _styles.default.header, {
        alignItems: 'flex-end'
      }],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
          style: [_styles.default.heading1, _styles.default.bold, {
            marginBottom: 5
          }],
          children: "SAATVIK TRADERS"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: "14/A Kachari Bari Road, Manicktalla"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: "Kanchrapara, Dist.- North 24 PGS, PIN-743145"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: "West Bengal, India"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: "GSTIN: 19BPYPS9484J1ZD"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
          style: {
            fontSize: 10
          },
          children: "Mob: 9331237271 / 9748896633, Email: saatviktraders.kpa@gmail.com"
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
        style: _objectSpread(_objectSpread({}, _styles.default.bold), {}, {
          fontSize: 10
        }),
        children: ["Bill No.: ", bill.billNo]
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
      style: [_styles.default.rowsb, {
        marginTop: 5
      }],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: [_styles.default.bold, {
          fontSize: 10
        }],
        children: "Bill to"
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
        style: {
          fontSize: 10
        },
        children: ["Date: ", (0, _moment.default)(bill.billDate).format('DD/MM/YYYY')]
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
      style: {
        marginBottom: 10,
        marginTop: 4
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.Text, {
        style: _objectSpread({
          fontSize: 12
        }, _styles.default.bold),
        children: buyer.name
      }), buyer.gstin && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
        style: {
          fontSize: 10
        },
        children: ["GSTIN: ", buyer.gstin]
      }), buyer.address && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
        style: {
          fontSize: 10
        },
        children: ["Address: ", buyer.address]
      }), buyer.contact && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
        style: {
          fontSize: 10
        },
        children: ["Contact: ", buyer.contact]
      }), buyer.placeOfSupply && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
        style: {
          fontSize: 10
        },
        children: ["Place Of Supply: ", buyer.placeOfSupply]
      })]
    })]
  });
}
var _default = exports.default = Header;