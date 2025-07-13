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
function Header({}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
    fixed: true,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.View, {
      style: [_styles.default.rowsb, _styles.default.header, {
        alignItems: 'flex-end'
      }],
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.View, {
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
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_renderer.View, {
      style: [_styles.default.rowsb, {
        marginTop: 5
      }],
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_renderer.Text, {
        style: {
          fontSize: 10
        },
        children: ["Report Date: ", (0, _moment.default)().format('DD/MM/YYYY hh:mm a')]
      })
    })]
  });
}
var _default = exports.default = Header;