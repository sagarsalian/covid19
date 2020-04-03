
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



