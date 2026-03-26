// main.js
document.addEventListener("DOMContentLoaded", () => {
    loadLayout();
});

async function loadLayout() {
    // Массив элементов для загрузки
    const layouts = [
        { id: 'header-placeholder', url: '../components/header.html' },
        { id: 'footer-placeholder', url: '../components/footer.html' }
    ];

    for (const item of layouts) {
        const target = document.getElementById(item.id);
        if (target) {
            try {
                const response = await fetch(item.url);
                if (response.ok) {
                    target.innerHTML = await response.text();
                    // Здесь можно вызвать функцию инициализации меню, 
                    // если оно находится внутри хедера
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
    // 1. Получаем путь текущей страницы (например, "/index.html" или "/labs.html")
    // Если мы на главной (просто домен), pathname будет "/"
    const currentPath = window.location.pathname;

    // 2. Находим все ссылки в навигации
    const navLinks = document.querySelectorAll('.nav-button');

    navLinks.forEach(link => {
        // Получаем атрибут href ссылки (например, "index.html")
        const linkPath = link.getAttribute('href');

        // 3. Проверяем, совпадает ли адрес ссылки с текущим адресом
        // Используем .includes(), чтобы корректно работало и с полными путями
        if (currentPath.includes(linkPath)) {
            link.classList.add('active');
        }

        // Обработка главной страницы, если путь пустой или "/"
        if (currentPath === '/' && (linkPath === 'index.html' || linkPath === '/')) {
            link.classList.add('active');
        }
    });
    console.log("Общая навигация готова");
}