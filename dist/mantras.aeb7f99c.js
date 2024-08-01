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
})({"js/builder/mantras.js":[function(require,module,exports) {
document.addEventListener('DOMContentLoaded', function () {
  var mantrasData = {};
  var mantraLimits = {
    Combat: 3,
    Mobility: 1,
    Support: 1,
    Wildcard: 1
  };
  var selectedMantras = {
    Combat: [],
    Mobility: [],
    Support: [],
    Wildcard: []
  };
  var tooltip;
  var attunementColors = {
    Flamecharm: 'text-red-500',
    Thundercall: 'text-yellow-400',
    Frostdraw: 'text-blue-400',
    Galebreathe: 'text-green-400',
    Shadowcast: 'text-purple-500',
    Ironsing: 'text-gray-400',
    null: 'text-white'
  };

  // Fetch and load mantras data
  fetch('js/builder/merged_mantras.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    mantrasData = data;
    renderMantras(data);
    setupMantraInteractions();
    initializeObtainedCategories();
  }).catch(function (error) {
    return console.error('Error loading mantras:', error);
  });
  function renderMantras(data) {
    var obtainableMantrasContainer = document.getElementById('obtainable-mantras');
    var categories = ['Combat', 'Mobility', 'Support'];
    categories.forEach(function (category) {
      var categoryDiv = document.createElement('div');
      categoryDiv.className = 'mb-4';
      categoryDiv.innerHTML = "\n                <button class=\"category-button\" data-category=\"".concat(category.toLowerCase(), "\">\n                  ").concat(category, "\n                  <span class=\"chevron\">\u25BC</span>\n                </button>\n                <div class=\"category-content\" id=\"content-").concat(category.toLowerCase(), "\">\n                  <ul class=\"space-y-1\" id=\"obtainable-").concat(category.toLowerCase(), "\">\n                    ").concat(data[category].map(function (mantra) {
        return "\n                      <li class=\"cursor-pointer hover:text-green-400 ".concat(getAttunementColor(mantra.attunement), "\" \n                          data-category=\"").concat(category, "\" \n                          data-name=\"").concat(mantra.name, "\">\n                        ").concat(mantra.name, "\n                      </li>\n                    ");
      }).join(''), "\n                  </ul>\n                </div>\n              ");
      obtainableMantrasContainer.appendChild(categoryDiv);
    });

    // 添加按钮点击事件
    document.querySelectorAll('.category-button').forEach(function (button) {
      button.addEventListener('click', toggleCategory);
    });
  }
  function toggleCategory(event) {
    var button = event.currentTarget;
    var category = button.dataset.category;
    var content = document.getElementById("content-".concat(category));
    button.classList.toggle('active');
    content.classList.toggle('active');
    if (content.classList.contains('active')) {
      content.style.display = 'block';
      button.querySelector('.chevron').style.transform = 'rotate(180deg)';
    } else {
      content.style.display = 'none';
      button.querySelector('.chevron').style.transform = 'rotate(0deg)';
    }
  }
  function getAttunementColor(attunement) {
    return attunementColors[attunement] || attunementColors[null];
  }
  window.setupMantraInteractions = function () {
    var mantraItems = document.querySelectorAll('#obtainable-mantras li');
    tooltip = createTooltip();
    mantraItems.forEach(function (item) {
      item.addEventListener('mouseenter', showTooltip);
      item.addEventListener('mouseleave', hideTooltip);
      item.addEventListener('click', selectMantra);
    });

    // Setup deselection and tooltip for obtained mantras
    var obtainedMantrasContainer = document.getElementById('obtained-mantras-container');
    obtainedMantrasContainer.addEventListener('click', deselectMantra);
    obtainedMantrasContainer.addEventListener('mouseenter', showTooltip, true);
    obtainedMantrasContainer.addEventListener('mouseleave', hideTooltip, true);
  };
  function createTooltip() {
    var tooltipElement = document.createElement('div');
    tooltipElement.className = 'fixed bg-gray-800 text-white p-2 rounded shadow-lg z-50 hidden';
    document.body.appendChild(tooltipElement);
    return tooltipElement;
  }
  function showTooltip(event) {
    if (event.target.tagName !== 'LI') return;
    var category = event.target.dataset.category;
    var name = event.target.dataset.name;
    var mantra = mantrasData[category].find(function (m) {
      return m.name === name;
    });
    if (mantra) {
      tooltip.innerHTML = "\n            <h3>".concat(mantra.name, "</h3>\n            ").concat(mantra.description ? "<p><strong>Description:</strong> ".concat(mantra.description, "</p>") : '', "\n            ").concat(mantra.requirements ? "<p><strong>Requirements:</strong> ".concat(mantra.requirements, "</p>") : '', "\n            ").concat(mantra.etherCost ? "<p><strong>Ether Cost:</strong> ".concat(mantra.etherCost, "</p>") : '', "\n            ").concat(mantra.cooldown ? "<p><strong>Cooldown:</strong> ".concat(mantra.cooldown, "</p>") : '', "\n            ").concat(mantra.effect ? "<p><strong>Effect:</strong> ".concat(mantra.effect, "</p>") : '', "\n            ").concat(mantra.attunement ? "<p><strong>Attunement:</strong> ".concat(mantra.attunement, "</p>") : '', "\n            ").concat(mantra.isMonsterMantra ? "<p><strong>Monster Mantra:</strong> Yes</p>" : '', "\n          ");
      tooltip.style.display = 'block';
      positionTooltip(event);
    }
  }
  function hideTooltip() {
    tooltip.style.display = 'none';
  }
  function positionTooltip(event) {
    var padding = 20;
    var maxWidth = 400;
    var minWidth = 300;

    // 重置tooltip的宽度，让它自适应内容
    tooltip.style.width = 'auto';
    tooltip.style.height = 'auto';

    // 获取tooltip的实际尺寸
    var tooltipRect = tooltip.getBoundingClientRect();
    var tooltipWidth = Math.max(minWidth, Math.min(tooltipRect.width, maxWidth));
    var tooltipHeight = tooltipRect.height;
    var left = event.clientX + padding;
    var top = event.clientY + padding;

    // 检查右边界
    if (left + tooltipWidth > window.innerWidth) {
      left = event.clientX - tooltipWidth - padding;
    }

    // 检查下边界
    if (top + tooltipHeight > window.innerHeight) {
      // 如果tooltip高度超过了视口高度的80%，我们将其限制在80%
      if (tooltipHeight > window.innerHeight * 0.8) {
        tooltipHeight = window.innerHeight * 0.8;
        tooltip.style.height = "".concat(tooltipHeight, "px");
        top = window.innerHeight - tooltipHeight - padding;
      } else {
        top = event.clientY - tooltipHeight - padding;
      }
    }
    tooltip.style.left = "".concat(left, "px");
    tooltip.style.top = "".concat(top, "px");
    tooltip.style.width = "".concat(tooltipWidth, "px");
  }
  function selectMantra(event) {
    var category = event.target.dataset.category;
    var name = event.target.dataset.name;
    var mantra = mantrasData[category].find(function (m) {
      return m.name === name;
    });
    var targetCategory = category;

    // 检查当前类别是否已达到上限
    if (selectedMantras[category].length >= mantraLimits[category]) {
      // 如果达到上限，检查 Wildcard 是否有空位
      if (selectedMantras['Wildcard'].length < mantraLimits['Wildcard']) {
        targetCategory = 'Wildcard';
      } else {
        // 如果 Wildcard 也满了，那么继续添加到原类别
        targetCategory = category;
      }
    }

    // 添加 mantra 到目标类别
    addObtainedMantra(mantra, targetCategory);
    disableMantra(event.target);

    // 更新计数器
    updateMantraCount(targetCategory);
    window.selectedMantras = JSON.parse(JSON.stringify(selectedMantras));
    console.log("Updated window.selectedMantras after selection:", JSON.parse(JSON.stringify(window.selectedMantras)));
    console.log("Updated selectedMantras after selection:", JSON.parse(JSON.stringify(selectedMantras)));
  }
  function disableMantra(element) {
    element.classList.remove('hover:text-green-400');
    element.classList.add('text-gray-500', 'opacity-50', 'cursor-not-allowed');
    element.style.pointerEvents = 'none';
  }
  function enableMantra(element) {
    element.classList.remove('text-gray-500', 'opacity-50', 'cursor-not-allowed');
    element.classList.add('hover:text-green-400');
    element.style.pointerEvents = 'auto';
  }
  function addObtainedMantra(mantra, category) {
    var categoryContainer = document.getElementById("obtained-".concat(category.toLowerCase()));
    var mantraElement = document.createElement('li');
    mantraElement.textContent = mantra.name;
    mantraElement.className = "cursor-pointer ".concat(getAttunementColor(mantra.attunement));
    mantraElement.dataset.category = category;
    mantraElement.dataset.name = mantra.name;
    categoryContainer.querySelector('ul').appendChild(mantraElement);
    selectedMantras[category].push(mantra);
  }
  function deselectMantra(event) {
    if (event.target.tagName === 'LI') {
      var category = event.target.dataset.category;
      var name = event.target.dataset.name;

      // Remove from selectedMantras
      selectedMantras[category] = selectedMantras[category].filter(function (m) {
        return m.name !== name;
      });

      // Remove the li element
      event.target.remove();

      // Update the count
      updateMantraCount(category);

      // Re-enable the mantra in the obtainable list
      var obtainableMantra = document.querySelector("#obtainable-".concat(category.toLowerCase(), " li[data-name=\"").concat(name, "\"]"));
      if (obtainableMantra) {
        enableMantra(obtainableMantra);
      }
    }
    window.selectedMantras = JSON.parse(JSON.stringify(selectedMantras));
    console.log("Updated window.selectedMantras after deselection:", JSON.parse(JSON.stringify(window.selectedMantras)));
    console.log("Updated selectedMantras after deselection:", JSON.parse(JSON.stringify(selectedMantras)));
  }
  function createCategoryContainer(category) {
    var container = document.createElement('div');
    container.id = "obtained-".concat(category.toLowerCase());
    container.innerHTML = "\n        <div class=\"flex justify-between items-center mb-2\">\n          <span class=\"text-lg font-bold text-yellow-400\">".concat(category, "</span>\n          <span class=\"text-sm\"><span id=\"").concat(category.toLowerCase(), "-count\" class=\"text-white\">0</span>/").concat(mantraLimits[category], "</span>\n        </div>\n        <ul class=\"space-y-1\"></ul>\n      ");
    return container;
  }
  function updateMantraCount(category) {
    var countElement = document.getElementById("".concat(category.toLowerCase(), "-count"));
    if (countElement) {
      var currentCount = selectedMantras[category].length;
      countElement.textContent = currentCount;
      countElement.className = currentCount > mantraLimits[category] ? 'text-red-400' : 'text-white';
    }
  }
  function initializeObtainedCategories() {
    var obtainedMantrasContainer = document.getElementById('obtained-mantras-container');
    ['Combat', 'Mobility', 'Support', 'Wildcard'].forEach(function (category) {
      obtainedMantrasContainer.appendChild(createCategoryContainer(category));
    });
  }
  function createTooltip() {
    var tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltip';
    document.body.appendChild(tooltipElement);
    return tooltipElement;
  }
  function showTooltip(event) {
    if (event.target.tagName !== 'LI') return;
    var category = event.target.dataset.category;
    var name = event.target.dataset.name;
    var mantra = mantrasData[category].find(function (m) {
      return m.name === name;
    });
    if (mantra) {
      tooltip.innerHTML = "\n            <h3 class=\"text-lg font-bold mb-2\">".concat(mantra.name, "</h3>\n            ").concat(mantra.description ? "<p><strong>Description:</strong> ".concat(mantra.description, "</p>") : '', "\n            ").concat(mantra.requirements ? "<p><strong>Requirements:</strong> ".concat(mantra.requirements, "</p>") : '', "\n            ").concat(mantra.etherCost ? "<p><strong>Ether Cost:</strong> ".concat(mantra.etherCost, "</p>") : '', "\n            ").concat(mantra.cooldown ? "<p><strong>Cooldown:</strong> ".concat(mantra.cooldown, "</p>") : '', "\n            ").concat(mantra.effect ? "<p><strong>Effect:</strong> ".concat(mantra.effect, "</p>") : '', "\n            ").concat(mantra.attunement ? "<p><strong>Attunement:</strong> ".concat(mantra.attunement, "</p>") : '', "\n            ").concat(mantra.isMonsterMantra ? "<p><strong>Monster Mantra:</strong> Yes</p>" : '', "\n          ");
      tooltip.style.display = 'block';
      positionTooltip(event);
    }
  }
  function hideTooltip() {
    tooltip.style.display = 'none';
  }
  function positionTooltip(event) {
    var tooltipWidth = 300;
    var tooltipHeight = 300;
    var padding = 20;
    var left = event.clientX + padding;
    var top = event.clientY + padding;

    // 检查右边界
    if (left + tooltipWidth > window.innerWidth) {
      left = event.clientX - tooltipWidth - padding;
    }

    // 检查下边界
    if (top + tooltipHeight > window.innerHeight) {
      top = event.clientY - tooltipHeight - padding;
    }
    tooltip.style.left = "".concat(left, "px");
    tooltip.style.top = "".concat(top, "px");
  }

  // 添加鼠标移动事件监听器
  document.addEventListener('mousemove', function (event) {
    if (tooltip.style.display === 'block') {
      positionTooltip(event);
    }
  });
  window.selectedMantras = selectedMantras;
  console.log("Initial window.selectedMantras:", JSON.parse(JSON.stringify(window.selectedMantras)));
});
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
},{}]},{},["C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/builder/mantras.js"], null)
//# sourceMappingURL=/mantras.aeb7f99c.js.map