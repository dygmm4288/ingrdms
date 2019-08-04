module.exports = function() {

    return{
        Recipe: function(r_id,r_name,t_code,type,clas_code,clas,time,amount,level,img_url){
            this.recipe_id = r_id;
            this.recipe_name = r_name;
            this.type_code = t_code;
            this.type = type;
            this.classi_code = clas_code;
            this.classi = clas;
            this.time = time;
            this.amount = amount;
            this.level = level;
            this.count_ingrd=0;
            this.prime_ingrd = 0;
            this.sub_ingrd = 0;
            this.count = 0;
            this.img_url = img_url;
            this.weight = 0;
        },
       
        Ingredient: function (r_id,ing_name,ing_amount,ing_type_code,ing_type){
            this.ingRecipe_id = r_id;
          
            this.ingredient_name = ing_name;
            this.ing_amount = ing_amount;
            this.ing_type = ing_type;
            this.ing_typeCode = ing_type_code;
        }

    };
}
