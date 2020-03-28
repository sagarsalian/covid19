
var chartJsScatteredPlotStateDistrictWise = function (chartId, arg1) {

    var ctx = document.getElementById("" + chartId + "");

// Get Normalized Value API
    var getNormalizedValue = function (DataMin, DataMax, NormalizedMin, NormalizedMax, x) {
        var A = DataMin;
        var B = DataMax;
        var a = NormalizedMin;
        var b = NormalizedMax;
        var mapValue = 0;
        mapValue = a + ((x - A) * (b - a) / (B - A));
        return Math.round(mapValue);
    };

    var charttooltip = {
        callbacks: {
            label: function (tooltipItem, data) {
                //alert(data.datasets[tooltipItem.datasetIndex].label + "..."+data.datasets[tooltipItem.datasetIndex].x);
                var finalLabel = 'State: ' + data.datasets[tooltipItem.datasetIndex].label
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

    var chartoptions = {
        scales: {
            xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Positive Cases',
                        fontColor: "brown"
                    }, ticks: {
                        beginAtZero: true,
                        padding: 10
                    }
                }],
            yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Death Cases',
                        fontColor: "brown"
                    }, ticks: {
                        beginAtZero: true,
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
        points.r = getNormalizedValue(0, maxValue, 5, 20, item.confirmed);
        return points;
    }

// Read the data usin D3 APIS for ChartJS Plot
// or Ajax call can also be done 
    d3.csv("./scripts/d3StateDistrictWiseData.csv", function (data) {

        var filteredDataKAR = data.filter(obj => obj.state === 'Karnataka');
        var maxValKar = filteredDataKAR.sort(function (a, b)
        {
            return parseInt(b['confirmed']) - parseInt(a['confirmed']);
        })[0]['confirmed'];


        var filteredDataKerala = data.filter(obj => obj.state === 'Kerala');
        var maxValKer = filteredDataKAR.sort(function (a, b)
        {
            return parseInt(b['confirmed']) - parseInt(a['confirmed']);
        })[0]['confirmed'];
        
        var filteredDataMHA = data.filter(obj => obj.state === 'Maharashtra');
        var maxValMHA = filteredDataMHA.sort(function (a, b)
        {
            return parseInt(b['confirmed']) - parseInt(a['confirmed']);
        })[0]['confirmed'];

        var finalDataSet = [{
                label: 'Karnataka',
                borderColor: '#2196f3',
                backgroundColor: '#2196f3',
                data: filteredDataKAR.map(obj => getConfirmedAndDeathCases(obj, maxValKar))
            }, {
                label: 'Kerala',
                borderColor: 'brown',
                backgroundColor: 'brown',
                data: filteredDataKerala.map(obj => getConfirmedAndDeathCases(obj, maxValKer))
            }, {
                label: 'Maharashtra',
                borderColor: 'red',
                backgroundColor: 'red',
                data: filteredDataMHA.map(obj => getConfirmedAndDeathCases(obj, maxValMHA))
            }];

        var scatterChart = new Chart(ctx, {
            type: 'bubble', //scatter ,bubble
            data: {
                datasets: finalDataSet
            },
            options: chartoptions

        });

    });

};


