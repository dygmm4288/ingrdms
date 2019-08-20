module.exports = function() {
    return{
        User:function(){},
        UserIngrd: function(user_id,ingrd_name,state,weight){
            this.user_id = user_id;
            this.ingrd_name = ingrd_name;
            this.state = state;
            this.weight = weight;
        }
    }
}