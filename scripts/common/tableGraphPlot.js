
/* global d3 */
var getColorCodeConfirmThrsh = function (thrshval) {
    if (thrshval > 10 && thrshval <=50){
        return "#ff8c00";
    } else if (thrshval > 50) {
        return "red";   
    } else {
        return "black";
    }
};

var tabularAndLineGraphPrint = function (data ,columns ,chartId ,maxValue ,addlnObj ,colMapCallBack) {

    var linePos = columns.indexOf("confirmedArray");
    var incrCases = columns.indexOf("lastIncreasedValue");
    
    // create table
    var table = d3.select("#"+chartId).append("table");

    var thead = table.append("thead").append("tr");

    thead.selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function (d) {
                return colMapCallBack(d).toUpperCase();
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
            }).style('color', function(d ,i){
                if ( i === incrCases) {
                    return getColorCodeConfirmThrsh(d);
                }
                return "black";
            });

    // update (add a column with graphs)
    thead.append("th").text('Linear Graphs');

    trows.selectAll("td.graph")
            //use a class so you don't re-select the existing <td> elements
            .data(function (d) {
                return [d[linePos]];
            })
            .enter()
            .append("td")
            .attr("class", "graph")
            .each(lines);
    
    // update (add a column with graphs)
    /*thead.append("th").text('Log Graphs');
    trows.selectAll("td.graph2")
            //use a class so you don't re-select the existing <td> elements
            .data(function (d) {
                return [d[linePos]];
            })
            .enter()
            .append("td")
            .attr("class", "graph2")
            .each(lines2);
            */


    // a sparklines plot
    function lines(test) {
        // var width = 100, height = 20;
        var width = 280, height = 80;
        // alert("test" + maxConfirmedValue);
        var data = [];
        for (var i = 0; i < test.length; i++) {
            data[i] = {
                'x': i,
                'y': +getNormalizedValue(0, maxValue, 0, 250, test[i])
            };
        }
        //alert("test2" + JSON.stringify(data));

        var x = d3.scaleLinear()
                .range([0, width -20])
                .domain([0, 6]);

        var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, 250]);

        var line = d3.line()
                .x(function (d) {
                    return x(d.x);
                })
                .y(function (d) {
                    return y(d.y);
                });

        var svg = d3.select(this).append('svg');
                svg
                .attr('width', width)
                .attr('height', height)
                .append('path')
                .attr('class', 'line')
                .datum(data)
                .attr('d', line);
    
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
        svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y));

    }
    
    function lines2(test) {
        // var width = 100, height = 20;
        var width = 150, height = 50;
        // alert("test" + maxConfirmedValue);
        var data = [];
        for (var i = 0; i < test.length; i++) {
            data[i] = {
                'x': i+1,
                'y': +getNormalizedValue(0, maxValue, 0, 50, test[i])
            };
        }
        //alert("test2" + JSON.stringify(data));

        var x = d3.scaleLog()
                .range([0, width - 10])
                .domain([1, 10])
                .base(2);

        var y = d3.scaleLog()
                .range([height, 0])
                .domain([1, 50])
                .base(2);

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

};