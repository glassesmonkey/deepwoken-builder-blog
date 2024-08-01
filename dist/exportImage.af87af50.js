// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/utils/exportImage.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// 确保DOM加载完成后再执行脚本
document.addEventListener('DOMContentLoaded', function () {
  // 为导出按钮添加事件监听器
  var exportButton = document.getElementById('exportImage');
  if (exportButton) {
    exportButton.addEventListener('click', exportImage);
  } else {
    console.error('Export button not found');
  }
});
// 修复input和select元素
function fixInputsAndSelects(element) {
  var inputs = element.querySelectorAll('input, select');
  inputs.forEach(function (input) {
    input.style.height = 'auto';
    input.style.minHeight = '30px';
    input.style.lineHeight = '30px';
    input.style.padding = '0 8px';
    input.style.boxSizing = 'border-box';
  });
}
function createOverlay() {
  var overlay = document.createElement('div');
  overlay.id = 'export-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.backdropFilter = 'blur(5px)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  var progressContainer = document.createElement('div');
  progressContainer.style.width = '300px';
  progressContainer.style.backgroundColor = '#fff';
  progressContainer.style.borderRadius = '10px';
  progressContainer.style.padding = '20px';
  progressContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  var progressText = document.createElement('div');
  progressText.id = 'progress-text';
  progressText.textContent = 'Exporting image: 0%';
  progressText.style.marginBottom = '10px';
  progressText.style.textAlign = 'center';
  progressText.style.color = '#333';
  var progressBar = document.createElement('div');
  progressBar.style.width = '100%';
  progressBar.style.backgroundColor = '#e0e0e0';
  progressBar.style.borderRadius = '5px';
  progressBar.style.overflow = 'hidden';
  var progressBarInner = document.createElement('div');
  progressBarInner.id = 'progress-bar-inner';
  progressBarInner.style.width = '0%';
  progressBarInner.style.height = '20px';
  progressBarInner.style.backgroundColor = '#4CAF50';
  progressBarInner.style.transition = 'width 0.3s ease-in-out';
  progressBar.appendChild(progressBarInner);
  progressContainer.appendChild(progressText);
  progressContainer.appendChild(progressBar);
  overlay.appendChild(progressContainer);
  return overlay;
}
function updateProgress(progress) {
  var progressText = document.getElementById('progress-text');
  var progressBarInner = document.getElementById('progress-bar-inner');
  if (progressText && progressBarInner) {
    progressText.textContent = "Exporting image: ".concat(Math.round(progress), "%");
    progressBarInner.style.width = "".concat(progress, "%");
  }
}
function downloadImage(canvas) {
  updateProgress(100);
  setTimeout(function () {
    var dataURL = canvas.toDataURL('image/png');
    var link = document.createElement('a');
    link.download = 'deepwoken_build.png';
    link.href = dataURL;
    link.click();
  }, 500);
}
function exportImage() {
  return _exportImage.apply(this, arguments);
}
function _exportImage() {
  _exportImage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var tabs, images, overlay, _loop, i, finalCanvas;
    return _regeneratorRuntime().wrap(function _callee$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          tabs = ['stats-tab', 'talents-tab', 'mantras-tab', 'weapons-tab', 'summary-tab'];
          images = [];
          overlay = createOverlay();
          document.body.appendChild(overlay);
          _context2.prev = 4;
          _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
            var tabId, tab, containerDiv, canvas;
            return _regeneratorRuntime().wrap(function _loop$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  tabId = tabs[i];
                  _context.next = 3;
                  return activateTab(tabId);
                case 3:
                  _context.next = 5;
                  return new Promise(function (resolve) {
                    return setTimeout(resolve, 1000);
                  });
                case 5:
                  tab = document.getElementById(tabId);
                  if (tab) {
                    _context.next = 8;
                    break;
                  }
                  throw new Error("Tab content not found: ".concat(tabId));
                case 8:
                  containerDiv = document.createElement('div');
                  containerDiv.style.position = 'absolute';
                  containerDiv.style.left = '-9999px';
                  containerDiv.style.top = '0';
                  containerDiv.style.width = '1000px';
                  containerDiv.style.height = 'auto';
                  containerDiv.appendChild(tab.cloneNode(true));
                  document.body.appendChild(containerDiv);
                  _context.next = 18;
                  return applyInlineStyles(containerDiv);
                case 18:
                  if (!(tabId === 'weapons-tab')) {
                    _context.next = 24;
                    break;
                  }
                  window.triggerDamageCalculation();
                  _context.next = 22;
                  return new Promise(function (resolve) {
                    return setTimeout(resolve, 1000);
                  });
                case 22:
                  _context.next = 24;
                  return handleChart(containerDiv);
                case 24:
                  _context.next = 26;
                  return document.fonts.ready;
                case 26:
                  replaceSelectsWithCustomRender(containerDiv);
                  _context.next = 29;
                  return html2canvas(containerDiv, {
                    logging: false,
                    useCORS: true,
                    scale: 2,
                    width: 1000,
                    height: containerDiv.scrollHeight,
                    backgroundColor: null,
                    onclone: function onclone(clonedDoc) {
                      var clonedElement = clonedDoc.getElementById(tabId);
                      if (clonedElement) {
                        fixInputsAndSelects(clonedElement);
                      }
                    }
                  });
                case 29:
                  canvas = _context.sent;
                  images.push(canvas);
                  document.body.removeChild(containerDiv);

                  // 更新进度
                  updateProgress((i + 1) / tabs.length * 100);
                case 33:
                case "end":
                  return _context.stop();
              }
            }, _loop);
          });
          i = 0;
        case 7:
          if (!(i < tabs.length)) {
            _context2.next = 12;
            break;
          }
          return _context2.delegateYield(_loop(), "t0", 9);
        case 9:
          i++;
          _context2.next = 7;
          break;
        case 12:
          finalCanvas = createFinalCanvas(images);
          _context2.next = 15;
          return addWatermark(finalCanvas);
        case 15:
          downloadImage(finalCanvas);
          _context2.next = 22;
          break;
        case 18:
          _context2.prev = 18;
          _context2.t1 = _context2["catch"](4);
          console.error('Error exporting image:', _context2.t1);
          showErrorMessage('Failed to export image. Please try again.');
        case 22:
          _context2.prev = 22;
          document.body.removeChild(overlay);
          return _context2.finish(22);
        case 25:
        case "end":
          return _context2.stop();
      }
    }, _callee, null, [[4, 18, 22, 25]]);
  }));
  return _exportImage.apply(this, arguments);
}
function handleChart(_x) {
  return _handleChart.apply(this, arguments);
} // 应用内联样式
function _handleChart() {
  _handleChart = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(containerDiv) {
    var originalCanvas, clonedCanvasContainer, originalChart, chartImage, chartContainer, labels, labelsContainer;
    return _regeneratorRuntime().wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          originalCanvas = document.getElementById('damageChart');
          clonedCanvasContainer = containerDiv.querySelector('#damageChart').parentNode;
          if (!(originalCanvas && clonedCanvasContainer)) {
            _context3.next = 33;
            break;
          }
          originalChart = Chart.getChart(originalCanvas);
          if (!originalChart) {
            _context3.next = 33;
            break;
          }
          // 调整图表配置
          originalChart.options.scales.x.ticks.font = {
            family: 'Arial, sans-serif',
            size: 12,
            // 减小字体大小
            weight: 'bold'
          };
          originalChart.options.scales.x.ticks.color = 'white';

          // 增加底部边距以为标签留出空间
          originalChart.options.layout.padding.bottom = 30;

          // 更新图表
          originalChart.update();

          // 等待渲染完成
          _context3.next = 11;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          });
        case 11:
          // 将原始图表转换为图像
          chartImage = new Image();
          chartImage.src = originalCanvas.toDataURL();
          _context3.next = 15;
          return new Promise(function (resolve, reject) {
            chartImage.onload = resolve;
            chartImage.onerror = reject;
          });
        case 15:
          // 创建图表容器
          chartContainer = document.createElement('div');
          chartContainer.style.position = 'relative';
          chartContainer.style.width = '100%';
          chartContainer.style.paddingBottom = '50px'; // 增加底部padding
          chartContainer.appendChild(chartImage);

          // 添加x轴标签
          labels = originalChart.data.labels;
          labelsContainer = document.createElement('div');
          labelsContainer.style.display = 'flex';
          labelsContainer.style.justifyContent = 'space-between';
          labelsContainer.style.width = '100%';
          labelsContainer.style.position = 'absolute';
          labelsContainer.style.bottom = '0';
          labelsContainer.style.left = '0';
          labelsContainer.style.padding = '0 10px'; // 添加左右padding

          labels.forEach(function (label) {
            var labelElement = document.createElement('span');
            labelElement.textContent = label;
            labelElement.style.color = 'white';
            labelElement.style.fontSize = '10px'; // 进一步减小字体大小
            labelElement.style.textAlign = 'center';
            labelElement.style.width = "".concat(100 / labels.length, "%");
            labelsContainer.appendChild(labelElement);
          });
          chartContainer.appendChild(labelsContainer);

          // 替换克隆的canvas
          clonedCanvasContainer.innerHTML = '';
          clonedCanvasContainer.appendChild(chartContainer);
        case 33:
        case "end":
          return _context3.stop();
      }
    }, _callee2);
  }));
  return _handleChart.apply(this, arguments);
}
function applyInlineStyles(_x2) {
  return _applyInlineStyles.apply(this, arguments);
} // 替换select元素为自定义渲染
function _applyInlineStyles() {
  _applyInlineStyles = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(element) {
    var elements, i, el, style;
    return _regeneratorRuntime().wrap(function _callee3$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          elements = element.getElementsByTagName('*');
          for (i = 0; i < elements.length; i++) {
            el = elements[i];
            style = window.getComputedStyle(el);
            el.style.cssText = style.cssText;

            // 特别处理grid布局
            if (style.display === 'grid') {
              el.style.display = 'grid';
              el.style.gridTemplateColumns = style.gridTemplateColumns;
              el.style.gridGap = style.gridGap;
            }
            // 确保input和select元素有足够的高度
            if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
              el.style.height = 'auto';
              el.style.minHeight = '30px';
            }

            // 确保canvas元素有正确的尺寸
            if (el.tagName.toLowerCase() === 'canvas') {
              el.style.width = style.width;
              el.style.height = style.height;
            }
          }
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee3);
  }));
  return _applyInlineStyles.apply(this, arguments);
}
function replaceSelectsWithCustomRender(container) {
  var selects = container.querySelectorAll('select');
  selects.forEach(function (select) {
    var customSelect = document.createElement('div');
    customSelect.style.cssText = window.getComputedStyle(select).cssText;
    customSelect.style.overflow = 'hidden';
    customSelect.style.minHeight = '30px';
    customSelect.style.padding = '5px';
    customSelect.style.boxSizing = 'border-box';
    customSelect.style.border = '1px solid #ccc';
    customSelect.style.borderRadius = '4px';
    customSelect.style.backgroundColor = '#1F2937';
    var selectedOption = select.options[select.selectedIndex];
    customSelect.textContent = selectedOption ? selectedOption.textContent : '';
    select.parentNode.replaceChild(customSelect, select);
  });
}

