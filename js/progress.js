const path = window.location.pathname;
const currentLabId = path.split('/').pop().replace('.html', '');

document.addEventListener('DOMContentLoaded', () => {

    const labComplete = document.getElementById('labComplete');
    labComplete.onclick = completeLab;

    initializeProgress();
    console.log(JSON.parse(localStorage.getItem('virtual_lab_progress')));
});

function initializeProgress() {
const STORAGE_KEY = 'virtual_lab_progress';

    if (!localStorage.getItem(STORAGE_KEY)) {
        const initialSkeleton = {
            "user_info": {
                "last_activity": new Date().toISOString(),
                "overall_test_score": 0
            },
            "lab1": {
                "is_completed": false,
                "test_score": 0,
                "attempts": 0
            },
            "lab2": {
                "is_completed": false,
                "test_score": 0,
                "attempts": 0
            }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSkeleton));
    }
}

function getProgress() {
    const rawData = localStorage.getItem('virtual_lab_progress');
    return JSON.parse(rawData);
}

function completeLab() {
    let currentData = getProgress();
    const labCompletion = document.getElementById('labCompletion')
}