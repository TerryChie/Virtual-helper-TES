// TODO: change naming and add/change some validation checks

const STORAGE_KEY = 'virtual_lab_progress';
const path = window.location.pathname;
const currentLabId = path.split('/').pop().replace('.html', '');

document.addEventListener('DOMContentLoaded', () => {
    initializeProgress();

    const labComplete = document.getElementById('labComplete');
    if (labComplete) {
        labComplete.onclick = completeLab
    }

    const  currentData = getProgress()
    if(currentData && currentLabId in currentData) {
        checkLabCompletion()
    }
});

function initializeProgress() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const initialSkeleton = {
            "user_info": { "last_activity": new Date().toISOString(), "overall_test_score": 0 },
            "lab1": { "is_completed": false, "test_score": 0, "attempts": 0 },
            "lab2": { "is_completed": false, "test_score": 0, "attempts": 0 }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSkeleton));
    }
}

function getProgress() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(rawData);
}

function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function checkLabCompletion(){
    const currentData = getProgress();
    const labCompletion = document.getElementById('labCompletion')
    const is_completed = currentData[currentLabId].is_completed

    is_completed === false ? labCompletion.innerText = 'Не выполнена' : labCompletion.innerText = is_completed;
}

function completeLab() {
    const currentData = getProgress();
    const labItem = currentData[currentLabId];
    const labCompletion = document.getElementById('labCompletion')

    labItem.is_completed = (labItem.is_completed === "Выполнена") ? "Не выполнена" : "Выполнена"
    labCompletion.innerText = labItem.is_completed

    saveProgress(currentData)
}