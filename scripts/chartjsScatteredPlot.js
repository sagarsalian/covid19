

var ctx = document.getElementById('myChart');

var chartoptions = {
    scales: {
        xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
    },
    responsive: true, // Instruct chart js to respond nicely.
    maintainAspectRatio: false // Add to prevent default behaviour of full-width/height 
};

var chartdata1 = [{
        x: 1,
        y: 2
    }, {
        x: 0,
        y: 10
    }, {
        x: 10,
        y: 5
    }];
var chartdata2 = [{
        x: 1,
        y: 3
    }, {
        x: 0,
        y: 10
    }, {
        x: 9,
        y: 3
    }];

var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
                label: 'Scatter Dataset KA',
                borderColor: '#2196f3',
                backgroundColor: '#2196f3',
                data: chartdata1
            },{
                label: 'Scatter Dataset MA',
                borderColor: 'red',
                backgroundColor: 'red',
                data: chartdata1
            }]
    },
    options: chartoptions
});
