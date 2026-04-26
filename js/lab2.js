const IDSS = 5.0;
const U0   = -3.0;

const config = { responsive: true, displayModeBar: false };

function plotLayout(title, xLabel, yLabel) {
    return {
        title: { text: title, font: { family: 'Inter', size: 15 } },
        xaxis: { title: xLabel },
        yaxis: { title: yLabel },
        margin: { t: 40, r: 20, b: 50, l: 60 },
        paper_bgcolor: '#fff',
        plot_bgcolor: '#fff',
        font: { family: 'Inter' }
    };
}

function iC(e) {
    if (e <= U0) return 0;
    if (e >= 0)  return IDSS;
    return IDSS * Math.pow(1 - e / U0, 2);
}

function drawVAH(bias, amp) {
    // Кривая ВАХ
    const eArr = [], iArr = [];
    for (let e = U0 - 0.2; e <= 0.5; e += 0.05) {
        eArr.push(parseFloat(e.toFixed(3)));
        iArr.push(parseFloat(iC(e).toFixed(4)));
    }

    const i0 = iC(bias);

    const eMin = bias - amp;
    const eMax = bias + amp;
    const iMin = iC(eMin);
    const iMax = iC(eMax);

    Plotly.react('graph-vah', [
        { x: eArr, y: iArr, type: 'scatter', mode: 'lines',
          line: { color: '#41A1D2', width: 2 }, name: 'ВАХ i_С(E_СМ)' },

        { x: [bias], y: [i0], type: 'scatter', mode: 'markers',
          marker: { color: '#e05', size: 10 }, name: 'Рабочая точка' },

        { x: [eMin, eMax], y: [iMin, iMax], type: 'scatter', mode: 'markers',
          marker: { color: '#f90', size: 8, symbol: 'line-ns-open', line: { width: 2 } },
          name: 'Диапазон ±U_m' }
    ], plotLayout('ВАХ полевого транзистора i_С = f(E_СМ)', 'E_СМ, В', 'i_С, мА'), config);
}

function drawOutput(bias, amp) {
    const tArr = [], inArr = [], outArr = [];
    const f1 = 1000; // 1 кГц
    const fs = 50000;
    const cycles = 3;

    for (let i = 0; i <= fs * cycles / f1; i++) {
        const t = i / fs;
        const e = bias + amp * Math.sin(2 * Math.PI * f1 * t);
        tArr.push(parseFloat((t * 1000).toFixed(4)));
        inArr.push(parseFloat((amp * Math.sin(2 * Math.PI * f1 * t)).toFixed(4)));
        outArr.push(parseFloat(iC(e).toFixed(4)));
    }

    Plotly.react('graph-output', [
        { x: tArr, y: inArr, type: 'scatter', mode: 'lines',
          line: { color: '#41A1D2', width: 1.5 }, name: 'Вход u(t), В', yaxis: 'y' },
        { x: tArr, y: outArr, type: 'scatter', mode: 'lines',
          line: { color: '#e05', width: 1.5 }, name: 'Выход i_С(t), мА', yaxis: 'y2' }
    ], {
        ...plotLayout('Осциллограммы входного и выходного сигналов', 'Время, мс', ''),
        yaxis:  { title: 'u(t), В',     color: '#41A1D2' },
        yaxis2: { title: 'i_С(t), мА',  color: '#e05', overlaying: 'y', side: 'right' },
        legend: { orientation: 'h', y: -0.2 }
    }, config);
}

function update() {
    const bias = parseFloat(document.getElementById('biasSlider').value);
    const amp  = parseFloat(document.getElementById('ampSlider2').value);
    drawVAH(bias, amp);
    drawOutput(bias, amp);
}

document.getElementById('biasSlider').addEventListener('input', function() {
    document.getElementById('biasVal').textContent = parseFloat(this.value).toFixed(1);
    update();
});

document.getElementById('ampSlider2').addEventListener('input', function() {
    document.getElementById('ampVal2').textContent = parseFloat(this.value).toFixed(1);
    update();
});

update();
