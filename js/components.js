document.addEventListener("DOMContentLoaded", () => {
    loadLayout().then(() => {
        loadLabs(); // Загружаем лабы после того, как макет готов
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
                initNavigation();
            }
        }
    }
    document.body.classList.add('loaded');

    prime();
}

async function loadLabs() {
    const container = document.getElementById('lab-list');
    if (!container) return;

    try {
        const response = await fetch('/Virtual-helper-TES/js/labs.json'); // Укажите верный путь к json

        const labs = await response.json();
        const currentData = JSON.parse(localStorage.virtual_lab_progress)

        container.innerHTML = labs.map(lab => `
            <div class="lab-item">
                        <div class="lab-title font24px">${lab.title}</div>
                        <div class="lab-grade font18px bold">${currentData.labs[(lab.id - 1)].grade}</div>
                    </div>
        `).join('');
    } catch (error) {
        console.log(error);
    }
}

function initNavigation() {
    const currentPath = window.location.pathname;

    const navLinks = document.querySelectorAll('.nav-button');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        if (currentPath.includes(linkPath)) {
            link.classList.add('active');
        }
        if (currentPath === '/' && (linkPath === 'index.html' || linkPath === '/')) {
            link.classList.add('active');
        }
    });
}

function prime() {
    const KalaytanovArtyom = document.getElementById('KalaytanovArtyom');

    KalaytanovArtyom.addEventListener('click', () => {
        const AHAH_WW = document.querySelectorAll('div, h1, h2, h3, h4, h5, a');

        AHAH_WW.forEach(element => {
            element.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
                    node.textContent = 'Калайтанов Артём';
                }
            })
        })
    })
}