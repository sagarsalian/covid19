
var chartJsScatteredPlotStateWise = function (data, chartId ,stateList ,allFlag) {

    if( window.scatteredChart!==undefined) {
         window.scatteredChart.destroy();
    } 
    var ctx = document.getElementById(chartId);
    
    var legendLabel = {
        boxWidth: 50,
        padding: 15,
        fontColor: 'black',
        fontSize: 20
    };
    if (allFlag === true) {
        legendLabel = {
            fontColor: 'black'
        };
    }

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
                    type: window.lineChartScalingType,
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Confirmed Cases',
                        fontColor: "red",
                        fontSize: 20
                    }, ticks: {
                        beginAtZero: true,
                        padding: 10,
                        fontSize: 15,
                        callback: function(value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                            return Number(value.toString());//pass tick values as a string into Number function
                        }
                    }
                }],
            yAxes: [{
                    type: window.lineChartScalingType,
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Death Cases',
                        fontColor: "red",
                        fontSize: 20
                    }, ticks: {
                        beginAtZero: true,
                        padding: 10,
                        fontSize: 15,
                        callback: function(value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                            return Number(value.toString());//pass tick values as a string into Number function
                        }
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
            labels: legendLabel
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

    window.scatteredChart = new Chart(ctx, {
        type: 'bubble', //scatter ,bubble
        data: {
            datasets: finalDataSet
        },
        options: chartOptions

    });
    

};


