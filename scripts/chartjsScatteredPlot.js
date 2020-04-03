
var chartJsScatteredPlotStateDistrictWise = function (data, chartId) {

    var ctx = document.getElementById(chartId);

    var charttooltip = {
        callbacks: {
            label: function (tooltipItem, data) {
                //alert(data.datasets[tooltipItem.datasetIndex].label + "..."+data.datasets[tooltipItem.datasetIndex].x);
                var addlnData = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

                var finalLabel = 'State: ' + data.datasets[tooltipItem.datasetIndex].label
                        //+ ' ,District: ' + addlnData.other 
                        + ' ,Confirmed: ' + tooltipItem.xLabel
                        + ' ,Death: ' + tooltipItem.yLabel
                        ;

                return finalLabel;
            },
            labelColor: function (tooltipItem, chart) {
                return {
                    borderColor: 'rgb(255, 0, 0)',
                    backgroundColor: 'rgb(255, 0, 0)'
                };
            }
        }
    };

    var chartOptions = {
        scales: {
            xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Confirmed Cases',
                        fontColor: "red",
                        fontSize: 20
                    }, ticks: {
                        beginAtZero: true,
                        padding: 10,
                        fontSize: 15
                    }
                }],
            yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Death Cases',
                        fontColor: "red",
                        fontSize: 20
                    }, ticks: {
                        beginAtZero: true,
                        padding: 10,
                        fontSize: 15
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
                fontColor: "black"
            }
        },
        hitRadius: 2,
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        tooltips: charttooltip
    };

    function getConfirmedAndDeathCases(item, maxValue) {
        var points = new Object();
        points.x = parseInt(item.confirmed); // getNormalizedValue(0,100,0,10,item.confirmed);
        points.y = parseInt(item.death); // getNormalizedValue(0,100,0,10,item.death);
        var pointValue = (points.x + points.y);
        points.r = getNormalizedValue(0, maxValue, 5, 20, pointValue);
        // points.other = item.district;
        return points;
    }


    var stateList = _.keys(_.countBy(data, function (data) {
        return data.state;
    }));
    var confirmMaxVal = getMaxValue(data, "confirmed");
    var deathMaxVal = getMaxValue(data, "death");
    var recoveredMaxVal = getMaxValue(data, "recovered");
    var fullDataMaxVal = parseInt(confirmMaxVal) + parseInt(deathMaxVal);

    var finalDataSet = [];

    _.each(stateList, function (statename) {
        var filteredData = data.filter(obj => obj.state === statename);
        finalDataSet.push({
            label: statename,
            backgroundColor: stringToColour(statename),
            borderColor: stringToColour(statename),
            data: filteredData.map(obj => getConfirmedAndDeathCases(obj, fullDataMaxVal))
        });
    });

    var scatterChart = new Chart(ctx, {
        type: 'bubble', //scatter ,bubble
        data: {
            datasets: finalDataSet
        },
        options: chartOptions

    });


};


