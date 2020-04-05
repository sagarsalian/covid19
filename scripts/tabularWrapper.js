
/* global d3, _ */

var columnMapFn1 = function (arg) {
    if (arg === "confirmedArray") {
        return "Last 7 Days";
    } else if (arg === "lastIncreasedValue") {
        return "Cases Today";
    }
    return arg;
};

var tabularPlot = function (chartId1) {

    var columns = ['SI' ,'state', 'lastIncreasedValue' ,'confirmedArray'];
    

    d3.csv("./datafiles/covid_19_india.csv", function (data) {
        var storeData = data;
        var stateList = _.keys(_.countBy(storeData, function (d) {
            return d['State/UnionTerritory'];
        }));
        var dateList = _.keys(_.countBy(storeData, function (d) {
            return d.Date;
        }));
        $('#tab2SpanId1').text("Updated on " + parseDateFmt(dateList[dateList.length - 1]));
        var statewiseJsonData = _.groupBy(storeData, 'State/UnionTerritory');
        
        var tabularDataSet = [];
        _.each(stateList, function (statename) {
            var filteredData = statewiseJsonData[statename];
            var correctedData = fillMissingData(dateList, filteredData);
            var confirmedArray = correctedData.map(obj => getConfirmedCases(obj));
            var lastConfirmedValue = confirmedArray[confirmedArray.length - 1];
            var lastIncreasedValue = confirmedArray[confirmedArray.length - 1] - confirmedArray[confirmedArray.length - 2];
            // console.log(statename+","+confirmedArray[confirmedArray.length - 1] +" ," + confirmedArray[confirmedArray.length - 2]);
            // Last 7 days data
            confirmedArray = confirmedArray.slice(confirmedArray.length - 1 - 6, confirmedArray.length);
            tabularDataSet.push({"state": statename,
                "confirmedArray": confirmedArray, "maxConfirmed": lastConfirmedValue ,"lastIncreasedValue":lastIncreasedValue  });
        });
        var maxConfirmedValue = getMaxValue(tabularDataSet,'maxConfirmed');
        var sortedDescTopNStates = _.sortBy(tabularDataSet, 'maxConfirmed').reverse();// .slice(startIndex, endIndex);
        var data = [];
        var serialNo=0;
        _.each(sortedDescTopNStates, function (myData) {
            // Fill array elemts with columns order
            var n = new Array(++serialNo ,myData.state,myData.lastIncreasedValue,myData.confirmedArray);            
            data.push(n);
        });

        tabularLineGraphPrint(chartId1 ,columns ,data ,maxConfirmedValue ,columnMapFn1);

    });






};


