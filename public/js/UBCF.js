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
                        console.log('현재 유저:',current_obj.key);
                        console.log('상대 유저: ',last.key);
                        console.log('코사인 값',cosine);
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
        console.log('타겟 유저:',target_user);
        calcCosine(target_user,graph);
        graph.show(function(last) {
           console.log('현재 유저 ', last.key);
           while(last.arc) {
            console.log('현재 유저의 아크', last.arc.destination.key);
            console.log('현재 유저의 아크의 값',last.arc.data);
            last.arc = last.arc.nextArc;
           }
           
        })
    }
    return ubcf;
})();

module.exports = ubcf;

