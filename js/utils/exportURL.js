const buildStructure = {
    stats: {
        race: "",
        basicInfo: {
            buildName: "",
            buildDescription: "",
            author: ""
        },
        basicStats: {
            strength: 0, fortitude: 0, agility: 0,
            intelligence: 0, willpower: 0, charisma: 0
        },
        attunementStats: {
            flamecharm: 0, frostdraw: 0, thundercall: 0,
            galebreath: 0, shadowcast: 0, ironsing: 0
        },
        traits: {
            vitality: 0, erudition: 0, proficiency: 0, songchant: 0
        },
        boons: ["", ""],
        flaws: ["", ""]
    },
    talents: {
        common: [], rare: [], advanced: [], oath: []
    },
    mantras: {
        combat: [], mobility: [], support: [], wisp: []
    },
    weapons: {
        weapon1: { name: "", stars: 0, starType: "" },
        weapon2: { name: "", stars: 0, starType: "" },
        attributeLevel: 0,
        proficiency: 0,
        additionalPenetration: 0,
        bleedChance: 0,
        lightWep: 0,
        mediumWep: 0,
        heavyWep: 0,
    },
    summary: ""
};

// Encoding function
function encodeBuild(build) {
    const jsonString = JSON.stringify(build);
    return LZString.compressToEncodedURIComponent(jsonString);
}

// Decoding function
function decodeBuild(encodedString) {
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedString);
    return JSON.parse(decompressed);
}

// Export build as link
function exportBuildAsLink() {
    const currentBuild = getCurrentBuildConfiguration();
    
    const encodedBuild = encodeBuild(currentBuild);
    const url = `${window.location.origin}${window.location.pathname}?build=${encodedBuild}`;

    window.history.pushState({}, '', url);

    const message = 'Build link generated. You can copy the current URL to share your build.';
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            alert(message + '\nLink copied to clipboard.');
        });
    } else {
        alert(message);
    }
    console.log("url is:"+url)
}

function loadBuildFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedBuild = urlParams.get('build');
  
    if (encodedBuild) {
      try {
        const buildConfig = decodeBuild(encodedBuild);
        applyBuildConfiguration(buildConfig);
        // 更新 selectedTalents 对象
        window.selectedTalents = buildConfig.talents;
        window.updateSelectedTalents();
      } catch (error) {
        console.error('Failed to load build from URL:', error);
        alert('Unable to load build configuration. The link may be invalid or corrupted.');
      }
    }
}


