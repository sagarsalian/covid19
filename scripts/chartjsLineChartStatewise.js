
/* global _, Chart */

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
                    // type: 'logarithmic',
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
    
    // line chart fill missing data
    function fillMissingData(dateList ,filteredData){
        var newArray = [];
        // Fill all date's corresponding value points with zero
        _.each(dateList, function (s1) {
                var myobj = new Object();
                myobj.Confirmed = 0;
                myobj.Date  = s1;
                newArray.push(myobj);
        });        
        // Fill valid point values
        var i = 0;
        _.each(filteredData, function (s2) {//O(n*2) operation            
            var myobj = new Object();
            myobj.Confirmed = s2.Confirmed;
            myobj.Date = s2.Date;
            for (var h=0 ;h < newArray.length ; h++) { 
                var indexStart = (h-1)<0 ? 0 : (h-1);
                var indexEnd = h;
                if(newArray[h].Date === s2.Date) {
                    newArray[h] = myobj;
                }
            }
            i = i + 1;
        });
       
       return newArray;
    }
   
    
    d3.csv("./datafiles/covid_19_india.csv", function (data) {
 
        var storeData = data;
        //storeData = storeData.filter(obj => obj.Sno > 317);
        var stateList = _.keys(_.countBy(storeData, function(d) { return d['State/UnionTerritory']; }));
        var dateList = _.keys(_.countBy(storeData, function(d) { return d.Date; })); 
        var dataPropsList = _.keys(storeData[0]);
        
        var statewiseJsonData = _.groupBy(storeData, 'State/UnionTerritory');
        var jarrMaxSize = dateList.length;
        
        var finalDataSet = [];
        _.each(stateList, function (statename) {
                var filteredData = statewiseJsonData[statename];
                var correctedData = fillMissingData(dateList ,filteredData);
                //alert(JSON.stringify(correctedData));
                var confirmedArray = correctedData.map(obj => getConfirmedCases2(obj));
                // alert(confirmedArray + " size is " + confirmedArray.length);
                finalDataSet.push({
                    label: statename,
                    lineTension: 0,
                    fill: false,
                    pointRadius : 3,
                    borderColor: stringToColour(statename),
                    data: confirmedArray
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
    

};