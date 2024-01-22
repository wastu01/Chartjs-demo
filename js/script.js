// Just learning how to add motion graphic base on it

const pinglabels = ["0", "1", "2", "3", "4", "5"];

console.log(typeof labels);

const datas = [2.1,2.2,3.5,4.4,5.3,6.4];

console.log(typeof datas);

var ctx = document.getElementById('myChart').getContext('2d');

var mychart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: pinglabels ,
        datasets: [{
            label: '數量',
            data: datas,
            backgroundColor: '#2194f9',
            borderColor: '#2196f3',
            borderWidth: 1,

        }]  
    },
    options: {
        title: {
            display: true,
            text: 'Ping-test-Chart'
        },
        responsive: true,
        layout: {
            padding: 1
        },
        scales: {
            y: {
              beginAtZero: true
            }
          }
    },
    // plugins: [plugin],

});

    // var newData = [1.1,2.2,3.5,4.4,5.3,6.4]; 
    // var newLabel = ["6", "7", "8", "9", "10", "11"];

function addData(chart, label, newData) {
    chart.data.labels.push(label); 
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData); 
    });
    chart.update();
}


document.getElementById('addDataButton').addEventListener('click', function() {
    addData(mychart, "5", [1.1]); 

});

mychart.canvas.parentNode.style.height = '500px';