


/* global d3, _, sortedDescTopNStates */

var _rspObject = new Object();
_rspObject.lineChart1Id = "lineChart1";
_rspObject.lineChart2Id = "lineChart2";
_rspObject.scatteredChart1Id = "scatteredChart1";
_rspObject.tabular1Id = "tabular1";
_rspObject.allConfirmSortedStateFltrId = "tab2Fltr1";

var populateAllStateSelectList = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === arr[0]) {
            $('#' + _rspObject.allConfirmSortedStateFltrId)
                    .append('<option value="' + arr[i] + '" selected>' + arr[i] + '</option>');
        } else {
            $('#' + _rspObject.allConfirmSortedStateFltrId)
                    .append('<option value="' + arr[i] + '">' + arr[i] + '</option>');
        }
    }
};

var populateSelectList = function () {
    //init data
    var arrayList = [
        {"Id": "All", "Name": "All States"},
        {"Id": "Top5", "Name": "Top 5 States"},
        {"Id": "Top10", "Name": "Top 10 States"}
    ];
    var arrayList2 = [
        {"Id": "linear", "Name": "Linear"},
        {"Id": "logarithmic", "Name": "Logarithmic"}
    ];
    for (var i = 0; i < arrayList.length; i++) {
        if (arrayList[i].Id === "All") {
            $('#tab1Fltr1').append('<option value="' + arrayList[i].Id + '" selected>' + arrayList[i].Name + '</option>');
        } else {
            $('#tab1Fltr1').append('<option value="' + arrayList[i].Id + '">' + arrayList[i].Name + '</option>');
        }
    }
    for (var i = 0; i < arrayList2.length; i++) {
        if (arrayList2[i].Id === "All") {
            $('#tab1Fltr2').append('<option value="' + arrayList2[i].Id + '" selected>' + arrayList2[i].Name + '</option>');
            $('#tab2Fltr2').append('<option value="' + arrayList2[i].Id + '" selected>' + arrayList2[i].Name + '</option>');
        } else {
            $('#tab1Fltr2').append('<option value="' + arrayList2[i].Id + '">' + arrayList2[i].Name + '</option>');
            $('#tab2Fltr2').append('<option value="' + arrayList2[i].Id + '">' + arrayList2[i].Name + '</option>');
        }
    }

};

var columnMapFn1 = function (arg) {
    if (arg === "confirmedArray") {
        return "Last 7 Days";
    } else if (arg === "lastIncreasedValue") {
        return "Cases Today";
    }
    return arg;
};

var getArrayIndex = function (a, b, arrSize) {
    if (a < 0 && b < 0) {
        return [0, arrSize, true];
    } else if (a >= 0 && b < 0) {
        return [a, arrSize, false];
    } else if (a >= 0 && b > 0) {
        return [a, b, false];
    } else
        return [0, arrSize, true];
};

// Wrapper function

var callModuleFunc = function (data, stateList, dateList, addlnObj, allFlag, updateType, reportName) {
    if (reportName === "allStatesConfirmLineChart") {
        var chartId = _rspObject.lineChart1Id;
        //Multi Line Chart Data
        var lineDataSetConfirmed = [];
        _.each(stateList, function (statename) {
            var filteredData = data[statename];
            var correctedData = fillMissingData(dateList, filteredData);
            var confirmedArray = correctedData.map(obj => getConfirmedCases(obj));
            lineDataSetConfirmed.push({
                label: statename,
                lineTension: 0,
                fill: false,
                pointRadius: 3,
                borderColor: stringToColour(statename),
                data: confirmedArray
            });
        });
        chartJsLineChartGraph(lineDataSetConfirmed, dateList, chartId, allFlag, addlnObj, updateType);

    } else if (reportName === "stateWiseAllCatgLineChart") {
        var chartId = _rspObject.lineChart2Id;
        var filtrStateValue =  addlnObj.allConfirmSortedStateFltrVal;
        // Three Line charts with Single State selection passed in filter
        var lineDataSetConfirmed = [];
        var filteredData = data[filtrStateValue];
        var correctedData = fillMissingData(dateList, filteredData);
        var confirmedArray = correctedData.map(obj => getConfirmedCases(obj));
        var deathArray = correctedData.map(obj => getDeathCases(obj));
        var curedArray = correctedData.map(obj => getCuredCases(obj));
        lineDataSetConfirmed.push({
            label: "Confirmed",
            lineTension: 0,
            fill: false,
            pointRadius: 3,
            borderColor: "orange",
            data: confirmedArray
        },{
            label: "Cured",
            lineTension: 0,
            fill: false,
            pointRadius: 3,
            borderColor: "blue",
            data: curedArray
        },{
            label: "Death",
            lineTension: 0,
            fill: false,
            pointRadius: 3,
            borderColor: "red",
            data: deathArray
        });
        
        chartJsLineChartGraph(lineDataSetConfirmed, dateList, chartId, allFlag, addlnObj, updateType);

    } else if (reportName === "allStatesConfirmScatteredChart") {
        var chartId = _rspObject.scatteredChart1Id;
        var fullDataMaxVal = addlnObj.maxConfirmDeathValue;
        var scatteredDataSet = [];
        _.each(stateList, function (statename) {
            var filteredData = data.filter(obj => obj.state === statename);
            scatteredDataSet.push({
                label: statename,
                backgroundColor: stringToColour(statename),
                borderColor: stringToColour(statename),
                data: filteredData.map(obj => getConfirmedAndDeathCases(obj, fullDataMaxVal))
            });
        });
        chartJsScatteredPlotGraph(scatteredDataSet ,stateList ,chartId ,allFlag ,addlnObj ,updateType);

    } else if (reportName === "allStatesConfirmTabular") {
        var chartId = _rspObject.tabular1Id;
        var maxValue = addlnObj.maxConfirmedValue;
        var columns = ['SI' ,'state', 'lastIncreasedValue' ,'confirmedArray'];
        tabularAndLineGraphPrint(data ,columns ,chartId ,maxValue ,addlnObj ,columnMapFn1);
        
    }

};

