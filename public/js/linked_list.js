
function Node(recipe){
    this.data = recipe;
    this.next = null;
}
function LinkedList(){
    this._length = 0;
    this._head = new Node("head");
}
LinkedList.prototype.get = function()
{
    return this.data;
}
LinkedList.prototype.append = function(data){
    var node = new Node(data);
    var cur;
    if(this._head === null)
    {
        this._head = node;
    }
    else{
        cur = this._head;
        while(cur.next){
            cur = cur.next;
        }
        cur.next = node;
    }
    this._length++;
}
LinkedList.prototype.appendData = function(data,predicate) {
    /* @param data 연결리스트에 추가할 데이타 {recipe_id ingrd_name ty_code}
            predicate 연결리스트에서 레시피 번호와 같은지 안같은지를 검사한다.
     */
    var cur = this._head;
    cur = cur.next;
    if(predicate(cur,data)) {
        
    }
    
}
LinkedList.prototype.removeAt = function (pos)
{
    if(pos > -1 && post < this._length)
    {
        var cur = this._head;
        var prev, index = 0;

        if( pos === 0)
        {
            this._head = cur.next;
        }else{
            while(index++<pos)
            {
                prev = cur;
                cur = prev.next;
            }
            prev.next = cur.next;

        }
        this._length--;
        cur.next = null;
        return cur.data;
    }
    return null;
}
LinkedList.prototype.display = function(){
    let cur = this._head;
    while(cur.next)
    {
        cur = cur.next;
        console.log(cur.data);
        
    }
}
LinkedList.prototype.find = function(data,predicate) {
    var cur = this._head;
    while(cur.next) {
        cur = cur.next;
        if(predicate(cur)) return cur; 
    }
    return -1;
}
module.exports = LinkedList;