
/* global d3, _ */

var tabularPlot2 = function (chartId1) {

    var columns = ['state', 'confirmedArray'];

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
            // Last 7 days data
            confirmedArray = confirmedArray.slice(confirmedArray.length - 1 - 7, confirmedArray.length - 1);
            tabularDataSet.push({"state": statename, "confirmedArray": confirmedArray, "maxConfirmed": lastConfirmedValue});
        });
        var maxConfirmedValue = getMaxValue(tabularDataSet,'maxConfirmed');
        var sortedDescTopNStates = _.sortBy(tabularDataSet, 'maxConfirmed').reverse();// .slice(startIndex, endIndex);
        var data = [];
        _.each(sortedDescTopNStates, function (myData) {
            var n = new Array(myData.state, myData.confirmedArray);
            data.push(n);
        });

        // create table
        var table = d3.select("#table").append("table");

        var thead = table.append("thead").append("tr");

        thead.selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function (d) {
                    if(d === "confirmedArray"){
                        d = "Last 7 Days";
                    }
                    return d.toUpperCase();
                });

        var tbody = table.append("tbody");

        var trows = tbody
                .selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

        var tcells = trows
                .selectAll("td")
                .data(function (d, i) {
                    return d;
                })
                .enter()
                .append("td")
                .text(function (d, i) {
                    return d;
                });

        // update (add a column with graphs)
        thead.append("th").text(' Graphs');

        trows.selectAll("td.graph")
                //use a class so you don't re-select the existing <td> elements
                .data(function (d) {
                    return [d[1]];
                })
                .enter()
                .append("td")
                .attr("class", "graph")
                .each(lines);


        // a sparklines plot
        function lines(test) {
           // var width = 100, height = 20;
            var width = 100, height = 40;
            // alert("test" + maxConfirmedValue);
            var data = [];
            for (var i = 0; i < test.length; i++) {
                data[i] = {
                    'x': i,
                    'y': +getNormalizedValue(0,maxConfirmedValue,0,50 ,test[i])
                };
            }
            //alert("test2" + JSON.stringify(data));

            var x = d3.scaleLinear()
                    .range([0, width - 10])
                    .domain([0, 5]);

            var y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, 50]);

            var line = d3.line()
                    .x(function (d) {
                        return x(d.x);
                    })
                    .y(function (d) {
                        return y(d.y);
                    });

            d3.select(this).append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('path')
                    .attr('class', 'line')
                    .datum(data)
                    .attr('d', line);

        }
        var button = $("<button>Button</button>");
        button.click(function () {
            alert("here i have used data in json format : " + JSON.stringify(data));
        });
        //button.appendTo(".graph");

    });






};


