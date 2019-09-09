let Data = (function () {
    function Data() {
        this.data = [];
    };
    Data.prototype.setData = function(recipe_id,count) {
        if(Array.isArray(recipe_id)){
            if(Array.isArray(count))
            {
             recipe_id.length === count.length ?
             recipe_id.forEach((value,index)=>{
                 this.data.push(this.info(value,count[index]));
             }) :
             recipe_id.forEach((value,index)=>{
                 index > count.length-1 ?
                 this.data.push(this.info(value,count[count.length-1])) :
                 this.data.push(this.info(value,count[index]));
             })
            }//선택횟수가 배열이 아니라면>
            else{
                recipe_id.forEach((value)=>{
                    this.data.push(this.info(value,count));
                })
            }
        }
        //레시피 번호가 배열이 아니라면?
        else{
            if(Array.isArray(count)){
                var e = new Error('Recipe_id is value and Count is array Error');
                e.name = 'NoMathingData';
                throw e;
            }
            else {
                this.data.push(this.info(recipe_id,count));
            }
        }
        return this.data;
    };
    Data.prototype.info = function(recipe_id,count) {
        const obj = {
            recipe_id: recipe_id,
            count: count
        };
        return obj;
    };
    return Data;
})();
module.exports = Data;