import labsJson from '/Virtual-helper-TES/js/labs.json' with { type: 'json' };

document.addEventListener("DOMContentLoaded", () => {
    createLabCardUI();
});

function createLabCardUI() {

    const pohuy = document.getElementById('labsContainer');

    pohuy.innerHTML += labsJson.map(lab => createLabCardStructure(lab)).join('');
}

function createLabCardStructure(lab) {
    return `<a href="${lab.href}" class="lab-container">
                <div class="lab-preview">
                    <img class="lab-img" alt="">
                </div>
                <div class="lab-title bold font24px">${lab.title}</div>
                <div class="lab-description font16px">${lab.about}</div>
            </a>`
}
