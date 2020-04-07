

/* global d3, _ */

var getArrayIndex = function (a , b,arrSize){
    if ( a < 0 && b < 0 ) { return [0 ,arrSize ,true]; }
    else if ( a >= 0 && b < 0 ) { return [a ,arrSize ,false]; }
    else if ( a >= 0 && b > 0 ) { return [a ,b ,false]; }
    else return [0 ,arrSize ,true];
};



var chartJsPlotTopN = function (startIdx ,endIdx ,chartId1, chartId2) {
    var allFlag = false;
    var startIndex = startIdx;
    var endIndex = endIdx;
    d3.csv("./datafiles/covid_19_india.csv", function (data) {
        var storeData = data;
        var stateList = _.keys(_.countBy(storeData, function (d) {
            return d['State/UnionTerritory'];
        }));
        var IndexObj = getArrayIndex (startIndex ,endIndex ,stateList.length);
        startIndex = IndexObj[0];
        endIndex = IndexObj[1];
        allFlag = IndexObj[2];
        
        var dateList = _.keys(_.countBy(storeData, function (d) {
            return d.Date;
        }));
        var dataPropsList = _.keys(storeData[0]);
        $('#stateDailyConfirmSpanId,#stateTotalSpanId')
                .text("Updated on " + parseDateFmt(dateList[dateList.length - 1]));
        var statewiseJsonData = _.groupBy(storeData, 'State/UnionTerritory');

        /*  State-Wise Total Confirmed and Death Cases  */

        var scatteredPlotDataSet = [];
        _.each(stateList, function (statename) {
            var filteredData = statewiseJsonData[statename];
            var confirmedArray = filteredData.map(obj => getConfirmedCases(obj));
            var deathArray = filteredData.map(obj => getDeathCases(obj));
            var curedArray = filteredData.map(obj => getCuredCases(obj));
            var currConfirmedCnt = (confirmedArray.length === 0)?0:confirmedArray[confirmedArray.length - 1];
            var currDeathCnt = (deathArray.length === 0)?0:deathArray[deathArray.length - 1];
            var currCuredCnt = (curedArray.length === 0)?0:curedArray[curedArray.length - 1];
            var totalConfirmDeathCnt = parseInt(currConfirmedCnt) + parseInt(currDeathCnt);
            var totalCnt = parseInt(currConfirmedCnt) + parseInt(currCuredCnt) + parseInt(currDeathCnt);
            scatteredPlotDataSet.push(
                    {"state": statename, "confirmed": currConfirmedCnt, "recovered": currCuredCnt, "death": currDeathCnt,
                        "totalConfirmDeath":totalConfirmDeathCnt,"total": totalCnt });
        });
        var sortedDescTopNStates = _.sortBy(scatteredPlotDataSet, 'confirmed').reverse().slice(startIndex, endIndex);
        var sortedStateList = getSortedStateList(sortedDescTopNStates); 
        // PLOT 2        
        chartJsScatteredPlotStateWise(sortedDescTopNStates, chartId2, sortedStateList, allFlag);
        

        /*  State-Wise Daily Confirmed Cases TOP N */

        var finalDataSet = [];
        _.each(sortedStateList, function (statename) {
            var filteredData = statewiseJsonData[statename];
            var correctedData = fillMissingData(dateList, filteredData);
            var confirmedArray = correctedData.map(obj => getConfirmedCases(obj));
            finalDataSet.push({
                label: statename,
                lineTension: 0,
                fill: false,
                pointRadius: 3,
                borderColor: stringToColour(statename),
                data: confirmedArray
            });
        });
        var obj1 = statewiseJsonData[finalDataSet[0].label];
        var maxValInDsLen = obj1.length;
        var maxValInDs = obj1[maxValInDsLen-1].Confirmed;
               
        // PLOT 1
        chartJsLineChartPlotStateWise(finalDataSet ,dateList ,chartId1 ,maxValInDs ,allFlag ,window.lineChartState1);
        
               
    });
};

