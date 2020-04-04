

/* global d3, _ */

// line chart fill missing data
function fillMissingData(dateList, filteredData) {
    var newArray = [];
    // Fill all date's corresponding value points with zero
    _.each(dateList, function (s1) {
        var myobj = new Object();
        myobj.Confirmed = 0;
        myobj.Date = s1;
        newArray.push(myobj);
    });
    // Fill valid point values
    var i = 0;
    _.each(filteredData, function (s2) {//O(n*2) operation            
        var myobj = new Object();
        myobj.Confirmed = s2.Confirmed;
        myobj.Date = s2.Date;
        for (var h = 0; h < newArray.length; h++) {
            var indexStart = (h - 1) < 0 ? 0 : (h - 1);
            var indexEnd = h;
            if (newArray[h].Date === s2.Date) {
                newArray[h] = myobj;
            }
        }
        i = i + 1;
    });

    return newArray;
}

// Array to be passed to get SUM of it
var sum = function (numbers) {
    return _.reduce(numbers, function (sum, n) {
        return sum + n;
    }, 0);
};

function getConfirmedCases(item) {
    return parseInt(item.Confirmed);
}

function getDeathCases(item) {
    return parseInt(item.Deaths);
}

function getCuredCases(item) {
    return parseInt(item.Cured);
}

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
            var currConfirmedCnt = confirmedArray[confirmedArray.length - 1];
            var currDeathCnt = deathArray[deathArray.length - 1];
            var currCuredCnt = curedArray[curedArray.length - 1];
            var totalCnt = parseInt(currConfirmedCnt) + parseInt(currCuredCnt) + parseInt(currDeathCnt);
            scatteredPlotDataSet.push(
                    {"state": statename, "confirmed": currConfirmedCnt, "recovered": currCuredCnt, "death": currDeathCnt, "total": totalCnt});
        });
        var sortedDescTopNStates = _.sortBy(scatteredPlotDataSet, 'confirmed')
                .reverse().slice(startIndex, endIndex);
        
        // PLOT 2
        chartJsScatteredPlotStateWise(sortedDescTopNStates, chartId2 ,allFlag);

        /*  State-Wise Daily Confirmed Cases TOP N */
        
        stateList = _.keys(_.countBy(sortedDescTopNStates, function (d) {
            return d['state'];
        }));

        var finalDataSet = [];
        _.each(stateList, function (statename) {
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

        // PLOT 1
        chartJsLineChartPlotStateWise(finalDataSet, dateList, chartId1 ,allFlag);


    });
};

