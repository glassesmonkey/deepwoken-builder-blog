document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        tabButtons.forEach(button => {
            button.classList.remove('bg-parchment');
            button.classList.add('hover:bg-parchment');
        });

        const selectedTab = document.getElementById(tabId + '-tab');
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);

        if (selectedTab) selectedTab.classList.remove('hidden');
        if (selectedButton) {
            selectedButton.classList.add('bg-parchment');
            selectedButton.classList.remove('hover:bg-parchment');
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    
    switchTab('stats');
});

