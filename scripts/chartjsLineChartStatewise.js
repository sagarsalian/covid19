
var chartJsLineChartPlotStateWise = function (chartId, arg1) {

    var speedCanvas = document.getElementById(chartId);

    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 12;

    var chartOptions = {
        scales: {
            xAxes: [{
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Positive Cases',
                        fontColor: "brown"
                    }
                }],
            yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Confirmed Cases',
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
                boxWidth: 40,
                fontColor: 'black'
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };
    
    function getConfirmedCases(item) {        
        return parseInt(item.confirmed);
    }
   
    // fetch Data
    d3.csv("./datafiles/statetWiseDailyData.csv", function (data) {

        var stateList = _.keys(_.countBy(data, function(data) { return data.state; })); 
        var dateList = _.keys(_.countBy(data, function(data) { return data.date; })); 

        var finalDataSet = [];
        
        _.each(stateList, function (statename) {
                var filteredData = data.filter(obj => obj.state === statename);
                finalDataSet.push({
                    label: statename,
                    lineTension: 0,
                    fill: false,
                    borderColor: stringToColour(statename),
                    data: filteredData.map(obj => getConfirmedCases(obj))
                });               
        });       
                
       var finalLineChartData = {
            labels: dateList,
            datasets: finalDataSet
        };
    
        var lineChart = new Chart(speedCanvas, {
            type: 'line',
            data: finalLineChartData,
            options: chartOptions
        });
    });

    

};