// 激活特定的tab并等待内容加载
function activateTab(_x3) {
  return _activateTab.apply(this, arguments);
} // 创建最终的canvas并拼接图片
function _activateTab() {
  _activateTab = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(tabId) {
    return _regeneratorRuntime().wrap(function _callee4$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", new Promise(function (resolve, reject) {
            var tabButton = document.querySelector("[data-tab=\"".concat(tabId, "\"]"));
            if (!tabButton) {
              reject(new Error("Tab button not found: ".concat(tabId)));
              return;
            }
            tabButton.click();
            var checkInterval = setInterval(function () {
              var content = document.getElementById(tabId);
              if (content && !content.classList.contains('hidden')) {
                clearInterval(checkInterval);
                resolve();
              }
            }, 100);

            // 设置超时，以防内容加载失败
            setTimeout(function () {
              clearInterval(checkInterval);
              reject(new Error("Timeout waiting for tab content: ".concat(tabId)));
            }, 5000);
          }));
        case 1:
        case "end":
          return _context5.stop();
      }
    }, _callee4);
  }));
  return _activateTab.apply(this, arguments);
}
function createFinalCanvas(images) {
  var finalCanvas = document.createElement('canvas');
  var ctx = finalCanvas.getContext('2d');
  var totalHeight = images.reduce(function (sum, img) {
    return sum + img.height;
  }, 0);
  var maxWidth = Math.max.apply(Math, _toConsumableArray(images.map(function (img) {
    return img.width;
  })));
  finalCanvas.width = maxWidth;
  finalCanvas.height = totalHeight;
  var yOffset = 0;
  var _iterator = _createForOfIteratorHelper(images),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var img = _step.value;
      ctx.drawImage(img, 0, yOffset);
      yOffset += img.height;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return finalCanvas;
}
function addWatermark(_x4) {
  return _addWatermark.apply(this, arguments);
} // 3. 修改 loadWatermarkImage 函数以处理跨域问题
function _addWatermark() {
  _addWatermark = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(canvas) {
    var ctx, watermarkPath, watermarkImage, watermarkWidth, watermarkHeight;
    return _regeneratorRuntime().wrap(function _callee5$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          ctx = canvas.getContext('2d');
          watermarkPath = "assets/images/DeepwokenBuilder-yellow.png";
          _context6.prev = 2;
          console.log('Loading watermark image from:', watermarkPath);
          _context6.next = 6;
          return loadWatermarkImage(watermarkPath);
        case 6:
          watermarkImage = _context6.sent;
          console.log('Watermark image loaded successfully');

          // 计算水印大小（例如，画布宽度的20%）
          watermarkWidth = canvas.width * 0.2;
          watermarkHeight = watermarkImage.height / watermarkImage.width * watermarkWidth;
          console.log('Drawing watermark, canvas dimensions:', canvas.width, canvas.height);
          console.log('Watermark dimensions:', watermarkWidth, watermarkHeight);

          // 在左上角添加水印
          ctx.globalAlpha = 0.5; // 设置透明度
          ctx.drawImage(watermarkImage, 10, 10, watermarkWidth, watermarkHeight);

          // 在右下角添加水印
          ctx.drawImage(watermarkImage, canvas.width - watermarkWidth - 10, canvas.height - watermarkHeight - 10, watermarkWidth, watermarkHeight);
          ctx.globalAlpha = 1.0; // 重置透明度
          console.log('Watermark added successfully');
          _context6.next = 26;
          break;
        case 19:
          _context6.prev = 19;
          _context6.t0 = _context6["catch"](2);
          console.error('Error adding watermark:', _context6.t0);
          // 如果加载图片失败，使用文本水印作为后备方案
          ctx.font = '20px Arial';
          ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
          ctx.fillText('deepwokenbuilder.com', 10, 30);
          ctx.fillText('deepwokenbuilder.com', canvas.width - 200, canvas.height - 10);
        case 26:
        case "end":
          return _context6.stop();
      }
    }, _callee5, null, [[2, 19]]);
  }));
  return _addWatermark.apply(this, arguments);
}
function loadWatermarkImage(imagePath) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      return resolve(img);
    };
    img.onerror = function (e) {
      console.error('Error loading watermark image:', e);
      reject(new Error('Failed to load watermark image'));
    };
    img.crossOrigin = 'anonymous'; // 添加这行来处理可能的跨域问题
    img.src = imagePath;
  });
}

