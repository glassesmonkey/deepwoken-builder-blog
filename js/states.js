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

const stats = ['strength', 'fortitude', 'agility', 'intelligence', 'willpower', 'charisma'];
let currentRace = 'Etrean';

function updateStats() {
    stats.forEach(stat => {
        const input = document.getElementById(`${stat}-input`);
        const baseValue = parseInt(input.dataset.base) || 0;
        const raceBonus = getRaceBonus(currentRace, stat);
        const totalValue = baseValue + raceBonus;
        input.value = totalValue;
    });
}

function getRaceBonus(race, stat) {
    return raceBonus[race][stat.charAt(0).toUpperCase() + stat.slice(1)] || 0;
}

function changeRace(newRace) {
    stats.forEach(stat => {
        const input = document.getElementById(`${stat}-input`);
        const oldBonus = getRaceBonus(currentRace, stat);
        const newBonus = getRaceBonus(newRace, stat);
        let baseValue = parseInt(input.dataset.base) || 0;
        
        // 更新基础值
        input.dataset.base = baseValue;
    });
    
    currentRace = newRace;
    updateStats();
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    const raceSelect = document.getElementById('race-select');
    raceSelect.value = currentRace;
    
    raceSelect.addEventListener('change', function() {
        changeRace(this.value);
    });
    
    stats.forEach(stat => {
        const input = document.getElementById(`${stat}-input`);
        input.addEventListener('input', function() {
            // 计算用户输入的基础值
            const totalValue = parseInt(this.value) || 0;
            const raceBonus = getRaceBonus(currentRace, stat);
            let baseValue = Math.max(0, totalValue - raceBonus);
            
            // 更新基础值
            this.dataset.base = baseValue;
            
            updateStats();
        });
    });
    
    updateStats();
});