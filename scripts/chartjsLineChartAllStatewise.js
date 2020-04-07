
/* global d3, _ */

// Tab3
var chartJsPlotStatewiseAll = function (dropdownId, chartId, graphType) {


    d3.csv("./datafiles/covid_19_india.csv", function (data) {
        var storeData = data;
        var stateList = _.keys(_.countBy(storeData, function (d) {
            return d['State/UnionTerritory'];
        }));
        var dateList = _.keys(_.countBy(storeData, function (d) {
            return d.Date;
        }));
        if (graphType === "init") {
            var $dropdown = $("#" + dropdownId);
            $.each(stateList, function () {
                var m =this;
               // if (m === "Maharashtra")
               //     $dropdown.append($("<option selected />").val(this).text(this));
                //else    
                    $dropdown.append($("<option />").val(this).text(this));
            });
            $('#tab3SpanId1').text("Updated on " + parseDateFmt(dateList[dateList.length - 1]));
        }
        
        var firstSelState = $("#"+dropdownId).val();
        

        
        var statewiseJsonData1 = storeData.filter(obj => obj['State/UnionTerritory'] === firstSelState);
        var statewiseJsonData2 = _.groupBy(statewiseJsonData1, 'State/UnionTerritory');
        //alert(JSON.stringify(statewiseJsonData2));

        var tempDataSet = [];
        //_.each(stateList, function (statename) {
        var filteredData = statewiseJsonData2[firstSelState];
        console.log(JSON.stringify(filteredData));
        var correctedData = fillMissingData(dateList, filteredData);
        var confirmedArray = correctedData.map(obj => getConfirmedCases(obj));
        var deathArray = correctedData.map(obj => getDeathCases(obj));
        var curedArray = correctedData.map(obj => getCuredCases(obj));
        console.log(confirmedArray);
        console.log(deathArray);
        console.log(curedArray);

        var currConfirmedCnt = (confirmedArray.length === 0) ? 0 : confirmedArray[confirmedArray.length - 1];
        var currDeathCnt = (deathArray.length === 0) ? 0 : deathArray[deathArray.length - 1];
        var currCuredCnt = (curedArray.length === 0) ? 0 : curedArray[curedArray.length - 1];
        var totalConfirmDeathCnt = parseInt(currConfirmedCnt) + parseInt(currDeathCnt);
        var totalCnt = parseInt(currConfirmedCnt) + parseInt(currCuredCnt) + parseInt(currDeathCnt);
        tempDataSet.push(
                {"state": firstSelState, "confirmed": currConfirmedCnt, "recovered": currCuredCnt, "death": currDeathCnt,
                    "totalConfirmDeath": totalConfirmDeathCnt, "total": totalCnt});

        var sortedDescTopNStates2 = _.sortBy(tempDataSet, 'confirmed').reverse();//.slice(startIndex, endIndex);
        var sortedStateList2 = getSortedStateList(sortedDescTopNStates2);


        var finalDataSet2 = [];
        finalDataSet2.push({
            label: "Confirmed",
            lineTension: 0,
            fill: false,
            pointRadius: 3,
            borderColor: "orange",
            data: confirmedArray
        }, {
            label: "Death",
            lineTension: 0,
            fill: false,
            pointRadius: 3,
            borderColor: "red",
            data: deathArray
        }, {
            label: "Recovered",
            lineTension: 0,
            fill: false,
            pointRadius: 3,
            borderColor: "blue",
            data: curedArray
        });
        //var obj1 = statewiseJsonData2[finalDataSet3[0].label];
        //var maxValInDsLen = obj1.length;
        //var maxValInDs = obj1[maxValInDsLen - 1].Confirmed;
        var maxValInDs = 500;

        //alert(JSON.stringify(finalDataSet3));
        chartJsLineChartPlotStateWise(finalDataSet2, dateList, chartId, maxValInDs, true ,window.lineChartState2);

    });
};