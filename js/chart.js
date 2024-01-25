// Just learning how to add motion graphic base on it

Chart.defaults.font.size = 20;
Chart.defaults.elements.line.borderWidth = 2;


// grid configuration

const DISPLAY = true;
const BORDER = true;
const CHART_AREA = true;
const TICKS = true;


// 樣式定義區塊

const backgroundColor = ['#45f4f7'];
const borderColor = ['#00bfaf'];



// 資料定義區塊 (labels,dataValue) = (x,y)
const labels = ['1筆', '2筆', '3筆', '4筆', '5筆', '6'];
const dataValue = [1, 0, 0, 0, 0, 0];
const defaultValue = 0;

console.log('初始起始資料：' + labels.indexOf('1筆'));
console.log('初始末端資料：' + labels.slice(labels.length - 1));


const dataValue2 = [0, 0, 0, 0, 0, 0];

dataValue2.fill(defaultValue);



//labels.shift();

//參數設定區塊

const data = {
    labels: labels,
    datasets: [{
        label: 'Ping RTT',
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 5,
        data: dataValue,
    }, {
        label: '基準值',
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 5,
        data: dataValue2,
    }
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        interaction: {
            intersect: true,
            mode: 'nearest',
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


// var myChart; // 圖表初始化變數宣告

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


function updateChart(label, avgPingTime) {

    addData(myChart, label, avgPingTime);
}

//資料更新區塊


//增加資料

function addData(myChart, label, newData) {

    //console.log(myChart);

    myChart.data.labels.push(label);

    myChart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);

    });

    dataValue2.fill(defaultValue);



    //shiftValue(myChart);

    //console.log(myChart.data.labels);
    let lastIndex = myChart.data.datasets[0].data.length;
    console.log("Ｘ軸固定數量:" + (lastIndex));

    myChart.update();

    //console.log("末筆資料："+myChart.data.labels[5]);

    console.log("末筆 X 軸標籤：" + labels.slice(labels.length - 1));

}

document.getElementById('addDataButton').addEventListener('click', function () {
    const currentSeconds = getCurrentSeconds(); // 從 time.js 獲取秒數
    addData(myChart, currentSeconds, getRandomValue());

});


//刪除資料

function popData(myChart) {
    myChart.data.labels.pop();
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    myChart.update();
}

document.getElementById('popDataButton').addEventListener('click', function () {
    popData(myChart);

});


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

    labels.shift();
    dataValue.shift();
    dataValue2.shift();
    myChart.update();


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