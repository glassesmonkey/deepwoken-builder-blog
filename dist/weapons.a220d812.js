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
})({"js/builder/weapons.js":[function(require,module,exports) {
var weapons = {};
function updateWeaponSelection(weaponId, weaponData) {
  var select = document.getElementById(weaponId);
  if (select && weaponData) {
    for (var i = 0; i < select.options.length; i++) {
      var option = select.options[i];
      if (option.value && JSON.parse(option.value).name === weaponData.name) {
        select.selectedIndex = i;
        break;
      }
    }
  }
}
function initializeWeaponsTab() {
  return new Promise(function (resolve, reject) {
    fetch('./js/builder/weapons.json').then(function (response) {
      return response.json();
    }).then(function (data) {
      parseWeaponsData(JSON.stringify(data));
      addWeaponEventListeners();
      applyWeaponCategoryStyle();
      resolve();
    }).catch(function (error) {
      console.error('Error loading weapons data:', error);
      reject(error);
    });
  });
}
function applyWeaponCategoryStyle() {
  var selects = document.querySelectorAll('#weapon1, #weapon2');
  selects.forEach(function (select) {
    var optgroups = select.querySelectorAll('optgroup');
    optgroups.forEach(function (optgroup) {
      if (optgroup.label.startsWith('Light Weapons - Daggers')) {
        optgroup.style.color = '#ffd700';
      } else {
        optgroup.style.color = '#ffd700';
      }
      optgroup.style.fontWeight = 'bold';
      var options = optgroup.querySelectorAll('option');
      options.forEach(function (option) {
        option.style.color = '#F9F6EE';
        option.style.fontWeight = '';
      });
    });
  });
}
function parseWeaponsData(jsonData) {
  weapons = JSON.parse(jsonData);
  populateWeaponSelects();
}
function populateWeaponSelects() {
  var selects = ['weapon1', 'weapon2'];
  selects.forEach(function (selectId) {
    var select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Select a weapon</option>';
    Object.keys(weapons).forEach(function (category) {
      Object.keys(weapons[category]).forEach(function (subcategory) {
        var optgroup = document.createElement('optgroup');
        optgroup.label = "".concat(category, " - ").concat(subcategory);
        weapons[category][subcategory].forEach(function (weapon) {
          var option = document.createElement('option');
          option.value = JSON.stringify(weapon);
          option.textContent = weapon.name;
          optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
      });
    });
  });
  applyWeaponCategoryStyle();
}
function displayWeaponDetails(weapon1, weapon2) {
  var detailsDiv = document.getElementById('weaponDetails');
  var html = "\n        <h3 class=\"font-bold text-lg mb-2 text-yellow-400\">Weapon Details</h3>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n            <div>\n                <h4 class=\"font-bold text-white\">".concat(weapon1.name, "</h4>\n                <p><strong>Requirements:</strong> ").concat(weapon1.requirements, "</p>\n                <p><strong>Damage:</strong> ").concat(weapon1.damage, "</p>\n                <p><strong>Penetration:</strong> ").concat(weapon1.penetration, "</p>\n                <p><strong>Chip Damage:</strong> ").concat(weapon1.chip_damage, "</p>\n                <p><strong>Scaling:</strong> ").concat(weapon1.scaling, "</p>\n                <p><strong>Weight:</strong> ").concat(weapon1.weight, "</p>\n                <p><strong>Range:</strong> ").concat(weapon1.range, "</p>\n                <p><strong>Swing Speed:</strong> ").concat(weapon1.swing_speed, "</p>\n                <p><strong>Scaled Damage:</strong> ").concat(weapon1.scaled_damage, "</p>\n            </div>");
  if (weapon2) {
    html += "\n            <div>\n                <h4 class=\"font-bold text-white\">".concat(weapon2.name, "</h4>\n                <p><strong>Requirements:</strong> ").concat(weapon2.requirements, "</p>\n                <p><strong>Damage:</strong> ").concat(weapon2.damage, "</p>\n                <p><strong>Penetration:</strong> ").concat(weapon2.penetration, "</p>\n                <p><strong>Chip Damage:</strong> ").concat(weapon2.chip_damage, "</p>\n                <p><strong>Scaling:</strong> ").concat(weapon2.scaling, "</p>\n                <p><strong>Weight:</strong> ").concat(weapon2.weight, "</p>\n                <p><strong>Range:</strong> ").concat(weapon2.range, "</p>\n                <p><strong>Swing Speed:</strong> ").concat(weapon2.swing_speed, "</p>\n                <p><strong>Scaled Damage:</strong> ").concat(weapon2.scaled_damage, "</p>\n            </div>");
  }
  html += "</div>";
  detailsDiv.innerHTML = html;
  detailsDiv.classList.remove('hidden');
}
function updateWeaponDetails() {
  var weapon1 = JSON.parse(document.getElementById('weapon1').value || 'null');
  var weapon2 = JSON.parse(document.getElementById('weapon2').value || 'null');
  if (weapon1) {
    displayWeaponDetails(weapon1, weapon2);
  } else {
    document.getElementById('weaponDetails').classList.add('hidden');
  }
}
function calculateDamage(weapon, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance) {
  var baseDamage = parseFloat(weapon.damage);
  var penetration = parseFloat(weapon.penetration) || 0;
  var weight = parseFloat(weapon.weight);
  if (starType === 'damage') {
    baseDamage *= 1 + 0.02 * stars;
  } else if (starType === 'penetration') {
    penetration += Math.min(5 * stars, 14);
  } else if (starType === 'weight') {
    weight *= 1 + 0.04 * stars;
  }
  var scalingMatch = weapon.scaling.match(/(\w+):\s*(\d+(\.\d+)?)/);
  var scalingAttribute = scalingMatch ? scalingMatch[1] : '';
  var scalingValue = scalingMatch ? parseFloat(scalingMatch[2]) : 0;
  var scaledDamage = 0.00075 * (baseDamage * scalingValue * attributeLevel * (1 + proficiency * 0.065)) + baseDamage;
  penetration = Math.min(penetration + additionalPenetration, 50);
  var effectiveDamage = scaledDamage * (1 + penetration / 100);
  var bleedDamage = effectiveDamage * 0.3 * (bleedChance / 100);
  var totalDamage = effectiveDamage + bleedDamage;
  var dps = totalDamage * parseFloat(weapon.swing_speed) * 2;
  return {
    weapon: weapon.name,
    baseDamage: baseDamage,
    scaledDamage: scaledDamage,
    effectiveDamage: effectiveDamage,
    bleedDamage: bleedDamage,
    totalDamage: totalDamage,
    dps: dps,
    penetration: penetration,
    weight: weight,
    swingSpeed: weapon.swing_speed
  };
}
function displayResult(result1, result2) {
  var resultDiv = document.getElementById('result');
  var html = "\n        <h2 class=\"font-bold text-xl mb-2 text-yellow-400\">Results:</h2>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n            <div>\n                <h3 class=\"font-bold text-lg text-white\">".concat(result1.weapon, "</h3>\n                <p><strong>Base Damage:</strong> ").concat(result1.baseDamage.toFixed(2), "</p>\n                <p><strong>Scaled Damage:</strong> ").concat(result1.scaledDamage.toFixed(2), "</p>\n                <p><strong>Effective Damage:</strong> ").concat(result1.effectiveDamage.toFixed(2), "</p>\n                <p><strong>Bleed Damage:</strong> ").concat(result1.bleedDamage.toFixed(2), "</p>\n                <p><strong>Total Damage:</strong> ").concat(result1.totalDamage.toFixed(2), "</p>\n                <p><strong>DPS:</strong> ").concat(result1.dps.toFixed(2), "</p>\n                <p><strong>Penetration:</strong> ").concat(result1.penetration.toFixed(2), "%</p>\n                <p><strong>Weight:</strong> ").concat(result1.weight.toFixed(2), "</p>\n                <p><strong>Swing Speed:</strong> ").concat(result1.swingSpeed, "x</p>\n            </div>\n    ");
  if (result2) {
    html += "\n            <div>\n                <h3 class=\"font-bold text-lg text-white\">".concat(result2.weapon, "</h3>\n                <p><strong>Base Damage:</strong> ").concat(result2.baseDamage.toFixed(2), "</p>\n                <p><strong>Scaled Damage:</strong> ").concat(result2.scaledDamage.toFixed(2), "</p>\n                <p><strong>Effective Damage:</strong> ").concat(result2.effectiveDamage.toFixed(2), "</p>\n                <p><strong>Bleed Damage:</strong> ").concat(result2.bleedDamage.toFixed(2), "</p>\n                <p><strong>Total Damage:</strong> ").concat(result2.totalDamage.toFixed(2), "</p>\n                <p><strong>DPS:</strong> ").concat(result2.dps.toFixed(2), "</p>\n                <p><strong>Penetration:</strong> ").concat(result2.penetration.toFixed(2), "%</p>\n                <p><strong>Weight:</strong> ").concat(result2.weight.toFixed(2), "</p>\n                <p><strong>Swing Speed:</strong> ").concat(result2.swingSpeed, "x</p>\n            </div>\n        ");
  }
  html += "</div>";
  resultDiv.innerHTML = html;
  resultDiv.classList.remove('hidden');
}
function updateChart(result1, result2) {
  var ctx = document.getElementById('damageChart').getContext('2d');
  if (window.damageChart instanceof Chart) {
    window.damageChart.destroy();
  }
  var datasets = [{
    label: result1.weapon,
    data: [result1.baseDamage, result1.scaledDamage, result1.effectiveDamage, result1.bleedDamage, result1.totalDamage, result1.dps],
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  }];
  if (result2) {
    datasets.push({
      label: result2.weapon,
      data: [result2.baseDamage, result2.scaledDamage, result2.effectiveDamage, result2.bleedDamage, result2.totalDamage, result2.dps],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    });
  }
  window.damageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Base Damage', 'Scaled Damage', 'Effective Damage', 'Bleed Damage', 'Total Damage', 'DPS'],
      datasets: datasets
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'white'
          }
        },
        x: {
          ticks: {
            color: 'white'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'white'
          }
        }
      }
    }
  });
}
function addWeaponEventListeners() {
  document.getElementById('weapon1').addEventListener('change', updateWeaponDetails);
  document.getElementById('weapon2').addEventListener('change', updateWeaponDetails);
  document.getElementById('calculateDamage').addEventListener('click', function (e) {
    e.preventDefault();
    var weapon1 = JSON.parse(document.getElementById('weapon1').value || 'null');
    var weapon2 = JSON.parse(document.getElementById('weapon2').value || 'null');
    var attributeLevel = parseInt(document.getElementById('attributeLevel').value);
    var proficiency = parseInt(document.getElementById('proficiency').value);
    var stars = parseInt(document.getElementById('stars').value);
    var starType = document.getElementById('starType').value;
    var additionalPenetration = parseInt(document.getElementById('additionalPenetration').value) || 0;
    var bleedChance = parseInt(document.getElementById('bleedChance').value) || 0;
    if (weapon1 && !isNaN(attributeLevel) && !isNaN(proficiency)) {
      var result1 = calculateDamage(weapon1, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance);
      var result2 = null;
      if (weapon2) {
        result2 = calculateDamage(weapon2, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance);
      }
      displayResult(result1, result2);
      updateChart(result1, result2);
    }
  });
}
var exampleWeaponsData = "\n{\n    \"Light Weapons\": {\n        \"Daggers\": [\n            {\n                \"name\": \"Stiletto\",\n                \"requirements\": \"0 LHT\",\n                \"damage\": \"11\",\n                \"penetration\": \"N/A\",\n                \"chip_damage\": \"N/A\",\n                \"scaling\": \"LHT: 3\",\n                \"weight\": \"2\",\n                \"range\": \"6\",\n                \"swing_speed\": \"1.25x\",\n                \"scaled_damage\": \"14.4\"\n            },\n            {\n                \"name\": \"Gilded Knife\",\n                \"requirements\": \"25 LHT\",\n                \"damage\": \"13\",\n                \"penetration\": \"N/A\",\n                \"chip_damage\": \"N/A\",\n                \"scaling\": \"LHT: 8\",\n                \"weight\": \"4\",\n                \"range\": \"6\",\n                \"swing_speed\": \"1.23x\",\n                \"scaled_damage\": \"23.8\"\n            }\n        ],\n        \"Fists\": [\n            {\n                \"name\": \"Iron Cestus\",\n                \"requirements\": \"0 LHT\",\n                \"damage\": \"13.5\",\n                \"penetration\": \"N/A\",\n                \"chip_damage\": \"N/A\",\n                \"scaling\": \"LHT: 7\",\n                \"weight\": \"5\",\n                \"range\": \"6\",\n                \"swing_speed\": \"1.11x\",\n                \"scaled_damage\": \"23.4\"\n            }\n        ]\n    },\n    \"Medium Weapons\": {\n        \"Swords\": [\n            {\n                \"name\": \"Sword\",\n                \"requirements\": \"0 MED\",\n                \"damage\": \"18\",\n                \"penetration\": \"N/A\",\n                \"chip_damage\": \"N/A\",\n                \"scaling\": \"MED: 2.5\",\n                \"weight\": \"5\",\n                \"range\": \"8\",\n                \"swing_speed\": \"1x\",\n                \"scaled_damage\": \"22.7\"\n            }\n        ],\n        \"Spears\": [\n            {\n                \"name\": \"Irontusk\",\n                \"requirements\": \"0 MED\",\n                \"damage\": \"16.5\",\n                \"penetration\": \"10%\",\n                \"chip_damage\": \"N/A\",\n                \"scaling\": \"MED: 3\",\n                \"weight\": \"5\",\n                \"range\": \"9\",\n                \"swing_speed\": \"0.9x\",\n                \"scaled_damage\": \"21.7\"\n            }\n        ]\n    }\n}";
function updateChart(result1, result2) {
  var ctx = document.getElementById('damageChart').getContext('2d');
  if (window.damageChart instanceof Chart) {
    window.damageChart.destroy();
  }
  var datasets = [{
    label: result1.weapon,
    data: [result1.baseDamage, result1.scaledDamage, result1.effectiveDamage, result1.bleedDamage, result1.totalDamage, result1.dps],
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  }];
  if (result2) {
    datasets.push({
      label: result2.weapon,
      data: [result2.baseDamage, result2.scaledDamage, result2.effectiveDamage, result2.bleedDamage, result2.totalDamage, result2.dps],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    });
  }
  window.damageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Base Damage', 'Scaled Damage', 'Effective Damage', 'Bleed Damage', 'Total Damage', 'DPS'],
      datasets: datasets
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'rgba(255, 255, 255, 1)',
          bodyColor: 'rgba(255, 255, 255, 0.8)'
        }
      }
    }
  });
}
function addWeaponEventListeners() {
  document.getElementById('weapon1').addEventListener('change', updateWeaponDetails);
  document.getElementById('weapon2').addEventListener('change', updateWeaponDetails);
  document.getElementById('calculateDamage').addEventListener('click', function (e) {
    e.preventDefault();
    var weapon1 = JSON.parse(document.getElementById('weapon1').value || 'null');
    var weapon2 = JSON.parse(document.getElementById('weapon2').value || 'null');
    var attributeLevel = parseInt(document.getElementById('attributeLevel').value);
    var proficiency = parseInt(document.getElementById('proficiency').value);
    var stars = parseInt(document.getElementById('stars').value);
    var starType = document.getElementById('starType').value;
    var additionalPenetration = parseInt(document.getElementById('additionalPenetration').value) || 0;
    var bleedChance = parseInt(document.getElementById('bleedChance').value) || 0;
    if (weapon1 && !isNaN(attributeLevel) && !isNaN(proficiency)) {
      var result1 = calculateDamage(weapon1, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance);
      var result2 = null;
      if (weapon2) {
        result2 = calculateDamage(weapon2, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance);
      }
      displayResult(result1, result2);
      updateChart(result1, result2);
      var chartElement = document.getElementById('damageChart');
      if (chartElement) {
        setTimeout(function () {
          chartElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }
    }
  });
}
window.triggerDamageCalculation = function () {
  var calculateDamageButton = document.getElementById('calculateDamage');
  if (calculateDamageButton) {
    calculateDamageButton.click();
  }
};
document.addEventListener('DOMContentLoaded', function () {
  initializeWeaponsTab();
  loadBuildFromUrl();
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
},{}]},{},["C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/builder/weapons.js"], null)
//# sourceMappingURL=/weapons.a220d812.js.map