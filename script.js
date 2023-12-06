// Just leraning how to add motion graphic base on it


const labels = ["time", "1", "2", "3", "4", "5"];

console.log(typeof labels);

const datas = [1.1,2.2,3.5,4.4,5.3,6.4];

console.log(typeof datas);

var ctx = document.getElementById('myChart').getContext('2d');

var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels ,
        datasets: [{
            label: '數量',
            data: datas,
            backgroundColor: '#2194f9',
            borderColor: '#2196f3',
            borderWidth: 1,

        }]  
    },
    options: {
        responsive: true,
        layout: {
            padding: 1
        }
    },
    // plugins: [plugin],

});