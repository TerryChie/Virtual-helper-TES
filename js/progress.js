// TODO: change naming and add/change some validation checks

const STORAGE_KEY = 'virtual_lab_progress';
const path = window.location.pathname;
const currentLabIdInt = parseInt(path.split('/').pop().replace('.html', ''));

initializeProgress(getProgress());

document.addEventListener('DOMContentLoaded', () => {
    const currentData = getProgress();

    const labComplete = document.getElementById('labComplete');
    if (labComplete) {
        labComplete.onclick = () => completeLab(getProgress());
    }
    if(currentData && currentLabIdInt in currentData.labs) {
        checkLabCompletion(getProgress())
    }
    const exportButton = document.getElementById('export');
    if (exportButton) {
        exportButton.onclick = () => exportJson(getProgress());
    }
    const importButton = document.getElementById('import');
    if (importButton) {
        importButton.onclick = () => importJson();
    }

    if(document.getElementById('progressContainer')) { updateProgressUI(getProgress()) }
});

function getProgress() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(rawData);
}

function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function initializeProgress(currentData) {
    if (!currentData) {
        const initialSkeleton = {
            user_info: { last_activity: new Date().toISOString().slice(0, 10), overall_test_score: 0 },
            labs: [
                { id: 1, completed: false, grade: 0},
                { id: 2, completed: false, grade: 0 },
                { id: 3, completed: false, grade: 0 },
                { id: 4, completed: false, grade: 0 },
                { id: 5, completed: false, grade: 0 },
                { id: 6, completed: false, grade: 0 },
                { id: 7, completed: false, grade: 0 },
                { id: 8, completed: false, grade: 0 },
                { id: 9, completed: false, grade: 0 },
                { id: 10, completed: false, grade: 0 },
                { id: 11, completed: false, grade: 0 },
                { id: 12, completed: false, grade: 0 },
                { id: 13, completed: false, grade: 0 },
            ]
        };
        saveProgress(initialSkeleton);
    }
}

function checkLabCompletion(currentData){
    const labCompletion = document.getElementById('labCompletion')
    const completionStatus = currentData.labs[currentLabIdInt-1].completed

    completionStatus === false ? labCompletion.innerText = 'Не выполнена' : labCompletion.innerText = 'Выполнена';
}

function completeLab(currentData) {
    const labItem = currentData.labs[currentLabIdInt-1];
    const labCompletion = document.getElementById('labCompletion')

    labItem.completed = (labItem.completed !== true)
    labCompletion.innerText = (labItem.completed) ? "Выполнена" : "Не выполнена"

    saveProgress(currentData)
}

function exportJson(currentData) {
    const jsonString = JSON.stringify(currentData, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    link.download = `labs_backup_${date}.json`;

    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
}

function importJson() {
    const importButton = document.getElementById('jsonImport')
    importButton.click()

    importButton.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function() {
            const importedData = JSON.parse(reader.result);
            saveProgress(importedData);
        };
        reader.readAsText(file);
        importButton.value = '';
    };
}
function updateProgressUI(currentProgress) {

    const completedGrades = currentProgress.labs
        .filter(lab => lab.completed)
        .map(lab => lab.grade);

    if (completedGrades.length > 0) {
        const maxGrade = Math.max(...completedGrades);
        const minGrade = Math.min(...completedGrades);
        const average = completedGrades.reduce((a, b) => a + b) / completedGrades.length;

        document.getElementById('maxGrade').innerText = `${minGrade}`
        document.getElementById('minGrade').innerText = `${maxGrade}`
        document.getElementById('avgGrade').innerText = `${average}`
        document.getElementById('sidebar-completed').innerText = `${completedGrades.length}/${currentProgress.labs.length}`
        document.getElementById('svg-percentage').innerHTML = `${(completedGrades.length/currentProgress.labs.length * 100).toFixed(0)}%`

        const circle = document.querySelector('.progress-ring__circle');
        circle.style.strokeDashoffset = ((735 * completedGrades.length)/currentProgress.labs.length) * 100;
    }
}

// function labQuiz() {
// }