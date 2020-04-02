
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
                        labelString: 'Date',
                        fontColor: "brown"
                    }
                }],
            yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Daily Confirmed Cases',
                        fontColor: "brown"
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
    
    function getConfirmedCases(item) {        
        return parseInt(item.confirmed);
    }
    
    function getConfirmedCases2(item) {        
        return parseInt(item.Confirmed);
    }
   
   var finalDataSet = [];
    d3.csv("./datafiles/covid_19_india.csv", function (data) {
        // alert(JSON.stringify(data));
        var stateList = _.keys(_.countBy(data, function(data) { return data['State/UnionTerritory']; }));
        var dateList = _.keys(_.countBy(data, function(data) { return data.Date; })); 
        var dataProps = _.keys ();
        alert(JSON.stringify(stateList));
        
        var statewiseJsonData = _.groupBy(data, 'State/UnionTerritory');
        console.log(JSON.stringify(statewiseJsonData));
        var jarrMaxSize = dateList.length;
        
        var finalDataSet = [];
        stateList = [];
        stateList.push('Kerala');
        stateList.push('Telengana');
        _.each(stateList, function (statename) {
                var filteredData = statewiseJsonData[statename];
                alert(statename + " size is " + filteredData.length);
                finalDataSet.push({
                    label: statename,
                    lineTension: 0,
                    fill: false,
                    spanGaps: true, /**/
                    borderColor: stringToColour(statename),
                    data: filteredData.map(obj => getConfirmedCases2(obj))
                });               
        });
        // alert(JSON.stringify(finalDataSet));
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
        /*        
       var finalLineChartData = {
            labels: dateList,
            datasets: finalDataSet
        };
    
        var lineChart = new Chart(speedCanvas, {
            type: 'line',
            data: finalLineChartData,
            options: chartOptions
        }); */
    });

    

};