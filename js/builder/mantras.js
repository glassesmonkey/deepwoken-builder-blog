document.addEventListener('DOMContentLoaded', function() {
    const obtainableMantras = document.querySelectorAll('#mantras-tab .col-span-1:first-child li');
    const obtainedMantrasContainer = document.getElementById('obtained-mantras-container');
    
    const mantraCounts = {
      Combat: 0,
      Mobility: 0,
      Support: 0,
      Wildcard: 0
    };
  
    const mantraLimits = {
      Combat: 3,
      Mobility: 1,
      Support: 1,
      Wildcard: 3
    };
  
    const wildcardMantras = ['Mecha Gatling', 'Coral Spear', 'Whirling Blade'];
  
    function updateMantraCount(category) {
      const countElement = document.getElementById(`${category.toLowerCase()}-count`);
      if (countElement) {
        countElement.textContent = mantraCounts[category];
        const limitSpan = countElement.closest('span');
        if (limitSpan) {
          limitSpan.classList.toggle('text-yellow-400', mantraCounts[category] > mantraLimits[category]);
        }
      }
    }
  
    function addObtainedMantra(mantraName, category) {
      let targetCategory = category;
      if (category === 'Combat' && wildcardMantras.includes(mantraName)) {
        targetCategory = 'Wildcard';
      }
  
      const categoryContainer = document.getElementById(`obtained-${targetCategory.toLowerCase()}`);
      if (categoryContainer) {
        const mantraElement = document.createElement('li');
        mantraElement.textContent = mantraName;
        mantraElement.className = 'text-green-400 cursor-pointer';
        
        mantraElement.addEventListener('mousedown', function() {
          this.holdTimer = setTimeout(() => {
            alert(`Modifications for ${mantraName}`);
          }, 500);
        });
  
        mantraElement.addEventListener('mouseup', function() {
          clearTimeout(this.holdTimer);
        });
  
        categoryContainer.querySelector('ul').appendChild(mantraElement);
        mantraCounts[targetCategory]++;
        updateMantraCount(targetCategory);
      }
    }
  
    obtainableMantras.forEach(mantra => {
      mantra.addEventListener('click', function() {
        const mantraName = this.textContent;
        let category = this.closest('div').querySelector('div').textContent;
        
        if (category === 'Wisp') {
          category = 'Wildcard';
        }
  
        addObtainedMantra(mantraName, category);
        
        this.classList.remove('hover:text-green-400');
        this.classList.add('text-gray-500');
        this.style.pointerEvents = 'none';
      });
    });
  });