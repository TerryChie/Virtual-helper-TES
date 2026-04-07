import cardsJson from '/Virtual-helper-TES/js/cards.json' with { type: 'json' };

document.addEventListener("DOMContentLoaded", () => {
    createCardUI();
});

function createCardUI() {

    const labsContainer = document.getElementById('labsContainer');
    const metodContainer = document.getElementById('downloadableCards');

    if(labsContainer) {
        labsContainer.innerHTML += cardsJson[0].map(lab => createLabCardStructure(lab)).join('');
    }
    if(metodContainer) {
        metodContainer.innerHTML += cardsJson[1].map(metod => createMetodCardStructure(metod)).join('');
    }
}

function createLabCardStructure(card) {
    return `<a href="${card.href}" class="lab-container">
                <div class="lab-preview">
                    <img class="lab-img" alt="">
                </div>
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