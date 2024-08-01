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
})({"js/utils/exportURL.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var mantraLimits = {
  Combat: 3,
  Mobility: 1,
  Support: 1,
  Wildcard: 1
};
window.selectedMantras = {
  Combat: [],
  Mobility: [],
  Support: [],
  Wildcard: []
};
var buildStructure = {
  stats: {
    race: "",
    basicInfo: {
      buildName: "",
      buildDescription: "",
      author: ""
    },
    basicStats: {
      strength: 0,
      fortitude: 0,
      agility: 0,
      intelligence: 0,
      willpower: 0,
      charisma: 0
    },
    weaponStats: {},
    attunementStats: {
      flamecharm: 0,
      frostdraw: 0,
      thundercall: 0,
      galebreath: 0,
      shadowcast: 0,
      ironsing: 0
    },
    traits: {
      vitality: 0,
      erudition: 0,
      proficiency: 0,
      songchant: 0
    },
    boons: ["", ""],
    flaws: ["", ""]
  },
  talents: {
    common: [],
    rare: [],
    advanced: [],
    oath: []
  },
  mantras: {
    combat: [],
    mobility: [],
    support: [],
    wisp: []
  },
  weapons: {
    weapon1: {
      name: "",
      stars: 0,
      starType: ""
    },
    weapon2: {
      name: "",
      stars: 0,
      starType: ""
    },
    attributeLevel: 0,
    proficiency: 0,
    additionalPenetration: 0,
    bleedChance: 0,
    lightWep: 0,
    mediumWep: 0,
    heavyWep: 0
  },
  summary: ""
};

// Encoding function
function encodeBuild(build) {
  var jsonString = JSON.stringify(build);
  return LZString.compressToEncodedURIComponent(jsonString);
}

// Decoding function
function decodeBuild(encodedString) {
  var decompressed = LZString.decompressFromEncodedURIComponent(encodedString);
  return JSON.parse(decompressed);
}

// Export build as link
function showModal(title, content) {
  var modal = document.getElementById('custom-modal');
  var modalTitle = document.getElementById('modal-title');
  var modalContent = document.getElementById('modal-content');
  var closeButton = document.getElementById('modal-close');
  modalTitle.textContent = title;
  modalContent.textContent = content;
  modal.classList.remove('hidden');
  closeButton.onclick = function () {
    modal.classList.add('hidden');
  };
}
function exportBuildAsLink() {
  console.log("exportBuildAsLink function called");
  console.log("Before getCurrentBuildConfiguration, window.selectedMantras:", JSON.parse(JSON.stringify(window.selectedMantras)));
  var currentBuild = getCurrentBuildConfiguration();
  console.log("After getCurrentBuildConfiguration");
  console.log("Exporting build configuration:", currentBuild);
  console.log("Mantras in exported configuration:", currentBuild.mantras);
  var encodedBuild = encodeBuild(currentBuild);
  var url = "".concat(window.location.origin).concat(window.location.pathname, "?build=").concat(encodedBuild);
  window.history.pushState({}, '', url);
  var title = 'Build Link Generated';
  var message = 'You can copy the current URL to share your build.';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function () {
      showModal(title, message + ' Link copied to clipboard.');
    }).catch(function () {
      fallbackCopy(url, title, message);
    });
  } else {
    fallbackCopy(url, title, message);
  }
}
function fallbackCopy(text, title, message) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  try {
    textArea.select();
    var successful = document.execCommand('copy');
    if (successful) {
      showModal(title, message + ' Link copied to clipboard.');
    } else {
      throw new Error('Copy failed');
    }
  } catch (err) {
    showModal(title, message + ' Unable to copy automatically. Please copy this URL manually:\n\n' + text);
  } finally {
    document.body.removeChild(textArea);
  }
}
function loadBuildFromUrl() {
  var urlParams = new URLSearchParams(window.location.search);
  var encodedBuild = urlParams.get('build');
  if (encodedBuild) {
    try {
      var buildConfig = decodeBuild(encodedBuild);
      console.log("Decoded build config:", buildConfig);
      initializeWeaponsTab().then(function () {
        applyBuildConfiguration(buildConfig);
        window.selectedTalents = buildConfig.talents;
        updateSelectedTalents();
        triggerDamageCalculation();
      }).catch(function (error) {
        console.error('Failed to initialize weapons tab:', error);
      });
    } catch (error) {
      console.error('Failed to load build from URL:', error);
      alert('Unable to load build configuration. The link may be invalid or corrupted.');
    }
  }
}
function updateMantrasUI() {
  // 更新已获得的 mantras
  for (var _i = 0, _Object$entries = Object.entries(window.selectedMantras); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      category = _Object$entries$_i[0],
      mantras = _Object$entries$_i[1];
    var countElement = document.getElementById("".concat(category.toLowerCase(), "-count"));
    if (countElement) {
      countElement.textContent = mantras.length;
    }
  }

  // 更新可选 mantras 的状态
  updateObtainableMantras();
}
function getStatsTabConfiguration() {
  var config = {
    race: '',
    bell: '',
    outfit: '',
    origin: '',
    murmur: '',
    oath: '',
    basicInfo: {},
    basicStats: {},
    weaponStats: {},
    attunementStats: {},
    traits: {},
    boons: ['', ''],
    flaws: ['', '']
  };

  // Helper function to safely get select value
  function safeGetSelectValue(id) {
    var element = document.getElementById(id);
    return element ? element.value : '';
  }
  // Helper function to safely get input value
  function safeGetInputValue(id) {
    var element = document.getElementById(id);
    return element ? element.value : '';
  }

  // Get all select values
  config.race = safeGetSelectValue('race-select');
  config.bell = safeGetSelectValue('bell-select');
  config.outfit = safeGetSelectValue('outfit-select');
  config.origin = safeGetSelectValue('origin-select');
  config.murmur = safeGetSelectValue('murmur-select');
  config.oath = safeGetSelectValue('oath-select');
  // Get basic info
  config.basicInfo.buildName = safeGetInputValue('build-name');
  config.basicInfo.buildDescription = safeGetInputValue('build-description');
  config.basicInfo.author = safeGetInputValue('build-author');

  // Get basic stats
  ['strength', 'fortitude', 'agility', 'intelligence', 'willpower', 'charisma'].forEach(function (stat) {
    config.basicStats[stat] = parseInt(safeGetInputValue("".concat(stat, "-input"))) || 0;
  });

  // Get weapon stats
  ['light', 'medium', 'heavy'].forEach(function (type) {
    config.weaponStats["".concat(type, "-wep")] = parseInt(safeGetInputValue("".concat(type, "-wep-input"))) || 0;
  });

  // Get attunement stats
  ['flamecharm', 'frostdraw', 'thundercall', 'galebreath', 'shadowcast', 'ironsing'].forEach(function (stat) {
    config.attunementStats[stat] = parseInt(safeGetInputValue("".concat(stat, "-input"))) || 0;
  });

  // Get traits
  ['vitality', 'erudition', 'proficiency', 'songchant'].forEach(function (trait) {
    config.traits[trait] = parseInt(safeGetInputValue("".concat(trait, "-input"))) || 0;
  });

  // Get boons and flaws
  config.boons[0] = safeGetInputValue('boon1-select');
  config.boons[1] = safeGetInputValue('boon2-select');
  config.flaws[0] = safeGetInputValue('flaw1-select');
  config.flaws[1] = safeGetInputValue('flaw2-select');
  return config;
}
function applyStatsTabConfiguration(statsConfig) {
  // Helper function to safely set input value
  function safeSetSelectValue(id, value) {
    var element = document.getElementById(id);
    if (element) {
      element.value = value;
    } else {
      console.warn("Element with id '".concat(id, "' not found"));
    }
  }
  // Helper function to safely set input value
  function safeSetInputValue(id, value) {
    var element = document.getElementById(id);
    if (element) {
      element.value = value;
    } else {
      console.warn("Element with id '".concat(id, "' not found"));
    }
  }

  // Set all select values
  safeSetSelectValue('race-select', statsConfig.race);
  safeSetSelectValue('bell-select', statsConfig.bell);
  safeSetSelectValue('outfit-select', statsConfig.outfit);
  safeSetSelectValue('origin-select', statsConfig.origin);
  safeSetSelectValue('murmur-select', statsConfig.murmur);
  safeSetSelectValue('oath-select', statsConfig.oath);

  // Set basic info
  safeSetInputValue('build-name', statsConfig.basicInfo.buildName);
  safeSetInputValue('build-description', statsConfig.basicInfo.buildDescription);
  safeSetInputValue('build-author', statsConfig.basicInfo.author);

  // Set basic stats
  for (var _i2 = 0, _Object$entries2 = Object.entries(statsConfig.basicStats); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
      stat = _Object$entries2$_i[0],
      value = _Object$entries2$_i[1];
    safeSetInputValue("".concat(stat, "-input"), value);
  }

  // Set weapon stats
  for (var _i3 = 0, _Object$entries3 = Object.entries(statsConfig.weaponStats); _i3 < _Object$entries3.length; _i3++) {
    var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
      type = _Object$entries3$_i[0],
      _value = _Object$entries3$_i[1];
    safeSetInputValue("".concat(type, "-input"), _value);
  }

  // Set attunement stats
  for (var _i4 = 0, _Object$entries4 = Object.entries(statsConfig.attunementStats); _i4 < _Object$entries4.length; _i4++) {
    var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
      _stat = _Object$entries4$_i[0],
      _value2 = _Object$entries4$_i[1];
    safeSetInputValue("".concat(_stat, "-input"), _value2);
  }

  // Set traits
  for (var _i5 = 0, _Object$entries5 = Object.entries(statsConfig.traits); _i5 < _Object$entries5.length; _i5++) {
    var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2),
      trait = _Object$entries5$_i[0],
      _value3 = _Object$entries5$_i[1];
    safeSetInputValue("".concat(trait, "-input"), _value3);
  }

  // Set boons and flaws
  safeSetInputValue('boon1-select', statsConfig.boons[0]);
  safeSetInputValue('boon2-select', statsConfig.boons[1]);
  safeSetInputValue('flaw1-select', statsConfig.flaws[0]);
  safeSetInputValue('flaw2-select', statsConfig.flaws[1]);
}

