var ubcf = (function() {
    function ubcf() {};
    ubcf.prototype.execute = function(objArr,target_user) {
        var Graph = require('./Graph.js'),
            graph = new Graph();
    
      var calcCosine = function(user_name,graph) {
            var last = graph.first,
                current_obj = findInGraph(user_name,graph);
            if(current_obj){
                while(last) {
                    var cosine = 0;
                    if(last.key !== current_obj.key) {
                        cosine = 
                        ((numerator(current_obj.Vdata.data,last.Vdata.data,
                            (obj1,obj2) => obj1.recipe_id === obj2.recipe_id,
                            (obj1,obj2) => obj1.count * obj2.count)) /
                        (denominator(current_obj.Vdata.data,last.Vdata.data,
                            (obj1) => pow(obj1.count,2) )
                        
                        )).toFixed(2);
                    
                        graph.insertTwoWayArc(graph,cosine,current_obj.key,last.key);
                    }
                    last = last.next;
                }
            }
            
        },findInGraph = function(user_name,graph) {
            var last = graph.first,
                current_obj = null;
            while(last) {
                if(last.key === user_name) {
                    current_obj = last;
                }
                last = last.next;
            }
            return current_obj;
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
            return numerator;
        },denominator = function(obj1,obj2,predi) {
            var pow1 = 0,
                pow2 = 0,
                result = 0;
            for(x in obj1) {
                pow1 += predi(obj1[x]);
            }
            for(x in obj2) {
                pow2 += predi(obj2[x]);
            }
            result += sqrt(pow1) * sqrt(pow2);
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
        }
        /* Insert Cosine Data to Arc */
        
        calcCosine(target_user,graph);
        /* Find Similar with target_user */
        var similar_user = graph.findSimilar(target_user),
            target_user_vertex_data = graph.find(target_user).Vdata,
            _ = require('lodash'),
            temp_result = _.differenceBy(target_user_vertex_data.data,similar_user.data,'recipe_id');
            temp_result.sort(o => o.count);
            temp_result.length < 5 ? null : temp_result.slice(0,5);
            return temp_result;
    }
    return ubcf;
})();

module.exports = ubcf;

