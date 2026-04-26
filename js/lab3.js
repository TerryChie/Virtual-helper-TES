const IDSS = 5.0;
const U0   = -3.0;
const KU   = 4.0;
const KU_Q_LOW = 1.8;

const config = { responsive: true, displayModeBar: false };

let isLinear   = true;
let highQ      = true;

function iC(e) {
    if (e <= U0) return 0;
    if (e >= 0)  return IDSS;
    return IDSS * Math.pow(1 - e / U0, 2);
}

function firstHarmonic(bias, amp) {
    const N = 1000;
    let sum = 0;
    for (let k = 0; k < N; k++) {
        const theta = (2 * Math.PI * k) / N;
        const e = bias + amp * Math.cos(theta);
        sum += iC(e) * Math.cos(theta);
    }
    return Math.abs((2 / N) * sum); // мА
}

function ampChar(bias) {
    const uMax = isLinear ? 2.0 : 4.0;
    const uArr = [], yArr = [];
    const ku = highQ ? KU : KU_Q_LOW;
    for (let u = 0; u <= uMax; u += 0.05) {
        const i1 = firstHarmonic(bias, u);
        uArr.push(parseFloat(u.toFixed(3)));
        yArr.push(parseFloat((i1 * ku / 1000).toFixed(4))); // В
    }
    return { uArr, yArr };
}

function drawAmpChar() {
    const bias  = isLinear ? U0 / 2 : U0;
    const label = isLinear ? 'Линейный режим (Е_СМ = u₀/2)' : 'Нелинейный режим (Е_СМ = u₀, θ = 90°)';
    const { uArr, yArr } = ampChar(bias);

    let linearLimit = uArr[uArr.length - 1];
    for (let i = 2; i < yArr.length; i++) {
        const slope = yArr[i] - yArr[i - 1];
        const prevSlope = yArr[i - 1] - yArr[i - 2];
        if (prevSlope > 0.001 && slope < prevSlope * 0.7) {
            linearLimit = uArr[i - 1];
            break;
        }
    }

    Plotly.react('graph-amp', [
        {
            x: uArr, y: yArr,
            type: 'scatter', mode: 'lines',
            line: { color: '#41A1D2', width: 2 },
            name: label
        },
        {
            x: [linearLimit, linearLimit], y: [0, Math.max(...yArr)],
            type: 'scatter', mode: 'lines',
            line: { color: '#e05', width: 1.5, dash: 'dash' },
            name: `U_ВХmax ≈ ${linearLimit.toFixed(2)} В`
        }
    ], {
        title: { text: 'Амплитудная характеристика U_ВЫХ = f(U_ВХ)', font: { family: 'Inter', size: 15 } },
        xaxis: { title: 'U_ВХ, В' },
        yaxis: { title: 'U_ВЫХ, В' },
        margin: { t: 40, r: 20, b: 50, l: 60 },
        paper_bgcolor: '#fff', plot_bgcolor: '#fff',
        font: { family: 'Inter' },
        legend: { orientation: 'h', y: -0.25 }
    }, config);
}

function drawWaveforms() {
    const bias  = isLinear ? U0 / 2 : U0;
    const amp   = isLinear ? 0.5 : 1.5;
    const ku    = highQ ? KU : KU_Q_LOW;
    const f0    = 14000;
    const fs    = 500000;
    const cycles = 4;

    const tArr = [], inArr = [], icArr = [], outArr = [];

    for (let k = 0; k <= fs * cycles / f0; k++) {
        const t     = k / fs;
        const theta = 2 * Math.PI * f0 * t;
        const e     = bias + amp * Math.cos(theta);
        const ic    = iC(e);

        const i1 = firstHarmonic(bias, amp);
        const uOut = (i1 * ku / 1000) * Math.cos(theta + Math.PI);

        tArr.push(parseFloat((t * 1e6).toFixed(2)));
        inArr.push(parseFloat((amp * Math.cos(theta)).toFixed(4)));
        icArr.push(parseFloat(ic.toFixed(4)));
        outArr.push(parseFloat(uOut.toFixed(4)));
    }

    const qLabel = highQ ? 'высокая (R_Ш выкл.)' : 'низкая (R_Ш вкл.)';

    Plotly.react('graph-wave', [
        { x: tArr, y: inArr,  type: 'scatter', mode: 'lines',
          line: { color: '#41A1D2', width: 1.5 }, name: 'u_ВХ(t), В' },
        { x: tArr, y: icArr,  type: 'scatter', mode: 'lines',
          line: { color: '#f90', width: 1.5 }, name: 'i_С(t), мА', yaxis: 'y2' },
        { x: tArr, y: outArr, type: 'scatter', mode: 'lines',
          line: { color: '#e05', width: 1.5 }, name: `u_ВЫХ(t) LC, Q ${qLabel}, В` }
    ], {
        title: { text: 'Осциллограммы сигналов', font: { family: 'Inter', size: 15 } },
        xaxis: { title: 'Время, мкс' },
        yaxis:  { title: 'Напряжение, В', color: '#41A1D2' },
        yaxis2: { title: 'Ток, мА', color: '#f90', overlaying: 'y', side: 'right' },
        margin: { t: 40, r: 70, b: 60, l: 60 },
        paper_bgcolor: '#fff', plot_bgcolor: '#fff',
        font: { family: 'Inter' },
        legend: { orientation: 'h', y: -0.3 }
    }, config);
}

function update() {
    drawAmpChar();
    drawWaveforms();
}

document.getElementById('btnLinear').addEventListener('click', function() {
    isLinear = true;
    this.classList.add('lab-toggle-active');
    document.getElementById('btnNonlinear').classList.remove('lab-toggle-active');
    update();
});

document.getElementById('btnNonlinear').addEventListener('click', function() {
    isLinear = false;
    this.classList.add('lab-toggle-active');
    document.getElementById('btnLinear').classList.remove('lab-toggle-active');
    update();
});

document.getElementById('qSlider').addEventListener('input', function() {
    highQ = this.value === '1';
    document.getElementById('qVal').innerHTML = highQ
        ? 'высокая (R<sub>Ш</sub> выкл.)'
        : 'низкая (R<sub>Ш</sub> вкл.)';
    update();
});

update();
