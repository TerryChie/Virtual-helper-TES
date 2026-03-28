//////// sinusoida y(t) = A * sin(2PI * f * t + fi)
/*let A = 1;
let f = 5;
let t = 10;
let fs = 500;

let x = [];
let y = [];


for (let i = 0; i <= (fs * t); i++) {
    const tNow = i / fs;
    x.push(tNow);
    y.push(Math.sin(2 * Math.PI * f * tNow));
}

const trace = {
    x: x,
    y: y,
    type: 'scatter',
    line: {color: '#000000'}
}*/
/////////////////////
let f = 5;
let gd = document.getElementById('graph-test');
let fs = 1000;

function generateSignal(xStart, xEnd) {
    const x = [];
    const y = [];
    let step = 1/fs;

    for (let t = xStart; t <= xEnd; t += step) {
        x.push(t);
        y.push(Math.sin(2 * Math.PI * f * t));
    }
    return {x, y};
}

const initialData = generateSignal(0, 5)
Plotly.newPlot('graph-test', [{
    x: initialData.x,
    y: initialData.y,
    mode: 'line',
    type: 'scatter'
}]);

gd.on('plotly_relayout', function(eventdata) {

    if(eventdata['xaxis.range[0]'] !== undefined) {

        const xMin = eventdata['xaxis.range[0]']
        const xMax = eventdata['xaxis.range[1]']

        const newData = generateSignal(xMin, xMax);
        console.log(newData);
        Plotly.restyle(gd, {
            x: [newData.x],
            y: [newData.y]
        }, [0]);
    }
});
/////////////////////