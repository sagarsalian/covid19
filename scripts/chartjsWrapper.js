

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

var chartJsPlot = function (chartId1, chartId2) {

    d3.csv("./datafiles/covid_19_india.csv", function (data) {
        var storeData = data;
        //storeData = storeData.filter(obj => obj.Sno > 317);
        var stateList = _.keys(_.countBy(storeData, function (d) {
            return d['State/UnionTerritory'];
        }));
        var dateList = _.keys(_.countBy(storeData, function (d) {
            return d.Date;
        }));
        var dataPropsList = _.keys(storeData[0]);
        var statewiseJsonData = _.groupBy(storeData, 'State/UnionTerritory');
        
        /*  State-Wise Daily Confirmed Cases  */
        $('#stateDailyConfirmedId').text("Updated on " + parseDateFmt(dateList[dateList.length - 1]) );//temporary !!

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
        chartJsLineChartPlotStateWise(finalDataSet, dateList, chartId1);

        /*  State-Wise Total Confirmed and Death Cases  */
        $('#stateTotalId').text("Updated on " + dateList[dateList.length - 1] + "20");//temporary !!
        
        var scatteredPlotDataSet = [];
        _.each(stateList, function (statename) {
            var filteredData = statewiseJsonData[statename];
            var confirmedArray = filteredData.map(obj => getConfirmedCases(obj));
            var deathArray = filteredData.map(obj => getDeathCases(obj));
            var curedArray = filteredData.map(obj => getCuredCases(obj));
            var currConfirmedCnt = confirmedArray[confirmedArray.length - 1];
            var currDeathCnt = deathArray[deathArray.length - 1];
            var currCuredCnt = curedArray[curedArray.length - 1];
            scatteredPlotDataSet.push(
                    {"state": statename, "confirmed": currConfirmedCnt, "recovered": currCuredCnt, "death": currDeathCnt});         
        });

        // PLOT 2
        chartJsScatteredPlotStateDistrictWise(scatteredPlotDataSet, chartId2);

    });
};

