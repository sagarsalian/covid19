

var tabularPlot = function (chartId1) {
    var chart1 = document.getElementById(chartId1);
    var width = "500";
    var height = "500";
    var valueFunc = function (data) {
        return data.value;
    };
    var textFunc = function (data) {
        return data.fullname;
    };
    var columns = ["State", "Value"];
    var myData = [
	{
		"fullname" : "Oregon",
		"value" : 10
	},
	{
		"fullname" : "Washington",
		"value" : 12
	},
	{
		"fullname" : "Nevada",
		"value" : 2
	},
	{
		"fullname" : "Florida",
		"value" : 7
	},
	{
		"fullname" : "Texas",
		"value" : 7
	},
	{
		"fullname" : "Maine",
		"value" : 1
	},
	{
		"fullname" : "Idaho",
		"value" : 34
	},
	{
		"fullname" : "New Mexico",
		"value" : 3
	},
		{
		"fullname" : "Georgia",
		"value" : 3
	},
		{
		"fullname" : "Montana",
		"value" : 9
	},
	{
		"fullname" : "Ohio",
		"value" : 13
	},
	{
		"fullname" : "Alaska",
		"value" : 1000
	}
];

    
    
    drawTable(myData, "#"+chartId1, {width: width, height: height}, valueFunc, textFunc, columns);
};