// Get current build configuration
function getCurrentBuildConfiguration() {
  return {
    stats: getStatsTabConfiguration(),
    talents: getTalentsTabConfiguration(),
    mantras: getMantrasTabConfiguration(),
    weapons: getWeaponsTabConfiguration(),
    summary: getSummaryTabConfiguration()
  };
}

// Apply build configuration
function applyBuildConfiguration(buildConfig) {
  applyStatsTabConfiguration(buildConfig.stats);
  applyTalentsTabConfiguration(buildConfig.talents);
  applyMantrasTabConfiguration(buildConfig.mantras);
  applyWeaponsTabConfiguration(buildConfig.weapons);
  applySummaryTabConfiguration(buildConfig.summary);

  // 重新设置 mantra 交互
  if (typeof window.setupMantraInteractions === 'function') {
    window.setupMantraInteractions();
  } else {
    console.error("setupMantraInteractions function not found");
  }
}
function getTalentsTabConfiguration() {
  return JSON.parse(JSON.stringify(window.selectedTalents));
}
function getMantrasTabConfiguration() {
  console.log("Getting mantras configuration");
  console.log("Current window.selectedMantras:", JSON.parse(JSON.stringify(window.selectedMantras)));

  // 如果 window.selectedMantras 为空，尝试从 DOM 中获取数据
  if (Object.values(window.selectedMantras).every(function (arr) {
    return arr.length === 0;
  })) {
    var obtainedMantras = {
      Combat: [],
      Mobility: [],
      Support: [],
      Wildcard: []
    };
    ['Combat', 'Mobility', 'Support', 'Wildcard'].forEach(function (category) {
      var mantras = document.querySelectorAll("#obtained-".concat(category.toLowerCase(), " li"));
      obtainedMantras[category] = Array.from(mantras).map(function (el) {
        return el.textContent.trim();
      });
    });
    console.log("Obtained mantras from DOM:", obtainedMantras);
    return obtainedMantras;
  }
  return JSON.parse(JSON.stringify(window.selectedMantras));
}
// Get weapons tab configuration
function getWeaponsTabConfiguration() {
  var weapon1 = JSON.parse(document.getElementById('weapon1').value || 'null');
  var weapon2 = JSON.parse(document.getElementById('weapon2').value || 'null');
  return {
    weapon1: weapon1 ? weapon1.name : null,
    weapon2: weapon2 ? weapon2.name : null,
    stars: parseInt(document.getElementById('stars').value) || 0,
    starType: document.getElementById('starType').value,
    attributeLevel: parseInt(document.getElementById('attributeLevel').value) || 0,
    proficiency: parseInt(document.getElementById('proficiency').value) || 0,
    additionalPenetration: parseInt(document.getElementById('additionalPenetration').value) || 0,
    bleedChance: parseInt(document.getElementById('bleedChance').value) || 0
  };
}

