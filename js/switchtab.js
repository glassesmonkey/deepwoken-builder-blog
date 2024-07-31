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

        const selectedTab = document.getElementById(tabId);
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);

        if (selectedTab) selectedTab.classList.remove('hidden');
        if (selectedButton) {
            selectedButton.classList.add('bg-parchment');
            selectedButton.classList.remove('hover:bg-parchment');
        }

        // 只有在切换到非 mantras 标签时才重置 mantras 按钮
        if (tabId !== 'mantras-tab') {
            resetMantrasButtons();
        }
    }

    function resetMantrasButtons() {
        const mantrasButtons = document.querySelectorAll('.category-button');
        const mantrasContents = document.querySelectorAll('.category-content');

        mantrasButtons.forEach(button => {
            button.classList.remove('active');
            const chevron = button.querySelector('.chevron');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        });

        mantrasContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    switchTab('stats-tab');
});