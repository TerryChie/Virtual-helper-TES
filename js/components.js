document.addEventListener("DOMContentLoaded", () => {
    loadLayout();
});

async function loadLayout() {
    const layouts = [
        { id: 'header-placeholder', url: '/Virtual-helper-TES/assets/components/header.html' },
        { id: 'footer-placeholder', url: '/Virtual-helper-TES/assets/components/footer.html' }
    ];

    for (const item of layouts) {
        const target = document.getElementById(item.id);
        if (target) {
            try {
                const response = await fetch(item.url);
                if (response.ok) {
                    target.innerHTML = await response.text();
                    initNavigation();
                }
            } catch (err) {
                console.error(`Ошибка загрузки ${item.url}:`, err);
            }
        }
    }
    document.body.classList.add('loaded');

    prime();
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