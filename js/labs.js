import labsJson from '/Virtual-helper-TES/js/labs.json' with { type: 'json' };

document.addEventListener("DOMContentLoaded", () => {
    createLabCardUI();
});

function createLabCardUI() {

    const pohuy = document.getElementById('labsContainer');

    for(let lab of Object.values(labsJson)) {
        pohuy.innerHTML += createLabCardStructure(lab.title, lab.about, lab.labPath, lab.imgPath);
    }

}

function createLabCardStructure(title, about, labPath, imgPath) {
    return `<a href="${labPath}" class="lab-container">
                <div class="lab-preview"><img class="lab-img" src="${imgPath}" alt="Artyom Kalaytanov"></div>
                <div class="lab-content">
                    <div class="lab-title">${title}</div>
                    <div class="lab-description">${about}</div>
                </div>
            </a>`
}