const path = window.location.pathname;
const currentLabIdInt = parseInt(path.split('/').pop().replace('.html', ''));

initializeProgress(getProgress());

document.addEventListener('DOMContentLoaded', () => {
    const currentData = getProgress();

    const labComplete = document.getElementById('labComplete');
    if (labComplete) {
        labComplete.onclick = () => completeLab(getProgress());
    }
    if (currentData && currentLabIdInt in currentData.labs) {
        checkLabCompletion(getProgress());
    }
    const exportButton = document.getElementById('export');
    if (exportButton) {
        exportButton.onclick = () => exportJson(getProgress());
    }
    const importButton = document.getElementById('import');
    if (importButton) {
        importButton.onclick = () => importJson();
    }
    const resetButton = document.getElementById('reset');
    if (resetButton) {
        resetButton.onclick = () => resetProgress();
    }

    if (document.getElementById('progressContainer')) {
        if (!currentData.user_info.first_name || !currentData.user_info.last_name) {
            showNameModal(currentData);
        } else {
            updateProgressUI(currentData);
        }
    }
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
            user_info: {
                first_name: '',
                last_name: '',
                last_activity: new Date().toISOString().slice(0, 10),
                overall_test_score: 0
            },
            labs: [
                { id: 1, completed: false, grade: 0 },
                { id: 2, completed: false, grade: 0 },
                { id: 3, completed: false, grade: 0 },
                { id: 4, completed: false, grade: 0 },
                { id: 5, completed: false, grade: 0 },
            ]
        };
        saveProgress(initialSkeleton);
    } else if (!currentData.user_info.first_name && currentData.user_info.first_name !== undefined) {

    } else if (currentData.user_info.first_name === undefined) {
        currentData.user_info.first_name = '';
        currentData.user_info.last_name = '';
        saveProgress(currentData);
    }
}

function checkLabCompletion(currentData){
    const lab = currentData.labs[currentLabIdInt - 1];

    const labCompletion = document.getElementById('labCompletion');
    if (labCompletion) {
        labCompletion.innerText = lab.completed ? 'Выполнена' : 'Не выполнена';
    }

    const labGrade = document.getElementById('labGrade');
    if (labGrade) {
        labGrade.innerText = lab.completed ? lab.grade : '—';
    }
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

        location.reload();
    };
}
function showNameModal(currentData) {
    const modal = document.getElementById('nameModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    document.getElementById('nameForm').onsubmit = function(e) {
        e.preventDefault();
        const firstName = document.getElementById('inputFirstName').value.trim();
        const lastName  = document.getElementById('inputLastName').value.trim();
        if (!firstName || !lastName) return;

        currentData.user_info.first_name = firstName;
        currentData.user_info.last_name  = lastName;
        saveProgress(currentData);

        modal.classList.add('hidden');
        updateProgressUI(getProgress());
    };
}

function resetProgress() {
    const confirmed = confirm('Сбросить весь прогресс? Это действие нельзя отменить.');
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

function updateProgressUI(currentProgress) {
    const allLabs = currentProgress.labs;
    const completedLabs = allLabs.filter(lab => lab.completed);
    const allCount = allLabs.length;
    const completedCount = completedLabs.length;
    const percentage = completedCount / allCount;

    const nameFirst = document.getElementById('studentFirstName');
    const nameLast  = document.getElementById('studentLastName');
    if (nameFirst) nameFirst.innerText = currentProgress.user_info.first_name || '';
    if (nameLast)  nameLast.innerText  = currentProgress.user_info.last_name  || '';

    if (completedCount > 0) {
        const grades = completedLabs.map(lab => lab.grade);
        const maxGrade = Math.max(...grades);
        const minGrade = Math.min(...grades);
        const avgGrade = Math.round(grades.reduce((a, b) => a + b) / completedCount);

        const stats = {
            maxGrade,
            minGrade,
            avgGrade,
            sidebarCompleted: `${completedCount}/${allCount}`,
            svgPercentage: `${Math.round(percentage * 100)}%`
        };

        Object.entries(stats).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = value;
        });
    }

    const circle = document.querySelector('.progress-ring__circle');
    if (circle) circle.style.strokeDashoffset = 735 * (1 - percentage);

    fetch('/Virtual-helper-TES/js/cards.json')
        .then(r => r.json())
        .then(json => {
            const labTitles = {};
            json[0].forEach(lab => { labTitles[lab.id] = lab.title; });
            renderLabList(currentProgress, true, labTitles);
            initTabSwitch(currentProgress, labTitles);
        })
        .catch(() => {
            renderLabList(currentProgress, true, {});
            initTabSwitch(currentProgress, {});
        });
}

function renderLabList(currentProgress, showCompleted, labTitles = {}) {
    const container = document.getElementById('lab-list');
    if (!container) return;

    const filtered = currentProgress.labs.filter(lab => lab.completed === showCompleted);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="lab-list-empty font18px">Лабораторных нет</div>`;
        return;
    }

    container.innerHTML = filtered.map(lab => {
        const title = labTitles[lab.id] || `Лабораторная №${lab.id}`;
        const gradeCell = showCompleted
            ? `<div class="lab-grade font18px bold">${lab.grade}</div>`
            : `<div class="lab-grade font18px"></div>`;
        return `
        <div class="lab-item">
            <div class="lab-title font24px">${title}</div>
            ${gradeCell}
        </div>`;
    }).join('');
}

function initTabSwitch(currentProgress, labTitles) {
    const buttons = document.querySelectorAll('.lab-switch-button');
    if (!buttons.length) return;

    // Если уже инициализировано — просто обновляем данные через dataset
    const switcher = document.querySelector('.lab-switch');
    if (switcher.dataset.initialized) return;
    switcher.dataset.initialized = 'true';

    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('lab-switch-active'));
            btn.classList.add('lab-switch-active');
            renderLabList(currentProgress, index === 0, labTitles);
        });
    });
}