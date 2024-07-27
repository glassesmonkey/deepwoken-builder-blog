const raceBonus = {
    Etrean: { Agility: 2, Intelligence: 3 },
    Celtor: { Intelligence: 2, Charisma: 3 },
    Adret: { Willpower: 2, Charisma: 3 },
    Canor: { Strength: 3, Charisma: 2 },
    Gremor: { Strength: 2, Fortitude: 3 },
    Khan: { Strength: 3, Agility: 2 },
    Felinor: { Agility: 3, Charisma: 2 },
    Chrysid: { Agility: 2, Charisma: 3 },
    Vesperian: { Fortitude: 3, Willpower: 2 },
    Capra: { Intelligence: 3, Willpower: 2 },
    Ganymede: { Intelligence: 2, Willpower: 3 },
    Tiran: { Agility: 3, Willpower: 2 },
    Drakkard: { Fortitude: 3, Agility: 2 },
    Lightborn: { Strength: 2, Fortitude: 2, Agility: 2, Intelligence: 2, Willpower: 2 }
};

let currentRace = 'Etrean';
let investmentPoints = 325;
let pointsSpent = 5;
let power = 0;
let nextPower = 25;
let totalInvestedPoints = 0;

const statInputs = document.querySelectorAll('.stat-input:not([data-exclude-from-calculation])');

const investmentPointsDisplay = document.getElementById('investment-points');
const pointsSpentDisplay = document.getElementById('points-spent');
const powerDisplay = document.getElementById('power');
const nextPowerDisplay = document.getElementById('next-power');
const raceSelect = document.getElementById('race-select');

const specialTraits = ['vitality', 'erudition', 'proficiency', 'songchant'];

function handleSpecialTraitChange(event) {
    const input = event.target;
    let newValue = parseInt(input.value) || 0;

        newValue = Math.min(Math.max(newValue, 0), 6);

        let totalSpecialTraits = 0;
    specialTraits.forEach(trait => {
        const traitInput = document.getElementById(`${trait}-input`);
        if (traitInput === input) {
            totalSpecialTraits += newValue;
        } else {
            totalSpecialTraits += parseInt(traitInput.value) || 0;
        }
    });

        if (totalSpecialTraits > 12) {
        newValue -= totalSpecialTraits - 12;
        newValue = Math.max(newValue, 0);     }

        input.value = newValue;
    input.dataset.oldValue = newValue;

        if (newValue !== parseInt(event.target.value)) {
        alert(`The total of special traits cannot exceed 12. Adjusted ${input.id.replace('-input', '')} to ${newValue}.`);
    }
}

function updateDisplay() {
    investmentPointsDisplay.textContent = investmentPoints;
    pointsSpentDisplay.textContent = pointsSpent;
    powerDisplay.textContent = power;
    nextPowerDisplay.textContent = nextPower;
}

function calculateRaceBonusTotal(race) {
    return Object.values(raceBonus[race]).reduce((sum, value) => sum + value, 0);
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
    const input = event.target;
    if (specialTraits.includes(input.id.replace('-input', ''))) {
        return;     }
    let newValue = parseInt(input.value) || 0;
    const oldValue = parseInt(input.dataset.oldValue) || 0;
    
        if (newValue > 100) {
        newValue = 100;
        input.value = 100;
    }

    const difference = newValue - oldValue;

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
    const newRace = raceSelect.value;
    const oldRaceBonusTotal = calculateRaceBonusTotal(currentRace);
    const newRaceBonusTotal = calculateRaceBonusTotal(newRace);
    const bonusDifference = newRaceBonusTotal - oldRaceBonusTotal;

        totalInvestedPoints += bonusDifference;
    updatePower(bonusDifference);

        statInputs.forEach(input => {
        const stat = input.id.replace('-input', '');
        const oldBonus = raceBonus[currentRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
        const newBonus = raceBonus[newRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
        const baseValue = parseInt(input.dataset.oldValue) - oldBonus;
        const newValue = Math.min(baseValue, 100) + newBonus;          input.value = newValue;
        input.dataset.oldValue = newValue;
    });

    currentRace = newRace;
    updateDisplay();
}

function initialize() {
        const initialRaceBonusTotal = calculateRaceBonusTotal(currentRace);
    totalInvestedPoints += initialRaceBonusTotal;
    updatePower(initialRaceBonusTotal);

        statInputs.forEach(input => {
        const stat = input.id.replace('-input', '');
        const initialBonus = raceBonus[currentRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
        input.value = initialBonus;
        input.dataset.oldValue = initialBonus;
        input.addEventListener('change', handleInputChange);
    });

    specialTraits.forEach(trait => {
        const input = document.getElementById(`${trait}-input`);
        input.value = 0;
        input.dataset.oldValue = 0;
        input.addEventListener('input', handleSpecialTraitChange);     });

        raceSelect.addEventListener('change', handleRaceChange);

        updateDisplay();
}

document.querySelectorAll('.stat-input').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = 0;
        }
    });
});

document.addEventListener('DOMContentLoaded', initialize);