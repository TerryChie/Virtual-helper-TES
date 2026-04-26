document.addEventListener("DOMContentLoaded", () => {
    createCardUI();
});

async function createCardUI() {
    try {
        const response = await fetch('/Virtual-helper-TES/js/cards.json');
        const cardsJson = await response.json();

        const labsContainer = document.getElementById('labsContainer');
        const metodContainer = document.getElementById('downloadableCards');

        if (labsContainer) {
            labsContainer.innerHTML += cardsJson[0].map(lab => createLabCardStructure(lab)).join('');
        }
        if (metodContainer) {
            metodContainer.innerHTML += cardsJson[1].map(metod => createMetodCardStructure(metod)).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки карточек:', error);
    }
}

function createLabCardStructure(card) {
    return `<a href="${card.href}" class="lab-container">
                <svg class="lab-preview">
                  <use href="${card.img}"></use>
                </svg>
                
                <div class="lab-title bold font24px">${card.title}</div>
                <div class="lab-description font16px">${card.about}</div>
            </a>`
}

function createMetodCardStructure(card) {
    return `<a href="${card.href}" class="metod-container">
                <div class="metod-title bold font24px">${card.title}</div>
                <div class="metod-description font16px">${card.about}</div>
            </a>`
}