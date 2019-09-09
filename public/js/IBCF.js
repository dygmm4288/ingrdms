var ibCf = ( function () {
    function ibCf() {};
    ibCf.prototype.excute = function (target_recipe) {
        target_recipe = toString(target_recipe);
        var recipe_arr = jsonParse(readFile('item_based_CF.json')),
            result = sameKeyObjectInArray(recipe_arr, object => {
                if(object.recipe_id === target_recipe) {
                    return object.arc;
                }
                else {
                    return null;
                }
            });
            return result;
    };
    return ibCf;
})(),toString = function(value) {
    var result = null;
    if(typeof value === 'number') {
        result = value.toString();
    } else if(typeof value === 'string') {
        result = value;
    }
    return result;
},jsonParse = function(data) {
    var result = null;
    result = JSON.parse(data);
    return result;
},readFile = function(data) {
    var result = null,
        fs = require('fs');
    result = fs.readFileSync(__dirname + '/public/' + data, 'utf-8',(err,data) => {
        if(err) {
            throw err;
        }
    });
    return result;
},sameKeyObjectInArray = function(arr,predi) {
    var result = null;
    for( var i = 0,len = arr.length;i<len;i++)
    {
        result = predi(arr[i]);
        if(result) {
            break;
        }
    }
    return result;
};

module.exports = ibCf;