// Just learning how to add motion graphic base on it

Chart.defaults.font.size = 20;
Chart.defaults.elements.line.borderWidth = 5;


// grid configuration

const DISPLAY = true;
const BORDER = true;
const CHART_AREA = true;
const TICKS = true;


// fake dataset

const labels = ["0", "1", "2", "3", "4", "5"];

console.log(typeof labels);

const datas = [2.3, 1.2, 1.5, 1.4, 1.3, 1.4];

console.log(typeof datas);

var ctx = document.getElementById('myChart').getContext('2d');

var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Ping Time',
            data: datas,
            backgroundColor: '#fffcf5',
            borderColor: '#27ae60',
            borderWidth: 4,

        }]
    },
    options: {
        responsive: true,

        interaction: {
            intersect: false,
            mode: 'index',
        },
        layout: {
            padding: 1
        },
        scales: {
            x: {
                ticks: {
                    color: 'black',
                },
                grid: {
                    display: DISPLAY,
                    drawOnChartArea: CHART_AREA,
                    drawTicks: TICKS,
                    color: '#ffffff44',
                    width: 2,
                },
                border: {
                    display: DISPLAY,
                    dash: [6, 6],
                    color: 'black',
                }

            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'black',
                    // 其他 Y 軸設定...
                },
                grid:{
                    color: '#ffffff44',
                    width: 2,

                },
                border: {
                    dash: [6, 6],
                    color: 'black',
                },
                

            }
        },
        plugins: {
            title: {
                display: true,
                text: '圖表顯示處',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
             

        }


    },


});


function addData(chart, label, newData) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });
    chart.update();
}


document.getElementById('addDataButton').addEventListener('click', function () {
    addData(chart, "5", [3.1]);

});

function addData(chart, label, newData) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });
    chart.update();
}


document.getElementById('popDataButton').addEventListener('click', function () {
    addData(chart, "5", [3.1]);

});