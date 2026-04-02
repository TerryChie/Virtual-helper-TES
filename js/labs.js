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
                <div class="lab-preview">
                    <img class="lab-img" alt="">
                </div>
                <div class="lab-title bold font24px">${title}</div>
                <div class="lab-description font16px">${about}</div>
            </a>`
}