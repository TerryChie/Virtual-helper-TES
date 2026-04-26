document.addEventListener('DOMContentLoaded', () => {
    buildModal();
    bindQuizButton();
});

function buildModal() {
    const modal = document.createElement('div');
    modal.id = 'quizModal';
    modal.className = 'quiz-modal hidden';
    modal.innerHTML = `
        <div class="quiz-modal__backdrop"></div>
        <div class="quiz-modal__window">
            <button class="quiz-modal__close" id="quizClose" aria-label="Закрыть">✕</button>
            <div id="quizContent"></div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('quizClose').onclick = closeModal;
    modal.querySelector('.quiz-modal__backdrop').onclick = closeModal;

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });
}

function bindQuizButton() {
    const btn = document.getElementById('openQuiz');
    if (btn) btn.onclick = openQuiz;
}

function openQuiz() {
    if (typeof QUIZ_QUESTIONS === 'undefined' || !QUIZ_QUESTIONS.length) {
        console.error('QUIZ_QUESTIONS не определён на странице лабораторной');
        return;
    }
    renderQuiz();
    document.getElementById('quizModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeModal() {
    document.getElementById('quizModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function renderQuiz() {
    const content = document.getElementById('quizContent');
    content.innerHTML = `
        <h2 class="quiz-modal__title font24px bold">Тест по лабораторной работе</h2>
        <form id="quizForm">
            ${QUIZ_QUESTIONS.map((q, i) => `
                <div class="quiz-modal__question">
                    <div class="quiz-modal__question-text font18px bold">${i + 1}. ${q.question}</div>
                    <div class="quiz-modal__answers">
                        ${q.answers.map((a, j) => `
                            <label class="quiz-modal__answer font16px">
                                <input type="radio" name="q${i}" value="${j}">
                                ${a}
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            <button type="submit" class="quiz-modal__submit font18px bold">Сдать тест</button>
        </form>
    `;

    document.getElementById('quizForm').onsubmit = handleSubmit;
}

function handleSubmit(e) {
    e.preventDefault();

    let correct = 0;
    let answered = 0;

    QUIZ_QUESTIONS.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) {
            answered++;
            if (parseInt(selected.value) === q.correct) correct++;
        }
    });

    if (answered < QUIZ_QUESTIONS.length) {
        alert('Пожалуйста, ответьте на все вопросы.');
        return;
    }

    const grade = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
    saveGrade(grade);
    renderResult(correct, QUIZ_QUESTIONS.length, grade);
}

function renderResult(correct, total, grade) {
    const content = document.getElementById('quizContent');
    content.innerHTML = `
        <h2 class="quiz-modal__title font24px bold">Результат</h2>
        <div class="quiz-modal__result">
            <div class="quiz-modal__score font28px bold">${grade} / 100</div>
            <div class="font18px">Правильных ответов: ${correct} из ${total}</div>
            <button class="quiz-modal__submit font18px bold" id="quizRetry">Пройти ещё раз</button>
            <button class="quiz-modal__close-btn font18px" id="quizDone">Закрыть</button>
        </div>
    `;
    document.getElementById('quizRetry').onclick = renderQuiz;
    document.getElementById('quizDone').onclick = closeModal;
}

function saveGrade(grade) {
    const path = window.location.pathname;
    const labId = parseInt(path.split('/').pop().replace('.html', ''));
    if (isNaN(labId)) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    if (data.labs[labId - 1]) {
        data.labs[labId - 1].grade = grade;
        data.labs[labId - 1].completed = true;
        data.user_info.last_activity = new Date().toISOString().slice(0, 10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    const completionEl = document.getElementById('labCompletion');
    const gradeEl = document.getElementById('labGrade');
    if (completionEl) completionEl.innerText = 'Выполнена';
    if (gradeEl) gradeEl.innerText = grade;
}
