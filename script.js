// Just leraning how to add motion graphic base on it


const labels = ["time", "2", "3", "Green", "Purple", "Orange"];

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
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,

        }]  
    },
    options: {
        layout: {
            padding: 1
        }
    },
    // plugins: [plugin],

});