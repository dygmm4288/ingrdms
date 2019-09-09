var ubcf = (function() {
    function ubcf() {};
    ubcf.prototype.execute = function(objArr,target_user) {
        var Graph = require('./Graph.js'),
            graph = new Graph(),
            user = null;
        /* Testing */
        
        var calcCosine = function(user_name,graph) {
            var last = graph.first;
            console.log(last);
        }
        
    /* start ubcf */
    if(typeof target_user !== 'string') {
        console.log('error target_user only string');
        throw err;
    }
        /* Insert Vertex */
        for(x in objArr) {
            graph.insertVertex(objArr[x].name,objArr[x]);
            if(objArr[x].name === target_user) {
                user = objArr[x];
            }
        }
        calcCosine('이',graph);
    }
    return ubcf;
})();
var arr_user = [],
    Data = require('./ubcf_data.js');
let data = new Data().setData([1,3,5,6],[3,1]);
    arr_user.push({name: '이진호',data:data});
    data = new Data().setData([1,2,3],[2,4,1]);
    arr_user.push({name: '이가온',data:data});
    data = new Data().setData([1,2,4,5],[2,1,2,1]);
    arr_user.push({name: '송훈섭',data:data});
new ubcf().execute(arr_user,'이진호');