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

    // 尝试使用 Clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            alert(message + '\nLink copied to clipboard.');
        }).catch(() => {
            // 如果 Clipboard API 失败，使用备选方法
            fallbackCopy(url, message);
        });
    } else {
        // 如果不支持 Clipboard API，直接使用备选方法
        fallbackCopy(url, message);
    }
}

function fallbackCopy(text, message) {
    // 创建一个临时的文本区域
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);

    try {
        // 选中文本并尝试复制
        textArea.select();
        const successful = document.execCommand('copy');
        if (successful) {
            alert(message + '\nLink copied to clipboard.');
        } else {
            throw new Error('Copy failed');
        }
    } catch (err) {
        // 如果复制失败，显示 URL 给用户
        alert(message + '\nUnable to copy automatically. Please copy this URL manually:\n\n' + text);
    } finally {
        // 清理
        document.body.removeChild(textArea);
    }
}

function loadBuildFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedBuild = urlParams.get('build');
  
    if (encodedBuild) {
        try {
            const buildConfig = decodeBuild(encodedBuild);
            
            initializeWeaponsTab().then(() => {
                applyBuildConfiguration(buildConfig);
                window.selectedTalents = buildConfig.talents;
                updateSelectedTalents();
                
                triggerDamageCalculation();
            }).catch(error => {
                console.error('Failed to initialize weapons tab:', error);
            });
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
    return JSON.parse(JSON.stringify(window.selectedTalents));
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
    const weapon1 = JSON.parse(document.getElementById('weapon1').value || 'null');
    const weapon2 = JSON.parse(document.getElementById('weapon2').value || 'null');
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
    
    Object.keys(talentsConfig).forEach(category => {
        const talentElements = document.querySelectorAll(`#available-talents .talent-list li[data-category="${category}"]`);
        talentElements.forEach(el => {
            const talent = el.textContent.trim();
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
    function findWeaponByName(name) {
        for (const category in weapons) {
            for (const subcategory in weapons[category]) {
                const weapon = weapons[category][subcategory].find(w => w.name === name);
                if (weapon) return weapon;
            }
        }
        return null;
    }

    if (weaponsConfig.weapon1) {
        const weapon1 = findWeaponByName(weaponsConfig.weapon1);
        if (weapon1) document.getElementById('weapon1').value = JSON.stringify(weapon1);
    }
    if (weaponsConfig.weapon2) {
        const weapon2 = findWeaponByName(weaponsConfig.weapon2);
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
document.addEventListener('DOMContentLoaded', function() {
    loadBuildFromUrl();
    document.querySelectorAll('.exportBuildLink').forEach(button => {
        button.addEventListener('click', exportBuildAsLink);
    });
});