function getStatsTabConfiguration() {
    const config = {
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
    const element = document.getElementById(id);
    return element ? element.value : '';
  }
    // Helper function to safely get input value
function safeGetInputValue(id) {
    const element = document.getElementById(id);
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
    ['strength', 'fortitude', 'agility', 'intelligence', 'willpower', 'charisma'].forEach(stat => {
        config.basicStats[stat] = parseInt(safeGetInputValue(`${stat}-input`)) || 0;
    });

    // Get weapon stats
    ['light', 'medium', 'heavy'].forEach(type => {
        config.weaponStats[`${type}Wep`] = parseInt(safeGetInputValue(`${type}-wep-input`)) || 0;
    });

    // Get attunement stats
    ['flamecharm', 'frostdraw', 'thundercall', 'galebreath', 'shadowcast', 'ironsing'].forEach(stat => {
        config.attunementStats[stat] = parseInt(safeGetInputValue(`${stat}-input`)) || 0;
    });

    // Get traits
    ['vitality', 'erudition', 'proficiency', 'songchant'].forEach(trait => {
        config.traits[trait] = parseInt(safeGetInputValue(`${trait}-input`)) || 0;
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
        const element = document.getElementById(id);
        if (element) {
          element.value = value;
        } else {
          console.warn(`Element with id '${id}' not found`);
        }
    }
        // Helper function to safely set input value
    function safeSetInputValue(id, value) {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            } else {
                console.warn(`Element with id '${id}' not found`);
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
    for (const [stat, value] of Object.entries(statsConfig.basicStats)) {
        safeSetInputValue(`${stat}-input`, value);
    }

    // Set weapon stats
    for (const [type, value] of Object.entries(statsConfig.weaponStats)) {
        safeSetInputValue(`${type}-input`, value);
    }

    // Set attunement stats
    for (const [stat, value] of Object.entries(statsConfig.attunementStats)) {
        safeSetInputValue(`${stat}-input`, value);
    }

    // Set traits
    for (const [trait, value] of Object.entries(statsConfig.traits)) {
        safeSetInputValue(`${trait}-input`, value);
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
}



function getTalentsTabConfiguration() {
    const config = { common: [], rare: [], advanced: [], oath: [] };
    ['common', 'rare', 'advanced', 'oath'].forEach(category => {
        const elements = document.querySelectorAll(`#talents-tab .${category}-talents li.text-gray-500`);
        config[category] = Array.from(elements).map(el => el.textContent.trim());
    });
    return config;
}

function getMantrasTabConfiguration() {
    const config = { combat: [], mobility: [], support: [], wisp: [] };
    const categories = { combat: '#obtained-combat', mobility: '#obtained-mobility', support: '#obtained-support', wisp: '#obtained-wildcard' };
    for (const [category, selector] of Object.entries(categories)) {
        const elements = document.querySelectorAll(`${selector} li`);
        config[category] = Array.from(elements).map(el => el.textContent.trim());
    }
    return config;
}

// Get weapons tab configuration
function getWeaponsTabConfiguration() {
    return {
        weapon1: {
            name: document.getElementById('weapon1').value,
            stars: parseInt(document.getElementById('stars').value) || 0,
            starType: document.getElementById('starType').value
        },
        weapon2: {
            name: document.getElementById('weapon2').value,
            stars: parseInt(document.getElementById('stars').value) || 0,
            starType: document.getElementById('starType').value
        },
        attributeLevel: parseInt(document.getElementById('attributeLevel').value) || 0,
        proficiency: parseInt(document.getElementById('proficiency').value) || 0,
        additionalPenetration: parseInt(document.getElementById('additionalPenetration').value) || 0,
        bleedChance: parseInt(document.getElementById('bleedChance').value) || 0,
        lightWep: parseInt(document.getElementById('light-wep-input').value) || 0,
        mediumWep: parseInt(document.getElementById('medium-wep-input').value) || 0,
        heavyWep: parseInt(document.getElementById('heavy-wep-input').value) || 0
    };
}

// Get summary tab configuration
function getSummaryTabConfiguration() {
    return document.querySelector('#summary-tab textarea').value;
}
//copy from talents.js
function updateSelectedTalents() {
    const selectedTalentsDiv = document.getElementById('selected-talents');
    const categories = ['Common', 'Rare', 'Advanced', 'Oath'];
    const colors = ['blue', 'purple', 'green', 'yellow'];
    
    let innerHTML = `
      <h3 class="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2">Selected Talents</h3>
      <div class="space-y-4">
    `;
  
    categories.forEach((category, index) => {
      const talents = selectedTalents[category] || [];
      innerHTML += `
        <div class="talent-category">
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-semibold text-gray-300">${category}</span>
            <span class="text-lg font-bold text-${colors[index]}-400">${talents.length}</span>
          </div>
          <ul class="list-disc list-inside text-gray-400 space-y-1">
            ${talents.map(talent => `<li>${talent}</li>`).join('')}
          </ul>
        </div>
      `;
    });
  
    innerHTML += '</div>';
    selectedTalentsDiv.innerHTML = innerHTML;
  }

// Apply talents tab configuration
function applyTalentsTabConfiguration(talentsConfig) {
    Object.keys(talentsConfig).forEach(category => {
      const talentElements = document.querySelectorAll(`#talents-tab .${category.toLowerCase()}-talents li`);
      talentElements.forEach(el => {
        const talent = el.textContent.trim();
        if (talentsConfig[category].includes(talent)) {
          el.classList.add('text-gray-500');
          el.classList.remove('text-gray-300', 'hover:text-white');
          if (!window.selectedTalents[category]) {
            window.selectedTalents[category] = [];
          }
          if (!window.selectedTalents[category].includes(talent)) {
            window.selectedTalents[category].push(talent);
          }
        } else {
          el.classList.remove('text-gray-500');
          el.classList.add('text-gray-300', 'hover:text-white');
          if (window.selectedTalents[category]) {
            const index = window.selectedTalents[category].indexOf(talent);
            if (index > -1) {
              window.selectedTalents[category].splice(index, 1);
            }
          }
        }
      });
    });
    window.updateSelectedTalents();
  }


function applyMantrasTabConfiguration(mantrasConfig) {
    const mantraCategories = {
        combat: '#obtained-combat',
        mobility: '#obtained-mobility',
        support: '#obtained-support',
        wisp: '#obtained-wildcard'
    };

    for (const [category, selector] of Object.entries(mantraCategories)) {
        const containerElement = document.querySelector(`${selector} ul`);
        const countElement = document.getElementById(`${category}-count`);
        
        if (containerElement) {
            containerElement.innerHTML = '';
            mantrasConfig[category].forEach(mantra => {
                const li = document.createElement('li');
                li.textContent = mantra;
                li.className = 'text-green-400 cursor-pointer';
                containerElement.appendChild(li);
            });
        }

        if (countElement) {
            countElement.textContent = mantrasConfig[category].length;
        }
    }
}

// Apply weapons tab configuration
function applyWeaponsTabConfiguration(weaponsConfig) {
    document.getElementById('weapon1').value = weaponsConfig.weapon1.name;
    document.getElementById('weapon2').value = weaponsConfig.weapon2.name;
    document.getElementById('stars').value = weaponsConfig.weapon1.stars;
    document.getElementById('starType').value = weaponsConfig.weapon1.starType;
    document.getElementById('attributeLevel').value = weaponsConfig.attributeLevel;
    document.getElementById('proficiency').value = weaponsConfig.proficiency;
    document.getElementById('additionalPenetration').value = weaponsConfig.additionalPenetration;
    document.getElementById('bleedChance').value = weaponsConfig.bleedChance;
    document.getElementById('light-wep-input').value = weaponsConfig.lightWep;
    document.getElementById('medium-wep-input').value = weaponsConfig.mediumWep;
    document.getElementById('heavy-wep-input').value = weaponsConfig.heavyWep;
}

// Apply summary tab configuration
function applySummaryTabConfiguration(summaryConfig) {
    document.querySelector('#summary-tab textarea').value = summaryConfig;
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadBuildFromUrl();
    document.querySelectorAll('.exportBuildLink').forEach(button => {
        button.addEventListener('click', exportBuildAsLink);
    });
    console.log("exportBuildAsLink listeners added");
});