// On change of Filters Data should update in charts

var dataUpdateApi = function (reportName, fltr1Value, fltr2Value) {
    var data = _rspObject.statewiseJsonData;
    var dataScattered = _rspObject.statewiseDataCntSorted;
    var stateList = _rspObject.stateListSorted;
    var dateList = _rspObject.dateList;
    var addlnObjStore = _rspObject.addlnObj;
    var startIndex = -1;
    var endIndex = -1;
    if (reportName === "allStatesConfirmLineChart") {
        if (fltr1Value === "Top5") {
            startIndex = 0;
            endIndex = 5;
            //data slice not req, we can slice statelist
            stateList = stateList.slice(startIndex, endIndex);
        } else if (fltr1Value === "Top10") {
            startIndex = 0;
            endIndex = 10;
            //data slice not req, we can slice statelist
            stateList = stateList.slice(startIndex, endIndex);
        }
        addlnObjStore.xaxisScale = fltr2Value;
        addlnObjStore.yaxisScale = fltr2Value;
        var allFlag = false;
        var IndexObj = getArrayIndex(startIndex, endIndex, stateList.length);
        startIndex = IndexObj[0];
        endIndex = IndexObj[1];
        allFlag = IndexObj[2];
        $("#" + _rspObject.lineChart1Id).replaceWith('<canvas id=' + _rspObject.lineChart1Id + '></canvas>');
        callModuleFunc(data, stateList, dateList, addlnObjStore, allFlag, "update", reportName);

    } else if (reportName === "stateWiseAllCatgLineChart") {
        addlnObjStore.xaxisScale = fltr2Value;
        addlnObjStore.yaxisScale = fltr2Value;
        addlnObjStore.allConfirmSortedStateFltrVal = document.getElementById(_rspObject.allConfirmSortedStateFltrId).value;
        $("#" + _rspObject.lineChart2Id).replaceWith('<canvas id=' + _rspObject.lineChart2Id + '></canvas>');
        callModuleFunc(data, stateList, dateList, addlnObjStore, allFlag, "update", reportName);
        
    } else if (reportName === "allStatesConfirmScatteredChart") {
        if (fltr1Value === "Top5") {
            startIndex = 0;
            endIndex = 5;
            //data slice not req, we can slice statelist
            stateList = stateList.slice(startIndex, endIndex);
        } else if (fltr1Value === "Top10") {
            startIndex = 0;
            endIndex = 10;
            //data slice not req, we can slice statelist
            stateList = stateList.slice(startIndex, endIndex);
        }
        addlnObjStore.xaxisScale = fltr2Value;
        addlnObjStore.yaxisScale = fltr2Value;
        var allFlag = false;
        var IndexObj = getArrayIndex(startIndex, endIndex, stateList.length);
        startIndex = IndexObj[0];
        endIndex = IndexObj[1];
        allFlag = IndexObj[2];
        $("#" + _rspObject.scatteredChart1Id).replaceWith('<canvas id=' + _rspObject.scatteredChart1Id + '></canvas>');
        callModuleFunc(dataScattered, stateList, dateList, addlnObjStore, allFlag, "update", reportName);
    }
};


// !! Main Data Processing module , execute only once on load and store required data in global object "_rspObject"

