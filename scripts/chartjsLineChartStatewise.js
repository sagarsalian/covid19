
/* global _, Chart */

var chartJsLineChartPlotStateWise = function (finalDataSet ,dateList ,chartId) {

    var speedCanvas = document.getElementById(chartId);

    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 12;

    var chartOptions = {
        scales: {
            xAxes: [{
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Date',
                        fontColor: "red",
                        fontSize: 20
                    }, ticks: {
                        padding: 5,
                        fontSize: 15
                    }
                }],
            yAxes: [{
                    // type: 'logarithmic',
                    scaleLabel: {
                        display: true,
                        labelString: 'Daily Confirmed Cases',
                        fontColor: "red",
                        fontSize: 20
                    }, ticks: {
                        //beginAtZero: true,
                        padding: 10,
                        fontSize: 15
                    }
                }]
        },
        layout: {
            padding: {
                left: 50,
                right: 50,
                top: 20,
                bottom: 20
            }
        },
        legend: {
            display: true,
            position: 'bottom',
            paddingBottom: 10,
            labels: {
                //boxWidth: 40,
                fontColor: 'black'
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

  // Data mapping 
    var finalLineChartData = {
        labels: dateList,
        datasets: finalDataSet
    };

    var lineChart = new Chart(speedCanvas, {
        type: 'line',
        data: finalLineChartData,
        options: chartOptions
    });




};