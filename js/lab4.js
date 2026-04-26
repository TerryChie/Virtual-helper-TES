const IDSS = 5.0;
const U0   = -3.0;

const config = { responsive: true, displayModeBar: false };

function iC(e) {
    if (e <= U0) return 0;
    if (e >= 0)  return IDSS;
    return IDSS * Math.pow(1 - e / U0, 2);
}

function harmonic(bias, amp, n) {
    const N = 2000;
    let cosSum = 0, sinSum = 0;
    for (let k = 0; k < N; k++) {
        const theta = (2 * Math.PI * k) / N;
        const e = bias + amp * Math.cos(theta);
        const i = iC(e);
        cosSum += i * Math.cos(n * theta);
        sinSum += i * Math.sin(n * theta);
    }
    if (n === 0) return Math.abs(cosSum / N);
    return Math.sqrt(Math.pow(2 * cosSum / N, 2) + Math.pow(2 * sinSum / N, 2));
}

function drawSpectrum(theta_deg, nSelected) {
    const theta = theta_deg * Math.PI / 180;
    const amp  = 1.5;
    const bias = U0 + amp * Math.cos(theta);

    const nMax = 6;
    const ns = [], amps = [], colors = [];
    for (let n = 0; n <= nMax; n++) {
        ns.push(n === 0 ? 'DC' : `${n}f`);
        const a = harmonic(bias, amp, n);
        amps.push(parseFloat(a.toFixed(4)));
        colors.push(n === nSelected ? '#e05' : '#41A1D2');
    }

    Plotly.react('graph-spectrum4', [{
        x: ns, y: amps,
        type: 'bar',
        marker: { color: colors },
        name: 'Амплитуды гармоник'
    }], {
        title: { text: `Спектр тока стока при θ = ${theta_deg}°`, font: { family: 'Inter', size: 15 } },
        xaxis: { title: 'Гармоника' },
        yaxis: { title: 'Амплитуда, мА' },
        margin: { t: 40, r: 20, b: 50, l: 60 },
        paper_bgcolor: '#fff', plot_bgcolor: '#fff',
        font: { family: 'Inter' }
    }, config);

    return { bias, amp };
}

function drawCurrentWave(bias, amp) {
    const f0 = 14000;
    const fs = 400000;
    const cycles = 3;
    const tArr = [], iArr = [];

    for (let k = 0; k <= fs * cycles / f0; k++) {
        const t = k / fs;
        const e = bias + amp * Math.cos(2 * Math.PI * f0 * t);
        tArr.push(parseFloat((t * 1e6).toFixed(2)));
        iArr.push(parseFloat(iC(e).toFixed(4)));
    }

    Plotly.react('graph-current4', [{
        x: tArr, y: iArr,
        type: 'scatter', mode: 'lines',
        line: { color: '#41A1D2', width: 2 },
        name: 'i_С(t)'
    }], {
        title: { text: 'Форма тока стока i_С(t)', font: { family: 'Inter', size: 15 } },
        xaxis: { title: 'Время, мкс' },
        yaxis: { title: 'i_С, мА' },
        margin: { t: 40, r: 20, b: 50, l: 60 },
        paper_bgcolor: '#fff', plot_bgcolor: '#fff',
        font: { family: 'Inter' }
    }, config);
}

function update() {
    const theta = parseInt(document.getElementById('thetaSlider').value);
    const n     = parseInt(document.getElementById('nSlider').value);
    document.getElementById('thetaVal').textContent = theta;
    document.getElementById('nVal').textContent = n;
    const { bias, amp } = drawSpectrum(theta, n);
    drawCurrentWave(bias, amp);
}

document.getElementById('thetaSlider').addEventListener('input', update);
document.getElementById('nSlider').addEventListener('input', update);

update();