var dataProcessingApi = function () {

    d3.csv("./datafiles/covid_19_india.csv", function (data) {
        var storeData = data;
        var stateList = _.keys(_.countBy(storeData, function (d) {
            return d['State/UnionTerritory'];
        }));
        var dateList = _.keys(_.countBy(storeData, function (d) {
            return d.Date;
        }));
        var hourList = _.keys(_.countBy(storeData, function (d) {
            return d.Time;
        }));
        var statewiseJsonData = _.groupBy(storeData, 'State/UnionTerritory');
        var stateWiseDataCnt = [];
        var stateWiseTabularDataCnt = [];
        _.each(stateList, function (statename) {
            var filteredData = statewiseJsonData[statename];
            var confirmedArray = filteredData.map(obj => getConfirmedCases(obj));
            var deathArray = filteredData.map(obj => getDeathCases(obj));
            var curedArray = filteredData.map(obj => getCuredCases(obj));
            var currConfirmedCnt = (confirmedArray.length === 0) ? 0 : confirmedArray[confirmedArray.length - 1];
            var currDeathCnt = (deathArray.length === 0) ? 0 : deathArray[deathArray.length - 1];
            var currCuredCnt = (curedArray.length === 0) ? 0 : curedArray[curedArray.length - 1];
            var totalConfirmDeathCnt = parseInt(currConfirmedCnt) + parseInt(currDeathCnt);
            var totalCnt = parseInt(currConfirmedCnt) + parseInt(currCuredCnt) + parseInt(currDeathCnt);
            var lastArrVal = confirmedArray[confirmedArray.length - 1];
            var prevLastArrVal = confirmedArray[confirmedArray.length - 2];
            var lastConfirmedValue = confirmedArray[confirmedArray.length - 1];
            var lastIncreasedValue = (prevLastArrVal===null||prevLastArrVal===undefined)?0:(lastArrVal - prevLastArrVal);
            // Last 7 days data
            confirmedArray = confirmedArray.slice(confirmedArray.length - 1 - 6, confirmedArray.length);
            stateWiseTabularDataCnt.push({"state": statename,
                "confirmedArray": confirmedArray, "maxConfirmed": lastConfirmedValue, "lastIncreasedValue": lastIncreasedValue});

            stateWiseDataCnt.push(
                    {"state": statename, "confirmed": currConfirmedCnt, "recovered": currCuredCnt, "death": currDeathCnt,
                        "totalConfirmDeath": totalConfirmDeathCnt, "total": totalCnt});
        });
        var statewiseDataCntSorted = _.sortBy(stateWiseDataCnt, 'confirmed').reverse();
        var stateListSorted = getSortedStateList(statewiseDataCntSorted);

        //Tabular data
        var stateListSortedTabular = _.sortBy(stateWiseTabularDataCnt, 'maxConfirmed').reverse();
        var tabledata = [];
        var serialNo = 0;
        _.each(stateListSortedTabular, function (myData) {
            // Fill array elemts with columns order
            var n = new Array(++serialNo, myData.state, myData.lastIncreasedValue, myData.confirmedArray);
            tabledata.push(n);
        });
        
        var maxDeathValue =  parseInt(getMaxValue(stateWiseDataCnt, 'death'));
        var maxCuredValue =  parseInt(getMaxValue(stateWiseDataCnt, 'recovered'));
        var maxConfirmedValue = parseInt(getMaxValue(stateWiseDataCnt, 'confirmed'));
        var maxTotalValue = parseInt(maxDeathValue) + parseInt(maxCuredValue) + parseInt(maxConfirmedValue) ;
        var maxConfirmDeathValue = parseInt(maxDeathValue) + parseInt(maxConfirmedValue) ;

        console.log(stateListSorted);
        console.log(stateWiseDataCnt);
        console.log(tabledata);
        console.log(statewiseJsonData);

        populateAllStateSelectList(stateListSorted);
        var spanIdList = document.getElementsByClassName('updateDateTime');
        var spanArrFromList = Array.prototype.slice.call(spanIdList);
        $('.updateDateTime').each(function() {
            $(this).text( "Updated on "+ parseDateFmt(dateList[dateList.length - 1]) 
                    +" "+ hourList[hourList.length -1] );
        });

        var addlnObj = {};
        addlnObj.maxConfirmedValue = maxConfirmedValue;
        addlnObj.maxDeathValue = maxDeathValue;
        addlnObj.maxCuredValue = maxCuredValue;
        addlnObj.maxTotalValue = maxTotalValue;
        addlnObj.maxConfirmDeathValue = maxConfirmDeathValue;
        addlnObj.xaxisScale = 'linear';
        addlnObj.yaxisScale = 'linear';
        addlnObj.allConfirmSortedStateFltrVal = document.getElementById(_rspObject.allConfirmSortedStateFltrId).value;

        _rspObject.stateListSorted = stateListSorted;
        _rspObject.tabledata = tabledata;
        _rspObject.dateList = dateList;
        _rspObject.addlnObj = addlnObj;
        _rspObject.statewiseJsonData = statewiseJsonData;/*used for all charts*/
        _rspObject.statewiseDataCntSorted = statewiseDataCntSorted;/*scattered plot*/


        callModuleFunc(statewiseJsonData, stateListSorted, dateList, addlnObj, true, "init", "allStatesConfirmLineChart");
        callModuleFunc(statewiseDataCntSorted, stateListSorted, dateList, addlnObj, true, "init", "allStatesConfirmScatteredChart");
        callModuleFunc(statewiseJsonData, stateListSorted, dateList, addlnObj, true, "init", "stateWiseAllCatgLineChart");
        callModuleFunc(tabledata, stateListSorted, dateList, addlnObj, true, "init", "allStatesConfirmTabular");


    });
};
