const STORAGE_KEY = 'virtual_lab_progress';

document.addEventListener("DOMContentLoaded", () => {
    loadLayout().then(() => {
        loadLabs();
    });
});

async function loadLayout() {
    const layouts = [
        { id: 'header-placeholder', url: '/Virtual-helper-TES/assets/components/header.html' },
        { id: 'footer-placeholder', url: '/Virtual-helper-TES/assets/components/footer.html' }
    ];

    for (const item of layouts) {
        const target = document.getElementById(item.id);
        if (target) {
            const response = await fetch(item.url);
            if (response.ok) {
                target.innerHTML = await response.text();
            }
        }
    }

    document.body.classList.add('loaded');
    prime();
}

async function loadLabs() {
    const container = document.getElementById('lab-list');
    if (!container || document.getElementById('progressContainer')) return;

    try {
        const response = await fetch('/Virtual-helper-TES/js/cards.json');
        const json = await response.json();
        const labs = json[0];

        const raw = localStorage.getItem(STORAGE_KEY);
        const currentData = raw ? JSON.parse(raw) : null;

        container.innerHTML = labs.map(lab => {
            const grade = currentData?.labs?.[lab.id - 1]?.grade ?? 0;
            return `
            <div class="lab-item">
                <div class="lab-title font24px">${lab.title}</div>
                <div class="lab-grade font18px bold">${grade}</div>
            </div>`;
        }).join('');
    } catch (error) {
        console.error('Ошибка загрузки лабораторных:', error);
    }
}

function prime() {
    const trigger = document.getElementById('KalaytanovArtyom');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
        document.querySelectorAll('div, h1, h2, h3, h4, h5, a').forEach(element => {
            element.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
                    node.textContent = 'Калайтанов Артём';
                }
            });
        });
    });
}