// Get summary tab configuration
function getSummaryTabConfiguration() {
  return document.querySelector('#summary-tab textarea').value;
}
//copy from talents.js

// Apply talents tab configuration
function applyTalentsTabConfiguration(talentsConfig) {
  window.selectedTalents = JSON.parse(JSON.stringify(talentsConfig));
  Object.keys(talentsConfig).forEach(function (category) {
    var talentElements = document.querySelectorAll("#available-talents .talent-list li[data-category=\"".concat(category, "\"]"));
    talentElements.forEach(function (el) {
      var talent = el.textContent.trim();
      if (talentsConfig[category].includes(talent)) {
        el.classList.add('text-gray-500');
        el.classList.remove('text-gray-300', 'hover:text-white');
      } else {
        el.classList.remove('text-gray-500');
        el.classList.add('text-gray-300', 'hover:text-white');
      }
    });
  });
  updateSelectedTalents();
}
function applyMantrasTabConfiguration(mantrasConfig) {
  console.log("Applying mantras configuration:", mantrasConfig);
  if (!mantrasConfig || _typeof(mantrasConfig) !== 'object') {
    console.error("Invalid mantras configuration:", mantrasConfig);
    return;
  }
  // 检查是否所有必要的类别都存在
  var requiredCategories = ['Combat', 'Mobility', 'Support', 'Wildcard'];
  for (var _i6 = 0, _requiredCategories = requiredCategories; _i6 < _requiredCategories.length; _i6++) {
    var category = _requiredCategories[_i6];
    if (!mantrasConfig.hasOwnProperty(category)) {
      console.error("Missing category in mantras configuration: ".concat(category));
      mantrasConfig[category] = [];
    }
  }

  // 清空所有已选择的 mantras
  var obtainedMantrasContainer = document.getElementById('obtained-mantras-container');
  if (!obtainedMantrasContainer) {
    console.error("obtained-mantras-container not found");
    return;
  }
  obtainedMantrasContainer.innerHTML = '';

  // 应用导入的配置
  var _loop = function _loop() {
    var _Object$entries6$_i = _slicedToArray(_Object$entries6[_i7], 2),
      category = _Object$entries6$_i[0],
      mantras = _Object$entries6$_i[1];
    if (!Array.isArray(mantras)) {
      console.error("Invalid mantras array for category ".concat(category, ":"), mantras);
      return 1; // continue
    }
    var categoryContainer = document.createElement('div');
    categoryContainer.id = "obtained-".concat(category.toLowerCase());
    categoryContainer.innerHTML = "\n            <div class=\"flex justify-between items-center mb-2\">\n                <span class=\"text-lg font-bold text-yellow-400\">".concat(category, "</span>\n                <span class=\"text-sm\"><span id=\"").concat(category.toLowerCase(), "-count\" class=\"text-white\">").concat(mantras.length, "</span>/").concat(mantraLimits[category], "</span>\n            </div>\n            <ul class=\"space-y-1\"></ul>\n        ");
    var ul = categoryContainer.querySelector('ul');
    mantras.forEach(function (mantra) {
      var li = document.createElement('li');
      li.textContent = mantra;
      li.className = 'cursor-pointer';
      li.dataset.category = category;
      li.dataset.name = mantra;
      ul.appendChild(li);
    });
    obtainedMantrasContainer.appendChild(categoryContainer);
  };
  for (var _i7 = 0, _Object$entries6 = Object.entries(mantrasConfig); _i7 < _Object$entries6.length; _i7++) {
    if (_loop()) continue;
  }

  // 更新 selectedMantras 对象
  window.selectedMantras = JSON.parse(JSON.stringify(mantrasConfig));

  // 禁用已选择的 mantras
  document.querySelectorAll('#obtainable-mantras li').forEach(function (el) {
    var category = el.dataset.category;
    var name = el.dataset.name;
    if (mantrasConfig[category] && mantrasConfig[category].includes(name)) {
      el.classList.remove('hover:text-green-400');
      el.classList.add('text-gray-500', 'opacity-50', 'cursor-not-allowed');
      el.style.pointerEvents = 'none';
    } else {
      el.classList.remove('text-gray-500', 'opacity-50', 'cursor-not-allowed');
      el.classList.add('hover:text-green-400');
      el.style.pointerEvents = 'auto';
    }
  });
  console.log("Mantras configuration applied successfully");
}

