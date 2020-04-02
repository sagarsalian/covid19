
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
                        fontColor: "red"
                    }
                }],
            yAxes: [{
                    // type: 'logarithmic',
                    scaleLabel: {
                        display: true,
                        labelString: 'Daily Confirmed Cases',
                        fontColor: "red"
                    }, ticks: {
                        //beginAtZero: true,
                        padding: 10
                    }
                }]
        },
        layout: {
            padding: {
                left: 50,
                right: 50,
                top: 30,
                bottom: 20
            }
        },
        legend: {
            display: true,
            position: 'bottom',
            paddingBottom: 10,
            labels: {
                boxWidth: 40,
                fontColor: 'black'
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

 

    

    

    // var jarrMaxSize = dateList.length;

    /*var finalDataSet = [];
    _.each(stateList, function (statename) {
        var filteredData = statewiseJsonData[statename];
        var correctedData = fillMissingData(dateList, filteredData);
        //alert(JSON.stringify(correctedData));
        var confirmedArray = correctedData.map(obj => getConfirmedCases(obj));
        finalDataSet.push({
            label: statename,
            lineTension: 0,
            fill: false,
            pointRadius: 3,
            borderColor: stringToColour(statename),
            data: confirmedArray
        });
    });*/

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