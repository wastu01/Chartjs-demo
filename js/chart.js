// Just learning how to add motion graphic base on original project
// https://www.groupworld.net/pingtest.html

Chart.defaults.font.size = 9;
Chart.defaults.elements.line.borderWidth = 2;


// 樣式定義區塊

const DISPLAY = true;
const BORDER = true;
const CHART_AREA = true;
const TICKS = true;

const backgroundColor = ['#177245'];
const borderColor = ['#177245'];



// 資料定義區塊 

// X軸允許出現的最大數量
const maxPoints = 10;

// (labels,dataValue) = (x,y)
const labels = ['尚未啟動', '尚未啟動', '尚未啟動', '尚未啟動', '尚未啟動', '尚未啟動'];
const dataValue = [0, 0, 0, 0, 0, 0];

console.log('初始末端資料：' + labels.slice(labels.length - 1));


const dataValue2 = [0, 0, 0, 0, 0, 0];
const defaultValue = 1;

dataValue2.fill(defaultValue);


// 可新增最新一筆的延遲時間 (未開發)
// 目前設置為固定值(defaultValue)

// 加入 datasets 即可
// ,{
//     label: '每一筆延遲時間',
//     backgroundColor: 'black',
//     borderColor: 'black',
//     borderWidth: 5,
//     data: dataValue2,
// }



//參數設定區塊

const data = {
    labels: labels,
    datasets: [{
        label: '平均延遲時間',
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 3,
        data: dataValue,
    }
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'index',
        },

        scales: {
            x: {
                grid: {
                    display: false,
                    color: 'gray',
                    width: 2,

                },
                ticks: {
                    color: 'black'
                },
                border: {
                    display: true,
                    dash: [6, 6],
                    color: 'black',
                }
            },
            y: {
                beginAtZero: true,
                //min: 0,     // 設定 y 軸的最小值
                //max: 10,    // 設定 y 軸的最大值
                grid: {
                    color: 'gray',
                    width: 2,

                },
                ticks: {
                    color: 'black',
                    // 其他 Y 軸設定...
                },
                border: {
                    dash: [6, 6],
                    color: 'black',
                },

            },

        },
    }
};



document.addEventListener('DOMContentLoaded', function () {
    initChart();

});

//渲染圖表區塊

function initChart() {

    //return myChart;

}

var ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, config);

//console.log(myChart);


function resetChart() {

    myChart.data.labels = [];
    myChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    myChart.update();

}


function updateChart(label, avgPingTime, lastPingTime) {

    addData(myChart, label, avgPingTime, 10);
    console.log('最新一筆延遲時間' + lastPingTime);
}

//資料更新區塊


//增加資料

function addData(myChart, label, newData, maxPoints) {

    //console.log(myChart);

    myChart.data.labels.push(label);
    myChart.data.datasets[0].data.push(newData);

    if(myChart.data.labels.length > maxPoints) {
        shiftValue(myChart);
    } else {
        myChart.update();
    }

    dataValue2.fill(defaultValue);

    //console.log(myChart.data.labels);

    let lastIndex = myChart.data.datasets[0].data.length;
    console.log("Ｘ軸固定數量:" + (lastIndex));

    myChart.update();

    console.log("末筆 X 軸標籤：" + labels.slice(labels.length - 1));

}

// document.getElementById('addDataButton').addEventListener('click', function () {
//     const currentSeconds = getCurrentSeconds(); // 從 time.js 獲取秒數
//     addData(myChart, currentSeconds, getRandomValue());

// });


//刪除資料

function popData(myChart) {
    myChart.data.labels.pop();
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    myChart.update();
}

// document.getElementById('popDataButton').addEventListener('click', function () {
//     popData(myChart);

// });


//首項增加預設資料

function unshiftValue(myChart) {

    labels.unshift('初始值');
    dataValue.unshift('9');
    console.log(labels);
    myChart.update();


}

//   document.getElementById('unshiftDataButton').addEventListener('click', function () {
//     unshiftValue(myChart);
//   });

//移除首項資料

function shiftValue(myChart) {

    myChart.data.labels.shift();
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    myChart.update();

    console.log('移除');
}

//   document.getElementById('shiftDataButton').addEventListener('click', function () {
//     shiftValue(myChart);
//   });

// 模擬假資料

function getRandomValue() {
    return Math.floor(Math.random() * 10);
}

//var clock = setTimeout(TimeOut, 1000);

function TimeOut() {
    //console.log("1time-out");

    const currentSeconds = getCurrentSeconds();
    addData(myChart, currentSeconds, getRandomValue());

}

//var clock = setInterval(Timer , 5000);

function Timer() {
    console.log("Keep counting");
    const currentSeconds = getCurrentSeconds();
    addData(myChart, currentSeconds, getRandomValue());

}