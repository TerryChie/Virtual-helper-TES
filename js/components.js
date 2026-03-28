document.addEventListener("DOMContentLoaded", () => {
    loadLayout();
});

async function loadLayout() {
    console.log('1321312');
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