// Apply weapons tab configuration
function applyWeaponsTabConfiguration(weaponsConfig) {
  function findWeaponByName(name) {
    for (var category in weapons) {
      for (var subcategory in weapons[category]) {
        var weapon = weapons[category][subcategory].find(function (w) {
          return w.name === name;
        });
        if (weapon) return weapon;
      }
    }
    return null;
  }
  if (weaponsConfig.weapon1) {
    var weapon1 = findWeaponByName(weaponsConfig.weapon1);
    if (weapon1) document.getElementById('weapon1').value = JSON.stringify(weapon1);
  }
  if (weaponsConfig.weapon2) {
    var weapon2 = findWeaponByName(weaponsConfig.weapon2);
    if (weapon2) document.getElementById('weapon2').value = JSON.stringify(weapon2);
  }
  document.getElementById('stars').value = weaponsConfig.stars;
  document.getElementById('starType').value = weaponsConfig.starType;
  document.getElementById('attributeLevel').value = weaponsConfig.attributeLevel;
  document.getElementById('proficiency').value = weaponsConfig.proficiency;
  document.getElementById('additionalPenetration').value = weaponsConfig.additionalPenetration;
  document.getElementById('bleedChance').value = weaponsConfig.bleedChance;

  // 触发更新事件
  document.getElementById('weapon1').dispatchEvent(new Event('change'));
  document.getElementById('weapon2').dispatchEvent(new Event('change'));
  updateWeaponDetails();
  triggerDamageCalculation();
}

// Apply summary tab configuration
function applySummaryTabConfiguration(summaryConfig) {
  document.querySelector('#summary-tab textarea').value = summaryConfig;
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  loadBuildFromUrl();
  window.selectedMantras = {
    Combat: [],
    Mobility: [],
    Support: [],
    Wildcard: []
  };

  // 使用 setTimeout 来确保在 DOM 完全加载后绑定事件
  setTimeout(function () {
    console.log("Binding export button click event");
    document.querySelectorAll('.exportBuildLink').forEach(function (button) {
      button.addEventListener('click', function (event) {
        console.log("Export button clicked");
        exportBuildAsLink();
      });
    });
  }, 0);
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
},{}]},{},["C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/utils/exportURL.js"], null)
//# sourceMappingURL=/exportURL.718b6505.js.map