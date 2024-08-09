
const selectedTalents = {};
window.selectedTalents = window.selectedTalents || {};

function initializeTalentsTab() {
  console.log('initializeTalentsTab called');
    window.selectedTalents = window.selectedTalents || {};
    const talentCategories = document.querySelectorAll('#available-talents > .mb-4 > .talent-category');
    const talentItems = document.querySelectorAll('#available-talents .talent-list li');

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
    initializeSearch(); 
}
function initializeSearch() {

  const searchInput = document.getElementById('talent-search');
  if (!searchInput) {
      console.error('Search input not found');
      return;
  }

  searchInput.addEventListener('focus', function() {
    if (this.style.display !== 'none') {
      this.style.caretColor = 'white';
    }
  });
  searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const talentItems = document.querySelectorAll('#available-talents .talent-list li');
      const categories = document.querySelectorAll('#available-talents > .mb-4');

      talentItems.forEach(item => {
          const talentName = item.textContent.toLowerCase();
          if (talentName.includes(searchTerm)) {
              item.style.display = '';
          } else {
              item.style.display = 'none';
          }
      });

      // Always show category buttons, but hide/show talent lists
      categories.forEach(category => {
          const talentList = category.querySelector('.talent-list');
          const visibleTalents = talentList.querySelectorAll('li:not([style="display: none;"])');
          
          // Always keep the category button visible
          category.style.display = '';
          
          // Hide/show the talent list based on whether there are visible talents
          if (visibleTalents.length === 0) {
              talentList.style.display = 'none';
          } else {
              talentList.style.display = '';
          }
      });
  });
}
function toggleTalent(talentElement) {
    const categoryElement = talentElement.closest('.mb-4');
    if (!categoryElement) {
        console.error('Unable to find parent .mb-4 element');
        return;
    }
    const categoryButton = categoryElement.querySelector('.talent-category');
    if (!categoryButton) {
        console.error('Unable to find .talent-category button');
        return;
    }
    const category = categoryButton.dataset.category;
    const talent = talentElement.textContent.trim();

    if (!window.selectedTalents[category]) {
        window.selectedTalents[category] = [];
    }
    

    const index = window.selectedTalents[category].indexOf(talent);
    if (index > -1) {
        window.selectedTalents[category].splice(index, 1);
        talentElement.classList.remove('text-gray-500');
        talentElement.classList.add('text-gray-300', 'hover:text-white');
    } else {
        window.selectedTalents[category].push(talent);
        talentElement.classList.add('text-gray-500');
        talentElement.classList.remove('text-gray-300', 'hover:text-white');
    }
    // console.log('Category:', category);
    // console.log('Talent:', talent);
    // console.log('Current selectedTalents:', window.selectedTalents);
    updateSelectedTalents();
    // console.log('updateSelectedTalents called');
}

window.toggleTalent = toggleTalent;
window.updateSelectedTalents = updateSelectedTalents;

function updateSelectedTalents() {
    const selectedTalentsDiv = document.getElementById('selected-talents');
    const categories = ['Common', 'Rare', 'Advanced', 'Oath'];
    const colors = ['blue', 'purple', 'green', 'yellow'];
    
    let innerHTML = `
      <h3 class="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2">Selected Talents</h3>
      <div class="space-y-4">
    `;
  
    categories.forEach((category, index) => {
      const talents = window.selectedTalents[category] || [];
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