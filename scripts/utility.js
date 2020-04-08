
/* global _ */

// Get Normalized Value API
var getNormalizedValue = function (DataMin, DataMax, NormalizedMin, NormalizedMax, x) {
    var A = DataMin;
    var B = DataMax;
    var a = NormalizedMin;
    var b = NormalizedMax;
    var mapValue = 0;
    mapValue = a + ((x - A) * (b - a) / (B - A));
    return Math.round(mapValue);
};

// Max value in array
var getMaxValue = function (myarray, arrayPropCompare ,arrayPropReturn) {
    var retval = myarray.sort(function (a, b)
    {
        return parseInt(b[arrayPropCompare]) - parseInt(a[arrayPropCompare]);
    })[0][arrayPropReturn];
    return retval;
};

// Max value in array
var getMaxValue = function (myarray, arrayPropCompare ) {
    var retval = myarray.sort(function (a, b)
    {
        return parseInt(b[arrayPropCompare]) - parseInt(a[arrayPropCompare]);
    })[0][arrayPropCompare];
    return retval;
};

// for a String it consistently returns a 6-digit colour code
var stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
};


// parse date format dd/mm/yy
var parseDateFmt = function(dt) {
    var dtArr = dt.split("/");
    var fullyear = new Date().getFullYear();
    var fullyearCmp = parseInt(fullyear.toString().substr(2,2));
    var retDate = dtArr[0]+"/"+dtArr[1]+"/"+dtArr[2];
    if (fullyearCmp === parseInt(dtArr[2])) {
        retDate = dtArr[0]+"/"+dtArr[1]+"/"+fullyear;
    }
    return retDate;
};

//
var getSortedStateList = function (jsonarr) {
    var sortedStateList = [];
    _.each(jsonarr, function (r) {
        sortedStateList.push(r.state);
    });
    return sortedStateList;
};

// Array to be passed to get SUM of it
var sum = function (numbers) {
    return _.reduce(numbers, function (sum, n) {
        return sum + n;
    }, 0);
};


// line chart fill missing data
function fillMissingData(dateList, filteredData) {
    var newArray = [];
    // Fill all date's corresponding value points with zero
    _.each(dateList, function (s1) {
        var myobj = new Object();
        myobj.Confirmed = 0;
        myobj.Deaths = 0;
        myobj.Cured = 0;
        myobj.Date = s1;
        newArray.push(myobj);
    });
    // Fill valid point values
    var i = 0;
    _.each(filteredData, function (s2) {//O(n*2) operation            
        var myobj = new Object();
        myobj.Confirmed = s2.Confirmed;
        myobj.Deaths = s2.Deaths;
        myobj.Cured = s2.Cured;
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

function getConfirmedCases(item) {
    return parseInt(item.Confirmed);
}

function getDeathCases(item) {
    return parseInt(item.Deaths);
}

function getCuredCases(item) {
    return parseInt(item.Cured);
}

function getConfirmedAndDeathCases(item, maxValue) {
        var points = new Object();
        points.x = parseInt(item.confirmed); 
        points.y = parseInt(item.death); 
        var pointValue = (points.x + points.y);
        points.r = getNormalizedValue(0, maxValue, 5, 20, pointValue);
        // points.other = item.district;
        return points;
 }

function time_convert(num)
 { 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  return hours + ":" + minutes;         
}

var getLastUpdateMinsPassed = function (mydate ,mytime) {
    //alert (mydate + ", "+mytime);
    var dateArr = mydate.split("/");
    var dateStr = dateArr[2]+"/"+dateArr[1]+"/"+dateArr[0];
    var timeArr =  mytime.split(":");
    var year = parseInt(dateArr[2]);
    var month = parseInt(dateArr[1]);
    month = month -1;
    if (month < 0) month=0;
    var day = parseInt(dateArr[0]);
    var hr = 0;
    if(timeArr[1].includes("PM")){
        hr = parseInt(timeArr[0]) + 12;
    } else {
        hr = parseInt(timeArr[0]);
    }
    // alert(year + "," + month +" ,"+ day +" "+hr);
    var storeDate = new Date(year, month, day, hr ,0 ,0 ,0);
    var diff = Math.abs(new Date() - storeDate);
    var minutespassed = Math.floor((diff/1000)/60);
    return time_convert(minutespassed);
};


