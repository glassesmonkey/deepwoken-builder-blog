// 定义种族对应的属性加成
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

// 初始化变量
let currentRace = 'Etrean';
let investmentPoints = 325;
let pointsSpent = 5;
let power = 0;
let nextPower = 25;
let totalInvestedPoints = 0;

// 获取参与点数计算的统计输入框
const statInputs = document.querySelectorAll('.stat-input:not([data-exclude-from-calculation])');

// 获取显示元素
const investmentPointsDisplay = document.getElementById('investment-points');
const pointsSpentDisplay = document.getElementById('points-spent');
const powerDisplay = document.getElementById('power');
const nextPowerDisplay = document.getElementById('next-power');
const raceSelect = document.getElementById('race-select');

// 更新显示的函数
function updateDisplay() {
    investmentPointsDisplay.textContent = investmentPoints;
    pointsSpentDisplay.textContent = pointsSpent;
    powerDisplay.textContent = power;
    nextPowerDisplay.textContent = nextPower;
}

// 计算种族加成总和
function calculateRaceBonusTotal(race) {
    return Object.values(raceBonus[race]).reduce((sum, value) => sum + value, 0);
}

// Power 相关计算函数
function updatePower(change) {
    totalInvestedPoints += change;

    if (change > 0) {
        // 增加点数
        nextPower -= change;
        while (nextPower <= 0) {
            nextPower += 15;
            power += 1;
        }
    } else if (change < 0) {
        // 减少点数
        nextPower += Math.abs(change);
        while (nextPower > 15 && totalInvestedPoints >= 25) {
            nextPower -= 15;
            power -= 1;
        }
    }

    // 确保power的值正确
    if (totalInvestedPoints < 25) {
        power = 0;
    } else {
        power = Math.ceil((totalInvestedPoints - 25) / 15);
        if (Number.isInteger(power)) {
            power += 1;
        }
    }
}

// 处理输入变化的函数
function handleInputChange(event) {
    const input = event.target;
    let newValue = parseInt(input.value) || 0;
    const oldValue = parseInt(input.dataset.oldValue) || 0;
    
    // 对所有相关输入框应用100点限制
    if (newValue > 100) {
        newValue = 100;
        input.value = 100;
    }

    const difference = newValue - oldValue;

    // 检查是否有足够的点数
    if (investmentPoints - difference < 0) {
        // 如果没有足够的点数，恢复旧值并返回
        input.value = oldValue;
        return;
    }

    // 更新点数
    investmentPoints -= difference;
    pointsSpent += difference;

    // 更新 Power 相关数值
    updatePower(difference);

    // 更新输入框的旧值
    input.dataset.oldValue = newValue;

    // 更新显示
    updateDisplay();
}

// 处理种族变化的函数
function handleRaceChange() {
    const newRace = raceSelect.value;
    const oldRaceBonusTotal = calculateRaceBonusTotal(currentRace);
    const newRaceBonusTotal = calculateRaceBonusTotal(newRace);
    const bonusDifference = newRaceBonusTotal - oldRaceBonusTotal;

    // 更新总投资点数和Power
    totalInvestedPoints += bonusDifference;
    updatePower(bonusDifference);

    // 更新每个属性的值
    statInputs.forEach(input => {
        const stat = input.id.replace('-input', '');
        const oldBonus = raceBonus[currentRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
        const newBonus = raceBonus[newRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
        const baseValue = parseInt(input.dataset.oldValue) - oldBonus;
        const newValue = Math.min(baseValue, 100) + newBonus;  // 确保基础值不超过100
        input.value = newValue;
        input.dataset.oldValue = newValue;
    });

    currentRace = newRace;
    updateDisplay();
}

// 初始化函数
function initialize() {
    // 设置初始种族加成
    const initialRaceBonusTotal = calculateRaceBonusTotal(currentRace);
    totalInvestedPoints += initialRaceBonusTotal;
    updatePower(initialRaceBonusTotal);

    // 为每个参与计算的输入框添加事件监听器
    statInputs.forEach(input => {
        const stat = input.id.replace('-input', '');
        const initialBonus = raceBonus[currentRace][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
        input.value = initialBonus;
        input.dataset.oldValue = initialBonus;
        input.addEventListener('change', handleInputChange);
    });

    // 为种族选择添加事件监听器
    raceSelect.addEventListener('change', handleRaceChange);

    // 初始化显示
    updateDisplay();
}

// 防止输入负数（包括不参与计算的属性）
document.querySelectorAll('.stat-input').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = 0;
        }
    });
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initialize);