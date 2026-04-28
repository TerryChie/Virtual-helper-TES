document.addEventListener("DOMContentLoaded", () => {
    createCardUI();
});

async function createCardUI() {
    try {
        const response = await fetch('/Virtual-helper-TES/js/cards.json');
        const cardsJson = await response.json();

        const labsContainer = document.getElementById('labsContainer');
        const metodContainer = document.getElementById('downloadableCards');

        // Читаем прогресс из localStorage
        const raw = localStorage.getItem('virtual_lab_progress');
        const progress = raw ? JSON.parse(raw) : null;

        if (labsContainer) {
            labsContainer.innerHTML += cardsJson[0].map(lab => {
                const completed = progress?.labs?.[lab.id - 1]?.completed ?? false;
                return createLabCardStructure(lab, completed);
            }).join('');
        }
        if (metodContainer) {
            metodContainer.innerHTML += cardsJson[1].map(metod => createMetodCardStructure(metod)).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки карточек:', error);
    }
}

function createLabCardStructure(card, completed = false) {
    const completedClass = completed ? ' lab-container--completed' : '';
    return `<a href="${card.href}" class="lab-container${completedClass}">
                <svg class="lab-preview">
                  <use href="${card.img}"></use>
                </svg>
                
                <div class="lab-title bold font24px">${card.title}</div>
                <div class="lab-description font16px">${card.about}</div>
            </a>`
}

function createMetodCardStructure(card) {
    return `<a href="${card.href}" class="metod-container">
                <div class="metod-title bold">${card.title}</div>
                <div class="metod-description font16px">${card.about}</div>
            </a>`
}