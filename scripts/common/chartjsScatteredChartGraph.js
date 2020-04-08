
/* global _ */

var chartJsScatteredPlotGraph = function (finalDataSet ,stateList ,chartId ,allFlag ,addlnObj ,updateType) {

    var xaxisScaleType = addlnObj.xaxisScale;
    var yaxisScaleType = addlnObj.yaxisScale;
    var chartElemt = document.getElementById(chartId);
    
    var legendLabel = {
        boxWidth: 50,
        padding: 15,
        fontColor: 'black',
        fontSize: 22
    };
    if (allFlag === true) {
        legendLabel = {
            fontColor: 'black',
            fontSize: 17
        };
    }

    var charttooltip = {
        callbacks: {
            label: function (tooltipItem, data) {
                // alert(data.datasets[tooltipItem.datasetIndex].label + "..."+data.datasets[tooltipItem.datasetIndex].x);
                // var addlnData = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

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
                    type: xaxisScaleType,
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
                    type: yaxisScaleType,
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


    window.scatteredChart = new Chart(chartElemt, {
        type: 'bubble', //scatter ,bubble
        data: {
            datasets: finalDataSet
        },
        options: chartOptions

    });
    

};


