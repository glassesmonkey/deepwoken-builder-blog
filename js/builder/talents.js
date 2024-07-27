const selectedTalents = {};

function initializeTalentsTab() {
  const talentCategories = document.querySelectorAll('.talent-category');
  const talentItems = document.querySelectorAll('.talent-list li');

    talentCategories.forEach(button => {
    button.addEventListener('click', () => {
      const ul = button.nextElementSibling;
      ul.classList.toggle('hidden');
      const chevron = button.querySelector('svg');
      chevron.classList.toggle('rotate-180');
    });
  });

    talentItems.forEach(item => {
    item.addEventListener('click', () => toggleTalent(item));
  });

    updateSelectedTalents();
}

function toggleTalent(talentElement) {
  const category = talentElement.dataset.category;
  const talent = talentElement.dataset.talent;

  if (!selectedTalents[category]) {
    selectedTalents[category] = [];
  }

  const index = selectedTalents[category].indexOf(talent);
  if (index > -1) {
    selectedTalents[category].splice(index, 1);
    talentElement.classList.remove('text-gray-500');
    talentElement.classList.add('text-gray-300', 'hover:text-white');
  } else {
    selectedTalents[category].push(talent);
    talentElement.classList.add('text-gray-500');
    talentElement.classList.remove('text-gray-300', 'hover:text-white');
  }

  updateSelectedTalents();
}

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

document.addEventListener('DOMContentLoaded', initializeTalentsTab);