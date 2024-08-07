let tooltip;
document.addEventListener('DOMContentLoaded', function () {
    let mantrasData = {};
    const mantraLimits = { Combat: 3, Mobility: 1, Support: 1, Wildcard: 1 };
    const selectedMantras = { Combat: [], Mobility: [], Support: [], Wildcard: [] };
    let tooltip;

    const attunementColors = {
        Flamecharm: 'text-red-500',
        Thundercall: 'text-yellow-400',
        Frostdraw: 'text-blue-400',
        Galebreathe: 'text-green-400',
        Shadowcast: 'text-purple-500',
        Ironsing: 'text-gray-400',
        null: 'text-white'
    };

    // Fetch and load mantras data
    fetch('js/builder/merged_mantras.json')
        .then(response => response.json())
        .then(data => {
            mantrasData = data;
            renderMantras(data);
            setupMantraInteractions();
            initializeObtainedCategories();
        })
        .catch(error => console.error('Error loading mantras:', error));

    function renderMantras(data) {
        const obtainableMantrasContainer = document.getElementById('obtainable-mantras');
        const categories = ['Combat', 'Mobility', 'Support'];

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'mb-4';
            categoryDiv.innerHTML = `
                <button class="category-button" data-category="${category.toLowerCase()}">
                  ${category}
                  <span class="chevron">▼</span>
                </button>
                <div class="category-content" id="content-${category.toLowerCase()}">
                  <ul class="space-y-1" id="obtainable-${category.toLowerCase()}">
                    ${data[category].map(mantra => `
                      <li class="cursor-pointer hover:text-green-400 ${getAttunementColor(mantra.attunement)}" 
                          data-category="${category}" 
                          data-name="${mantra.name}">
                        ${mantra.name}
                      </li>
                    `).join('')}
                  </ul>
                </div>
              `;
            obtainableMantrasContainer.appendChild(categoryDiv);
        });


        document.querySelectorAll('.category-button').forEach(button => {
            button.addEventListener('click', toggleCategory);
        });
    }
    function toggleCategory(event) {
        const button = event.currentTarget;
        const category = button.dataset.category;
        const content = document.getElementById(`content-${category}`);

        button.classList.toggle('active');
        content.classList.toggle('active');

        if (content.classList.contains('active')) {
            content.style.display = 'block';
            button.querySelector('.chevron').style.transform = 'rotate(180deg)';
        } else {
            content.style.display = 'none';
            button.querySelector('.chevron').style.transform = 'rotate(0deg)';
        }
    }

    function getAttunementColor(attunement) {
        return attunementColors[attunement] || attunementColors[null];
    }

    window.setupMantraInteractions = function () {
        const mantraItems = document.querySelectorAll('#obtainable-mantras li');
        tooltip = createTooltip();

        mantraItems.forEach(item => {
            item.addEventListener('mouseenter', showTooltip);
            item.addEventListener('mouseleave', hideTooltip);
            item.addEventListener('click', selectMantra);
        });

        // Setup deselection and tooltip for obtained mantras
        const obtainedMantrasContainer = document.getElementById('obtained-mantras-container');
        obtainedMantrasContainer.addEventListener('click', deselectMantra);
        obtainedMantrasContainer.addEventListener('mouseenter', showTooltip, true);
        obtainedMantrasContainer.addEventListener('mouseleave', hideTooltip, true);
    }

    function createTooltip() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'fixed bg-gray-800 text-white p-2 rounded shadow-lg z-50 hidden';
        document.body.appendChild(tooltipElement);
        return tooltipElement;
    }

    function showTooltip(event) {
        if (event.target.tagName !== 'LI') return;

        const category = event.target.dataset.category;
        const name = event.target.dataset.name;
        const mantra = mantrasData[category].find(m => m.name === name);

        if (mantra) {
            tooltip.innerHTML = `
            <h3>${mantra.name}</h3>
            ${mantra.description ? `<p><strong>Description:</strong> ${mantra.description}</p>` : ''}
            ${mantra.requirements ? `<p><strong>Requirements:</strong> ${mantra.requirements}</p>` : ''}
            ${mantra.etherCost ? `<p><strong>Ether Cost:</strong> ${mantra.etherCost}</p>` : ''}
            ${mantra.cooldown ? `<p><strong>Cooldown:</strong> ${mantra.cooldown}</p>` : ''}
            ${mantra.effect ? `<p><strong>Effect:</strong> ${mantra.effect}</p>` : ''}
            ${mantra.attunement ? `<p><strong>Attunement:</strong> ${mantra.attunement}</p>` : ''}
            ${mantra.isMonsterMantra ? `<p><strong>Monster Mantra:</strong> Yes</p>` : ''}
          `;
            tooltip.style.display = 'block';
            positionTooltip(event);
        }
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    function positionTooltip(event) {
        const padding = 20;
        const maxWidth = 400;
        const minWidth = 300;


        tooltip.style.width = 'auto';
        tooltip.style.height = 'auto';


        const tooltipRect = tooltip.getBoundingClientRect();
        let tooltipWidth = Math.max(minWidth, Math.min(tooltipRect.width, maxWidth));
        let tooltipHeight = tooltipRect.height;

        let left = event.clientX + padding;
        let top = event.clientY + padding;


        if (left + tooltipWidth > window.innerWidth) {
            left = event.clientX - tooltipWidth - padding;
        }


        if (top + tooltipHeight > window.innerHeight) {
            if (tooltipHeight > window.innerHeight * 0.8) {
                tooltipHeight = window.innerHeight * 0.8;
                tooltip.style.height = `${tooltipHeight}px`;
                top = window.innerHeight - tooltipHeight - padding;
            } else {
                top = event.clientY - tooltipHeight - padding;
            }
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.width = `${tooltipWidth}px`;
    }

    function selectMantra(event) {
        const category = event.target.dataset.category;
        const name = event.target.dataset.name;
        const mantra = mantrasData[category].find(m => m.name === name);

        let targetCategory = category;


        if (selectedMantras[category].length >= mantraLimits[category]) {

            if (selectedMantras['Wildcard'].length < mantraLimits['Wildcard']) {
                targetCategory = 'Wildcard';
            } else {

                targetCategory = category;
            }
        }


        addObtainedMantra(mantra, targetCategory);
        disableMantra(event.target);

        updateMantraCount(targetCategory);
        window.selectedMantras = JSON.parse(JSON.stringify(selectedMantras));
        console.log("Updated window.selectedMantras after selection:", JSON.parse(JSON.stringify(window.selectedMantras)));
        console.log("Updated selectedMantras after selection:", JSON.parse(JSON.stringify(selectedMantras)));
    }

    function disableMantra(element) {
        element.classList.remove('hover:text-green-400');
        element.classList.add('text-gray-500', 'opacity-50', 'cursor-not-allowed');
        element.style.pointerEvents = 'none';
    }

    function enableMantra(element) {
        element.classList.remove('text-gray-500', 'opacity-50', 'cursor-not-allowed');
        element.classList.add('hover:text-green-400');
        element.style.pointerEvents = 'auto';
    }

    function addObtainedMantra(mantra, category) {
        const categoryContainer = document.getElementById(`obtained-${category.toLowerCase()}`);

        const mantraElement = document.createElement('li');
        mantraElement.textContent = mantra.name;
        mantraElement.className = `cursor-pointer ${getAttunementColor(mantra.attunement)}`;
        mantraElement.dataset.category = category;
        mantraElement.dataset.name = mantra.name;
        categoryContainer.querySelector('ul').appendChild(mantraElement);

        selectedMantras[category].push(mantra);
    }

    function deselectMantra(event) {
        if (event.target.tagName === 'LI') {
            const category = event.target.dataset.category;
            const name = event.target.dataset.name;

            // Remove from selectedMantras
            selectedMantras[category] = selectedMantras[category].filter(m => m.name !== name);

            // Remove the li element
            event.target.remove();

            // Update the count
            updateMantraCount(category);

            // Re-enable the mantra in the obtainable list
            const obtainableMantra = document.querySelector(`#obtainable-${category.toLowerCase()} li[data-name="${name}"]`);
            if (obtainableMantra) {
                enableMantra(obtainableMantra);
            }
        }
        window.selectedMantras = JSON.parse(JSON.stringify(selectedMantras));
        console.log("Updated window.selectedMantras after deselection:", JSON.parse(JSON.stringify(window.selectedMantras)));
        console.log("Updated selectedMantras after deselection:", JSON.parse(JSON.stringify(selectedMantras)));
    }

    function createCategoryContainer(category) {
        const container = document.createElement('div');
        container.id = `obtained-${category.toLowerCase()}`;
        container.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <span class="text-lg font-bold text-yellow-400">${category}</span>
          <span class="text-sm"><span id="${category.toLowerCase()}-count" class="text-white">0</span>/${mantraLimits[category]}</span>
        </div>
        <ul class="space-y-1"></ul>
      `;
        return container;
    }

    function updateMantraCount(category) {
        const countElement = document.getElementById(`${category.toLowerCase()}-count`);
        if (countElement) {
            const currentCount = selectedMantras[category].length;
            countElement.textContent = currentCount;
            countElement.className = currentCount > mantraLimits[category] ? 'text-red-400' : 'text-white';
        }
    }

    function initializeObtainedCategories() {
        const obtainedMantrasContainer = document.getElementById('obtained-mantras-container');
        ['Combat', 'Mobility', 'Support', 'Wildcard'].forEach(category => {
            obtainedMantrasContainer.appendChild(createCategoryContainer(category));
        });
    }
    function createTooltip() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'tooltip';
        document.body.appendChild(tooltipElement);
        return tooltipElement;
    }

    function showTooltip(event) {
        if (event.target.tagName !== 'LI') return;

        const category = event.target.dataset.category;
        const name = event.target.dataset.name;
        const mantra = mantrasData[category].find(m => m.name === name);

        if (mantra) {
            tooltip.innerHTML = `
            <h3 class="text-lg font-bold mb-2">${mantra.name}</h3>
            ${mantra.description ? `<p><strong>Description:</strong> ${mantra.description}</p>` : ''}
            ${mantra.requirements ? `<p><strong>Requirements:</strong> ${mantra.requirements}</p>` : ''}
            ${mantra.etherCost ? `<p><strong>Ether Cost:</strong> ${mantra.etherCost}</p>` : ''}
            ${mantra.cooldown ? `<p><strong>Cooldown:</strong> ${mantra.cooldown}</p>` : ''}
            ${mantra.effect ? `<p><strong>Effect:</strong> ${mantra.effect}</p>` : ''}
            ${mantra.attunement ? `<p><strong>Attunement:</strong> ${mantra.attunement}</p>` : ''}
            ${mantra.isMonsterMantra ? `<p><strong>Monster Mantra:</strong> Yes</p>` : ''}
          `;
            tooltip.style.display = 'block';
            positionTooltip(event);
        }
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
    }
    function createTooltip() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'tooltip';
        document.body.appendChild(tooltipElement);
        return tooltipElement;
    }

    function positionTooltip(event) {
        const tooltipWidth = 300;
        const tooltipHeight = 300;
        const padding = 20;

        let left = event.clientX + padding;
        let top = event.clientY + padding;


        if (left + tooltipWidth > window.innerWidth) {
            left = event.clientX - tooltipWidth - padding;
        }


        if (top + tooltipHeight > window.innerHeight) {
            top = event.clientY - tooltipHeight - padding;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }
    tooltip = createTooltip();

    document.addEventListener('mousemove', function (event) {
        if (tooltip.style.display === 'block') {
            positionTooltip(event);
        }
    });
    window.selectedMantras = selectedMantras;
    //console.log("Initial window.selectedMantras:", JSON.parse(JSON.stringify(window.selectedMantras)));
});