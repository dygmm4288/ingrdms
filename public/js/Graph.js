var Queue = (function() {
    function Queue() {
      this.count = 0;
      this.head = null;
      this.rear = null;
    }
    function Node(data) {
      this.data = data;
      this.next = null;
    }
    Queue.prototype.enqueue = function(data) {
      var node = new Node(data);
      if (!this.head) {
        this.head = node;
      } else {
        this.rear.next = node;
      }
      this.rear = node;
      return ++this.count;
    };
    Queue.prototype.dequeue = function() {
      if (!this.head) { // stack underflow 방지
        return false;
      }
      var data = this.head.data;
      this.head = this.head.next;
      // this.head 메모리 클린
      --this.count;
      return data;
    };
    Queue.prototype.front = function() {
      return this.head && this.head.data;
    };
    return Queue;
  })();
    Graph = (function(){
    function Vertex(key,data){
        this.next = null;
        this.arc = null;
        this.key = key;
        this.Vdata = data;
        this.inTree = null;
    }
    function Arc(data, dest, capacity){
        this.nextArc = null;
        this.destination = dest;
        this.data = data;
        this.capacity = capacity;
        this.inTree = null;
    }
    function Graph(){
        this.count = 0;
        this.first = null;
    }
    Graph.prototype.insertVertex = function(key,data){
        let vertex = new Vertex(key,data),
            last = this.first;
        if(last){
            while(last.next !== null){
                last = last.next;
            }
            last.next = vertex;
        } else {
            this.first = vertex;
        }
        this.count += 1;
    };
    Graph.prototype.deleteVertex = function(key){
        var vertex = this.first,
            prev = null;

            while(vertex.key !== key){
                prev = vertex;
                vertex = vertex.next;
            }
            if(!vertex) return false;
            if(!vertex.arc) return false;
            if(prev)
            {
                prev.next = vertex.next;
            } else {
                this.first = vertex.next;
            }
            this.count -= 1;
    };
    Graph.prototype.insertArc = function(data,fromKey, toKey, capacity){
        /*
    Vertex(key){
        this.next = null;
        this.arc = null; 
        this.key = key;
        this.inTree = null;
    }
    Arc(data, dest, capacity){
        this.nextArc = null;
        this.destination = dest;
        this.data = data;
        this.capacity = capacity;
        this.inTree = null;
    }
         */
        var from = this.first,
            to = this.first;
        while(from && from.key !== fromKey){
            from = from.next;
        }
        while(to && to.key !== toKey){
            to = to.next;
        }
        if(!from || !to) return false;
        var arc = new Arc(data,to,capacity),
            fromLast = from.arc;
        if(fromLast){
            while (fromLast.nextArc !== null){
                fromLast = fromLast.nextArc;
            }
            fromLast.nextArc = arc;
        } else {
            from.arc = arc;
        }
    };
    Graph.prototype.insertTwoWayArc = function(graph,data,from,to) {
        graph.insertArc(data,from,to);
        graph.insertArc(data,to,from);
    };
    Graph.prototype.deleteArc = function(fromKey, toKey) {
        var from = this.first;
        while (from !== null) {
          if (from.key === fromKey) break;
          from = from.next;
        }
        if (!from) return false;
        var fromArc = from.arc;
        var preArc;
        while (fromArc !== null) {
          if (toKey === fromArc.destination.key) break;
          preArc = fromArc;
          fromArc = fromArc.next;
        }
        if (!fromArc) return false;
        if (preArc) {
          preArc.nextArc = fromArc.nextArc;
        } else {
          from.arc = fromArc.nextArc;
        }
    };
    Graph.prototype.findSimilar = function(user) {
        /*
        @params {(String)}
        @return {(String)}
        Vertex(key){
        this.next = null;
        this.arc = null; 
        this.key = key;
        this.inTree = null;
    }
    Arc(data, dest, capacity){
        this.nextArc = null;
        this.destination = dest; vertext
        this.data = data;
        this.capacity = capacity;
        this.inTree = null;
    }
        */
    var temp = this.first,
        queue = new Queue(),
        arc = null;

    temp = this.first;
    queue.enqueue(temp);

    while(queue.count) {
        temp = queue.dequeue();
        arc = temp.arc;
        if(temp.key === user) {
            break;
        }
        queue.enqueue(temp.next);
    }
    temp = arc;
    while(arc) {
        if(arc.nextArc) {
            console.log("arc is ",arc);
            console.log("nextArc is ",arc.nextArc);
            if(arc.nextArc.data > temp.data) {
                temp = arc.nextArc;
            }
        }
        arc = arc.nextArc;
    }
    return temp.destination.Vdata;
    };
    Graph.prototype.show = function(want) {
        var last = this.first;
        if(last) {
            while(last) {
                want(last);
                last = last.next;
            }
        } else {
            // console.log(last.key,last.Vdata);
            want(last);
        }
    };
    Graph.prototype.getArcObject = function(predicate) {
        var last = this.first,
            result_array = [];

        while(last.next){
            var arc = last.arc,
                temp_obj = {
                    recipe_id: null,
                    arc: []
                },
                max = 0;

            temp_obj['recipe_id'] = last.key;
            
            while(arc.nextArc) {
                max = predicate(arc,temp_obj,max);
                arc = arc.nextArc;
            }
            result_array.push(temp_obj);
            last = last.next;
        }

        return result_array;
    }
    Graph.prototype.find = function(fromKey,predicate) {
        var last = this.first;
        if(last) {
            while(last.next !== null) {
                if(fromKey === last.key) {
                    predicate(last);
                }
                last = last.next;
            }
        } else {
            if(fromKey === last.key) {
                predicate(last);
            }
        }
    };
      return Graph;
})();
module.exports = Graph;