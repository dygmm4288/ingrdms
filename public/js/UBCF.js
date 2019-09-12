var ubcf = (function() {
    function ubcf() {};
    ubcf.prototype.execute = function(objArr,target_user) {
        var Graph = require('./Graph.js'),
            graph = new Graph(),
            user = null;
        /* Testing */
        
        var calcCosine = function(user_name,graph) {
            var last = graph.first,
                current_obj = null;
            while(last.next) {
                var cosine = 0;

                if(last.key === user_name) {
                    current = last.Vdata;
                    last = last.next;
                    continue;
                }
                if(current_obj) {
                    cosine = 
                    ((numerator(current_obj,last.Vdata,
                        (obj1,obj2) => obj1.recipe_id === obj2.recipe_id,
                        (obj1,obj2) => obj1.count * obj2.count)) / 
                    (denominator(current_obj,last.Vdata,
                        (obj1) => { pow(obj1.count,2)})
                    
                    )).toFixed(2);
                    graph.insertTwoWayArc(graph,cosine,current.key,last.key);
                }

                last = last.next;
            }
        },pow = function(value,squred) {
            return Math.pow(value,squred);
        },sqrt = function(value) {
            var result = null;
            result = Math.sqrt(value);
            return result;
        },numerator  = function(obj1,obj2,predi,calc) {
            var numerator = 0;

            for(var x in obj1) {
                for(var y in obj2) {
                    if(predi(obj1[x],obj2[y])) {
                        numerator +=  calc(obj1[x],obj2[y]);
                        break;
                    }
                }
            }
            console.log(numerator);
            return numerator;
        },denominator = function(obj1,obj2,predi) {
            var pow1 = 0,
                pow2 = 0,
                result = 0;
            for(x in obj1) {
                pow1 += predi(obj1);
            }
            for(x in obj2) {
                pow2 += predi(obj2);
            }
            result += sqrt(pow1) * sqrt(pow2);
            console.log(result);
            return result;
            
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
        /* Insert Cosine Data to Arc */
        calcCosine('이진호',graph);
        graph.show(function(last) {
            console.log(last.arc);
        })
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