// 下载图片
function downloadImage(canvas) {
  var dataURL = canvas.toDataURL('image/png');
  var link = document.createElement('a');
  link.download = 'deepwoken_build.png';
  link.href = dataURL;
  link.click();
}

// 显示加载指示器
function showLoadingIndicator() {
  var loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-indicator';
  loadingDiv.textContent = 'Exporting image...';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '50%';
  loadingDiv.style.left = '50%';
  loadingDiv.style.transform = 'translate(-50%, -50%)';
  loadingDiv.style.padding = '20px';
  loadingDiv.style.background = 'rgba(0, 0, 0, 0.7)';
  loadingDiv.style.color = 'white';
  loadingDiv.style.borderRadius = '5px';
  loadingDiv.style.zIndex = '9999';
  document.body.appendChild(loadingDiv);
}

// 隐藏加载指示器
function hideLoadingIndicator() {
  var loadingDiv = document.getElementById('loading-indicator');
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// 显示错误消息
function showErrorMessage(message) {
  var modal = document.getElementById('custom-modal');
  var modalTitle = document.getElementById('modal-title');
  var modalContent = document.getElementById('modal-content');
  var modalClose = document.getElementById('modal-close');
  if (modal && modalTitle && modalContent && modalClose) {
    modalTitle.textContent = 'Error';
    modalContent.textContent = message;
    modal.classList.remove('hidden');
    modalClose.onclick = function () {
      modal.classList.add('hidden');
    };
  } else {
    alert(message);
  }
}
},{}],"C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "18764" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/utils/exportImage.js"], null)
//# sourceMappingURL=/exportImage.af87af50.js.map