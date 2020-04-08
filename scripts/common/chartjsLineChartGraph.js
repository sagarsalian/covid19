
/* global _, Chart, lineChartVar */

var chartJsLineChartGraph = function (finalDataSet, dateList, chartId, allFlag ,addlnObj ,updateType) {

    /*
     if( id!==undefined) {
     id.destroy();
     }*/
    var yaxisScaleType = addlnObj.yaxisScale;
    var chartElemt = document.getElementById(chartId);

    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 12;

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
                    type: yaxisScaleType, //'logarithmic',
                    scaleLabel: {
                        display: true,
                        labelString: 'Daily Confirmed Cases',
                        fontColor: "red",
                        fontSize: 20
                    }, ticks: {
                        //beginAtZero: true,
                        padding: 10,
                        fontSize: 15,
                        callback: function (value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                            return Number(value.toString());//pass tick values as a string into Number function
                        }
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
            labels: legendLabel,
            // on click disable other legends plot feature !!
            onClick: function (e, legendItem) {
                var index = legendItem.datasetIndex;
                var ci = this.chart;
                var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

                ci.data.datasets.forEach(function (e, i) {
                    var meta = ci.getDatasetMeta(i);

                    if (i !== index) {
                        if (!alreadyHidden) {
                            meta.hidden = meta.hidden === null ? !meta.hidden : null;
                        } else if (meta.hidden === null) {
                            meta.hidden = true;
                        }
                    } else if (i === index) {
                        meta.hidden = null;
                    }
                });

                ci.update();
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

    var lineChartVar = new Chart(chartElemt, {
        type: 'line',
        data: finalLineChartData,
        options: chartOptions
    });




};