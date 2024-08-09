
let weapons = {};

function initializeWeaponSearch() {
    const weaponPairs = [
        { search: document.getElementById('weapon1-search'), select: document.getElementById('weapon1') },
        { search: document.getElementById('weapon2-search'), select: document.getElementById('weapon2') }
    ];

    weaponPairs.forEach(pair => {
        pair.search.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            Array.from(pair.select.options).forEach(option => {
                const weaponName = option.textContent.toLowerCase();
                if (weaponName.includes(searchTerm)) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            });

            pair.select.style.display = 'block';
            pair.select.size = 5;
        });

        pair.select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            pair.search.value = selectedOption.textContent;
            this.size = 1;
            this.style.display = '';
        });

        document.addEventListener('click', function(event) {
            if (!pair.search.contains(event.target) && !pair.select.contains(event.target)) {
                pair.select.size = 1;
                pair.select.style.display = '';
            }
        });
    });
}

function updateWeaponSelection(weaponId, weaponData) {
    const select = document.getElementById(weaponId);
    if (select && weaponData) {
        for (let i = 0; i < select.options.length; i++) {
            const option = select.options[i];
            if (option.value && JSON.parse(option.value).name === weaponData.name) {
                select.selectedIndex = i;
                break;
            }
        }
    }
}

// ... (rest of the code remains the same)
function initializeWeaponsTab() {
    return new Promise((resolve, reject) => {
        fetch('./js/builder/weapons.json')
            .then(response => response.json())
            .then(data => {
                parseWeaponsData(JSON.stringify(data));
                addWeaponEventListeners();
                applyWeaponCategoryStyle();
                resolve();
            })
            .catch(error => {
                console.error('Error loading weapons data:', error);
                reject(error);
            });
    });
}

