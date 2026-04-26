const FN  = 110;
const F0  = 14;
const FM  = 1;

const config = { responsive: true, displayModeBar: false };

function drawSpectrum(fG, m) {
    const fPR = Math.abs(fG - FN);
    const mFrac = m / 100;
    const inFreqs = [FN - FM, FN, FN + FM];
    const inAmps  = [mFrac / 2, 1.0, mFrac / 2];

    const outFreqs = [fPR - FM, fPR, fPR + FM];
    const outAmps  = inAmps.map(a => a * 0.4);

    const BW = 3;
    const filtered = outAmps.map((a, i) => {
        const df = outFreqs[i] - fPR;
        return a * Math.exp(-0.5 * Math.pow(df / (BW / 2), 2));
    });

    Plotly.react('graph-spectrum5', [
        {
            x: inFreqs, y: inAmps,
            type: 'bar', name: 'Входной АМ-сигнал',
            marker: { color: '#41A1D2' }, width: 0.4
        },
        {
            x: outFreqs, y: filtered,
            type: 'bar', name: `Выход (f_ПР = ${fPR.toFixed(0)} кГц)`,
            marker: { color: '#e05' }, width: 0.4
        }
    ], {
        title: { text: 'Спектры входного и выходного сигналов', font: { family: 'Inter', size: 15 } },
        xaxis: { title: 'Частота, кГц', range: [0, 130] },
        yaxis: { title: 'Амплитуда (отн. ед.)', range: [0, 1.2] },
        barmode: 'overlay',
        margin: { t: 40, r: 20, b: 50, l: 60 },
        paper_bgcolor: '#fff', plot_bgcolor: '#fff',
        font: { family: 'Inter' },
        legend: { orientation: 'h', y: -0.25 }
    }, config);
}

function drawWaves(fG, m) {
    const fPR = Math.abs(fG - FN);
    const mFrac = m / 100;
    const tArr = [], amIn = [], amOut = [];
    const T_mod = 1 / FM;
    const steps = 2000;

    for (let k = 0; k <= steps; k++) {
        const t = (k / steps) * 2 * T_mod * 1000;
        const tMs = t / 1000;                       // мс
        const env = 1 + mFrac * Math.cos(2 * Math.PI * FM * tMs);
        const uIn  = env * Math.cos(2 * Math.PI * FN * tMs);
        const uOut = env * 0.4 * Math.cos(2 * Math.PI * fPR * tMs);

        tArr.push(parseFloat(t.toFixed(2)));
        amIn.push(parseFloat(uIn.toFixed(4)));
        amOut.push(parseFloat(uOut.toFixed(4)));
    }

    Plotly.react('graph-wave5', [
        { x: tArr, y: amIn,  type: 'scatter', mode: 'lines',
          line: { color: '#41A1D2', width: 1 }, name: `Вход АМ (f_Н = ${FN} кГц)` },
        { x: tArr, y: amOut, type: 'scatter', mode: 'lines',
          line: { color: '#e05', width: 1 }, name: `Выход (f_ПР = ${fPR.toFixed(0)} кГц)` }
    ], {
        title: { text: 'Временные диаграммы (2 периода огибающей)', font: { family: 'Inter', size: 15 } },
        xaxis: { title: 'Время, мкс' },
        yaxis: { title: 'Амплитуда, В' },
        margin: { t: 40, r: 20, b: 60, l: 60 },
        paper_bgcolor: '#fff', plot_bgcolor: '#fff',
        font: { family: 'Inter' },
        legend: { orientation: 'h', y: -0.3 }
    }, config);
}

function update() {
    const fG  = parseInt(document.getElementById('fgSlider').value);
    const mod = parseInt(document.getElementById('modSlider').value);
    const fPR = Math.abs(fG - FN);

    document.getElementById('fgVal').textContent  = fG;
    document.getElementById('fprVal').textContent = fPR.toFixed(0);
    document.getElementById('modVal').textContent = mod;

    drawSpectrum(fG, mod);
    drawWaves(fG, mod);
}

document.getElementById('fgSlider').addEventListener('input', update);
document.getElementById('modSlider').addEventListener('input', update);

update();
