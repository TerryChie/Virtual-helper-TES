const TIME_WINDOW = 3;

let sampleRate = 20000;
let frequency = 1000; // Гц
let amplitude = 1.0;

function generateSignal(f, A) {
    const x = [], y = [];
    sampleRate = frequency * 25;
    const step = 1 / sampleRate;
    for (let t = 0; t <= TIME_WINDOW / 1000; t += step) {
        x.push(parseFloat(t.toFixed(6)));
        y.push(A * Math.sin(2 * Math.PI * f * t));
    }
    return { x, y };
}

function plotLayout(title, xLabel, yLabel) {
    return {
        title: { text: title, font: { family: 'Inter', size: 16 } },
        xaxis: { title: xLabel, color: '#000' },
        yaxis: { title: yLabel, color: '#000' },
        margin: { t: 40, r: 20, b: 50, l: 60 },
        paper_bgcolor: '#fff',
        plot_bgcolor: '#fff',
        font: { family: 'Inter' }
    };
}

const config = { responsive: true, displayModeBar: false };

function drawSignal(f, A) {
    const { x, y } = generateSignal(f, A);
    Plotly.react('graph-signal', [{
        x: x.map(t => t * 1000), // перевод в мс
        y,
        type: 'scatter',
        mode: 'lines',
        line: { color: '#41A1D2', width: 2 },
        name: 'Сигнал'
    }], plotLayout('Осциллограмма сигнала', 'Время, мс', 'Амплитуда'), config);
}

function drawSpectrum(f, A) {
    const freqs = [f / 1000]; // в кГц
    const amps  = [A];

    Plotly.react('graph-spectrum', [{
        x: freqs,
        y: amps,
        type: 'bar',
        marker: { color: '#41A1D2' },
        width: 0.05,
        name: 'Спектр'
    }], plotLayout('Амплитудный спектр сигнала', 'Частота, кГц', 'Амплитуда'), config);
}

function update() {
    drawSignal(frequency, amplitude);
    drawSpectrum(frequency, amplitude);
}

const freqSlider = document.getElementById('freqSlider');
const ampSlider  = document.getElementById('ampSlider');
const freqVal    = document.getElementById('freqVal');
const ampVal     = document.getElementById('ampVal');

freqSlider.addEventListener('input', () => {
    frequency = parseFloat(freqSlider.value) * 1000;
    freqVal.textContent = freqSlider.value;
    update();
});

ampSlider.addEventListener('input', () => {
    amplitude = parseFloat(ampSlider.value);
    ampVal.textContent = amplitude.toFixed(1);
    update();
});

update();