function applyWeaponCategoryStyle() {
    const selects = document.querySelectorAll('#weapon1, #weapon2');
    selects.forEach(select => {
        const optgroups = select.querySelectorAll('optgroup');
        optgroups.forEach(optgroup => {
            if (optgroup.label.startsWith('Light Weapons - Daggers')) {
                optgroup.style.color = '#ffd700';
            } else {
                optgroup.style.color = '#ffd700';
            }
            optgroup.style.fontWeight = 'bold';

            const options = optgroup.querySelectorAll('option');
            options.forEach(option => {
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
    const selects = ['weapon1', 'weapon2'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select a weapon</option>';
        Object.keys(weapons).forEach(category => {
            Object.keys(weapons[category]).forEach(subcategory => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = `${category} - ${subcategory}`;
                weapons[category][subcategory].forEach(weapon => {
                    const option = document.createElement('option');
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
    const detailsDiv = document.getElementById('weaponDetails');
    let html = `
        <h3 class="font-bold text-lg mb-2 text-yellow-400">Weapon Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 class="font-bold text-white">${weapon1.name}</h4>
                <p><strong>Requirements:</strong> ${weapon1.requirements}</p>
                <p><strong>Damage:</strong> ${weapon1.damage}</p>
                <p><strong>Penetration:</strong> ${weapon1.penetration}</p>
                <p><strong>Chip Damage:</strong> ${weapon1.chip_damage}</p>
                <p><strong>Scaling:</strong> ${weapon1.scaling}</p>
                <p><strong>Weight:</strong> ${weapon1.weight}</p>
                <p><strong>Range:</strong> ${weapon1.range}</p>
                <p><strong>Swing Speed:</strong> ${weapon1.swing_speed}</p>
                <p><strong>Scaled Damage:</strong> ${weapon1.scaled_damage}</p>
            </div>`;

    if (weapon2) {
        html += `
            <div>
                <h4 class="font-bold text-white">${weapon2.name}</h4>
                <p><strong>Requirements:</strong> ${weapon2.requirements}</p>
                <p><strong>Damage:</strong> ${weapon2.damage}</p>
                <p><strong>Penetration:</strong> ${weapon2.penetration}</p>
                <p><strong>Chip Damage:</strong> ${weapon2.chip_damage}</p>
                <p><strong>Scaling:</strong> ${weapon2.scaling}</p>
                <p><strong>Weight:</strong> ${weapon2.weight}</p>
                <p><strong>Range:</strong> ${weapon2.range}</p>
                <p><strong>Swing Speed:</strong> ${weapon2.swing_speed}</p>
                <p><strong>Scaled Damage:</strong> ${weapon2.scaled_damage}</p>
            </div>`;
    }

    html += `</div>`;
    detailsDiv.innerHTML = html;
    detailsDiv.classList.remove('hidden');
}

function updateWeaponDetails() {
    const weapon1 = JSON.parse(document.getElementById('weapon1').value || 'null');
    const weapon2 = JSON.parse(document.getElementById('weapon2').value || 'null');
    if (weapon1) {
        displayWeaponDetails(weapon1, weapon2);
    } else {
        document.getElementById('weaponDetails').classList.add('hidden');
    }
}

function calculateDamage(weapon, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance) {
    let baseDamage = parseFloat(weapon.damage);
    let penetration = parseFloat(weapon.penetration) || 0;
    let weight = parseFloat(weapon.weight);

    if (starType === 'damage') {
        baseDamage *= (1 + 0.02 * stars);
    } else if (starType === 'penetration') {
        penetration += Math.min(5 * stars, 14);
    } else if (starType === 'weight') {
        weight *= (1 + 0.04 * stars);
    }

    const scalingMatch = weapon.scaling.match(/(\w+):\s*(\d+(\.\d+)?)/);
    const scalingAttribute = scalingMatch ? scalingMatch[1] : '';
    const scalingValue = scalingMatch ? parseFloat(scalingMatch[2]) : 0;
    const scaledDamage = 0.00075 * (baseDamage * scalingValue * attributeLevel * (1 + (proficiency * 0.065))) + baseDamage;

    penetration = Math.min(penetration + additionalPenetration, 50); const effectiveDamage = scaledDamage * (1 + penetration / 100);

    const bleedDamage = effectiveDamage * 0.3 * (bleedChance / 100);
    const totalDamage = effectiveDamage + bleedDamage;
    const dps = totalDamage * parseFloat(weapon.swing_speed) * 2;

    return {
        weapon: weapon.name,
        baseDamage,
        scaledDamage,
        effectiveDamage,
        bleedDamage,
        totalDamage,
        dps,
        penetration,
        weight,
        swingSpeed: weapon.swing_speed
    };
}

function displayResult(result1, result2) {
    const resultDiv = document.getElementById('result');
    let html = `
        <h2 class="font-bold text-xl mb-2 text-yellow-400">Results:</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 class="font-bold text-lg text-white">${result1.weapon}</h3>
                <p><strong>Base Damage:</strong> ${result1.baseDamage.toFixed(2)}</p>
                <p><strong>Scaled Damage:</strong> ${result1.scaledDamage.toFixed(2)}</p>
                <p><strong>Effective Damage:</strong> ${result1.effectiveDamage.toFixed(2)}</p>
                <p><strong>Bleed Damage:</strong> ${result1.bleedDamage.toFixed(2)}</p>
                <p><strong>Total Damage:</strong> ${result1.totalDamage.toFixed(2)}</p>
                <p><strong>DPS:</strong> ${result1.dps.toFixed(2)}</p>
                <p><strong>Penetration:</strong> ${result1.penetration.toFixed(2)}%</p>
                <p><strong>Weight:</strong> ${result1.weight.toFixed(2)}</p>
                <p><strong>Swing Speed:</strong> ${result1.swingSpeed}x</p>
            </div>
    `;
    if (result2) {
        html += `
            <div>
                <h3 class="font-bold text-lg text-white">${result2.weapon}</h3>
                <p><strong>Base Damage:</strong> ${result2.baseDamage.toFixed(2)}</p>
                <p><strong>Scaled Damage:</strong> ${result2.scaledDamage.toFixed(2)}</p>
                <p><strong>Effective Damage:</strong> ${result2.effectiveDamage.toFixed(2)}</p>
                <p><strong>Bleed Damage:</strong> ${result2.bleedDamage.toFixed(2)}</p>
                <p><strong>Total Damage:</strong> ${result2.totalDamage.toFixed(2)}</p>
                <p><strong>DPS:</strong> ${result2.dps.toFixed(2)}</p>
                <p><strong>Penetration:</strong> ${result2.penetration.toFixed(2)}%</p>
                <p><strong>Weight:</strong> ${result2.weight.toFixed(2)}</p>
                <p><strong>Swing Speed:</strong> ${result2.swingSpeed}x</p>
            </div>
        `;
    }
    html += `</div>`;
    resultDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
}

function loadChartJS() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

function addWeaponEventListeners() {
    document.getElementById('weapon1').addEventListener('change', updateWeaponDetails);
    document.getElementById('weapon2').addEventListener('change', updateWeaponDetails);

    document.getElementById('calculateDamage').addEventListener('click', function (e) {
        e.preventDefault();

        const weapon1 = JSON.parse(document.getElementById('weapon1').value || 'null');
        const weapon2 = JSON.parse(document.getElementById('weapon2').value || 'null');
        const attributeLevel = parseInt(document.getElementById('attributeLevel').value);
        const proficiency = parseInt(document.getElementById('proficiency').value);
        const stars = parseInt(document.getElementById('stars').value);
        const starType = document.getElementById('starType').value;
        const additionalPenetration = parseInt(document.getElementById('additionalPenetration').value) || 0;
        const bleedChance = parseInt(document.getElementById('bleedChance').value) || 0;

        if (weapon1 && !isNaN(attributeLevel) && !isNaN(proficiency)) {
            const result1 = calculateDamage(weapon1, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance);
            let result2 = null;
            if (weapon2) {
                result2 = calculateDamage(weapon2, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance);
            }
            displayResult(result1, result2);
            updateChart(result1, result2);
        }
    });
}




async function updateChart(result1, result2) {
    await loadChartJS();
    const ctx = document.getElementById('damageChart').getContext('2d');

    if (window.damageChart instanceof Chart) {
        window.damageChart.destroy();
    }

    const datasets = [
        {
            label: result1.weapon,
            data: [result1.baseDamage, result1.scaledDamage, result1.effectiveDamage, result1.bleedDamage, result1.totalDamage, result1.dps],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }
    ];

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

        const weapon1 = JSON.parse(document.getElementById('weapon1').value || 'null');
        const weapon2 = JSON.parse(document.getElementById('weapon2').value || 'null');
        const attributeLevel = parseInt(document.getElementById('attributeLevel').value);
        const proficiency = parseInt(document.getElementById('proficiency').value);
        const stars = parseInt(document.getElementById('stars').value);
        const starType = document.getElementById('starType').value;
        const additionalPenetration = parseInt(document.getElementById('additionalPenetration').value) || 0;
        const bleedChance = parseInt(document.getElementById('bleedChance').value) || 0;

        if (weapon1 && !isNaN(attributeLevel) && !isNaN(proficiency)) {
            const result1 = calculateDamage(weapon1, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance);
            let result2 = null;
            if (weapon2) {
                result2 = calculateDamage(weapon2, attributeLevel, proficiency, stars, starType, additionalPenetration, bleedChance);
            }
            displayResult(result1, result2);
            updateChart(result1, result2);

            const chartElement = document.getElementById('damageChart');
            if (chartElement) {

                setTimeout(() => {
                    chartElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    });
}
window.triggerDamageCalculation = function () {
    const calculateDamageButton = document.getElementById('calculateDamage');
    if (calculateDamageButton) {
        calculateDamageButton.click();
    }
}


document.addEventListener('DOMContentLoaded', function () {
    initializeWeaponsTab();
    initializeWeaponSearch();
    loadBuildFromUrl();
});