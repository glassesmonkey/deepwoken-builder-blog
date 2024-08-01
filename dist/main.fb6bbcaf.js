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
})({"js/main.js":[function(require,module,exports) {
var raceBonus = {
  Etrean: {
    Agility: 2,
    Intelligence: 3
  },
  Celtor: {
    Intelligence: 2,
    Charisma: 3
  },
  Adret: {
    Willpower: 2,
    Charisma: 3
  },
  Canor: {
    Strength: 3,
    Charisma: 2
  },
  Gremor: {
    Strength: 2,
    Fortitude: 3
  },
  Khan: {
    Strength: 3,
    Agility: 2
  },
  Felinor: {
    Agility: 3,
    Charisma: 2
  },
  Chrysid: {
    Agility: 2,
    Charisma: 3
  },
  Vesperian: {
    Fortitude: 3,
    Willpower: 2
  },
  Capra: {
    Intelligence: 3,
    Willpower: 2
  },
  Ganymede: {
    Intelligence: 2,
    Willpower: 3
  },
  Tiran: {
    Agility: 3,
    Willpower: 2
  },
  Drakkard: {
    Fortitude: 3,
    Agility: 2
  },
  Lightborn: {
    Strength: 2,
    Fortitude: 2,
    Agility: 2,
    Intelligence: 2,
    Willpower: 2
  }
};
var currentRace = 'Etrean';
var investmentPoints = 325;
var pointsSpent = 5;
var power = 0;
var nextPower = 30;
var totalInvestedPoints = 0;
var statInputs = document.querySelectorAll('.stat-input:not([data-exclude-from-calculation])');
var investmentPointsDisplay = document.getElementById('investment-points');
var pointsSpentDisplay = document.getElementById('points-spent');
var powerDisplay = document.getElementById('power');
var nextPowerDisplay = document.getElementById('next-power');
var raceSelect = document.getElementById('race-select');
var specialTraits = ['vitality', 'erudition', 'proficiency', 'songchant'];
function handleSpecialTraitChange(event) {
  var input = event.target;
  var newValue = parseInt(input.value) || 0;
  newValue = Math.min(Math.max(newValue, 0), 6);
  var totalSpecialTraits = 0;
  specialTraits.forEach(function (trait) {
    var traitInput = document.getElementById("".concat(trait, "-input"));
    if (traitInput === input) {
      totalSpecialTraits += newValue;
    } else {
      totalSpecialTraits += parseInt(traitInput.value) || 0;
    }
  });
  if (totalSpecialTraits > 12) {
    newValue -= totalSpecialTraits - 12;
    newValue = Math.max(newValue, 0);
  }
  input.value = newValue;
  input.dataset.oldValue = newValue;
  if (newValue !== parseInt(event.target.value)) {
    alert("The total of special traits cannot exceed 12. Adjusted ".concat(input.id.replace('-input', ''), " to ").concat(newValue, "."));
  }
}
function updateDisplay() {
  investmentPointsDisplay.textContent = investmentPoints;
  pointsSpentDisplay.textContent = pointsSpent;
  powerDisplay.textContent = power;
  nextPowerDisplay.textContent = nextPower;
}
function calculateRaceBonusTotal(race) {
  return Object.values(raceBonus[race]).reduce(function (sum, value) {
    return sum + value;
  }, 0);
}
function updatePower(change) {
  totalInvestedPoints += change;
  if (change > 0) {
    nextPower -= change;
    while (nextPower <= 0) {
      nextPower += 15;
      power += 1;
    }
  } else if (change < 0) {
    nextPower += Math.abs(change);
    while (nextPower > 15 && totalInvestedPoints >= 25) {
      nextPower -= 15;
      power -= 1;
    }
  }
  if (totalInvestedPoints < 25) {
    power = 0;
  } else {
    power = Math.ceil((totalInvestedPoints - 25) / 15);
    if (Number.isInteger(power)) {
      power += 1;
    }
  }
}
function handleInputChange(event) {
  var input = event.target;
  if (specialTraits.includes(input.id.replace('-input', ''))) {
    return;
  }
  var newValue = parseInt(input.value) || 0;
  var oldValue = parseInt(input.dataset.oldValue) || 0;
  if (newValue > 100) {
    newValue = 100;
    input.value = 100;
  }
  var difference = newValue - oldValue;
  if (investmentPoints - difference < 0) {
    input.value = oldValue;
    return;
  }
  investmentPoints -= difference;
  pointsSpent += difference;
  updatePower(difference);
  input.dataset.oldValue = newValue;
  updateDisplay();
}
function handleRaceChange() {
  var newRace = raceSelect.value;
  var oldRaceBonusTotal = calculateRaceBonusTotal(currentRace);
  var newRaceBonusTotal = calculateRaceBonusTotal(newRace);
  var bonusDifference = newRaceBonusTotal - oldRaceBonusTotal;

  // 更新 pointsSpent
  if (currentRace === 'Lightborn' && newRace !== 'Lightborn') {
    pointsSpent -= 5;
  } else if (currentRace !== 'Lightborn' && newRace === 'Lightborn') {
    pointsSpent += 5;
  }
  totalInvestedPoints += bonusDifference;
  updatePower(bonusDifference);
  statInputs.forEach(function (input) {
    var stat = input.id.replace('-input', '');
    var oldBonus = raceBonus[currentRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
    var newBonus = raceBonus[newRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
    var baseValue = parseInt(input.dataset.oldValue) - oldBonus;
    var newValue = Math.min(baseValue, 100) + newBonus;
    input.value = newValue;
    input.dataset.oldValue = newValue;
  });
  currentRace = newRace;
  updateDisplay();
}
function initialize() {
  // 获取初始种族
  var initialRace = raceSelect.value;

  // 设置初始 pointsSpent 值
  pointsSpent = initialRace === 'Lightborn' ? 10 : 5;
  var initialRaceBonusTotal = calculateRaceBonusTotal(currentRace);
  totalInvestedPoints += initialRaceBonusTotal;
  updatePower(initialRaceBonusTotal);
  statInputs.forEach(function (input) {
    var stat = input.id.replace('-input', '');
    var initialBonus = raceBonus[currentRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
    input.value = initialBonus;
    input.dataset.oldValue = initialBonus;
    input.addEventListener('change', handleInputChange);
  });
  specialTraits.forEach(function (trait) {
    var input = document.getElementById("".concat(trait, "-input"));
    input.value = 0;
    input.dataset.oldValue = 0;
    input.addEventListener('input', handleSpecialTraitChange);
  });
  raceSelect.addEventListener('change', handleRaceChange);
  updateDisplay();
  initializeNavigation();
}
function initializeNavigation() {
  var mobileMenuButton = document.getElementById('deepwoken-mobile-menu-button');
  var mobileMenu = document.getElementById('deepwoken-mobile-menu');
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }
}
document.querySelectorAll('.stat-input').forEach(function (input) {
  input.addEventListener('input', function () {
    if (this.value < 0) {
      this.value = 0;
    }
  });
});

// document.addEventListener('DOMContentLoaded', initialize);
document.addEventListener('DOMContentLoaded', function () {
  // if (typeof window.initExportImage === 'function') {
  //     window.initExportImage();
  // } else {
  //     console.error('initExportImage function not found');
  // }
  initialize();
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
},{}]},{},["C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map