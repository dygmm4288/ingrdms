const express = require('express'),
      app = express(),
      template = require('./lib/template'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      path =require('path');
//func
var func = (function Func() {
    if(!(this instanceof Func)) {
        return new Func();
    }
    Func.prototype.checkUser = function(sess) {
        var state = null,
                say_hello = null;
            if(sess.user_id === undefined) {
                state = '로그인';
                say_hello = '반갑습니다.';
            }
            else {
                state = '로그아웃';
                say_hello = sess.user_name + '님 안녕하세요!';
            }
        return {
            state: state,
            say: say_hello
        };
    };
    Func.prototype.content = function(title,name,style) {
            var str = '';
            if(!style) {
                style = null;
            }
            str = 
            `<div style = "${style}" id = "${name}">
                <p> ${title}
                <br> <input type = "text" id = "${name}"/></p>
            </div>`;
            return str;
    };
    Func.prototype.setSess = function(sess,user_id,user_name) {
        sess.user_id = user_id;
        sess.user_name = user_name;
    };
}());

//use,set,engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/node_modules',express.static(path.join(__dirname,'/node_modules')));
//session
app.use(session({
    secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
      }
}));
//get

app.get('/',(req,res)=>{
    var title = 'Welcome',
        html = template.HTML(title,
`<div class = "app">
    <div class ="content">
        <p style = "font-family:굴림;font-size:20;">이에이송의 <br>
        음식물쓰레기 줄이기 프로젝트</p>
        <p style = "font-size:30; margin:3 auto">지금 시작합니다!</p>
        <div class = "blink">
        <a href = "/login"><p class = "event listening">시작하기</p></a>
        </div>
        
    </div>
 </div>`)
res.send(html);
});
app.get('/login',(req,res)=>{   
    var title = 'Login Page';
    if(req.session.user_id) {
        res.redirect('/main');
    }
    else {
    var html = template.HTML(title,`
    <div class = "app">
    <div class = "loginForm">
        <form class = "loginForm" action = "/form_receiver" name = "loginForm" id = "loginForm" method = "POST">
            <input type = "text"  size = "25" name ="uid" placeholder = "Enter User ID" required autofocus ><br>
            <input type = "password" size = "25" name = "upwd" placeholder = "Enter User PassWord" required><br>
            <input type = "submit" value = "로그인">
            <a href = "/main"><input type = "button" class = "skipButton"  value = "건너뛰기">
         </form>
    <div class ="subLogin">
        <a href="/findUser">아이디 비밀번호 찾기</a>&nbsp&nbsp
        /&nbsp&nbsp <a href= "/signUp">회원가입</a>
    </div>
   </div>
</div>
`);
res.send(html);
}
})
app.get('/loginError/:level',(req,res)=>{
    var title = 'Login Page',
        append = '';
        console.log(req.params.level);
    if(req.params.level === '1')
    {
       append = `<div style = "text-align:center; color:red; font-weight:bold;"> 
       입력한 아이디가 존재하지 않습니다. <br>다시 입력해주시길 바랍니다. </div>`; 
    }
    else{
        append = `<div style = "text-align:center; color:red; font-weight:bold;"> 
        입력한 비밀번호가 옳지 않습니다.<br> 다시 입력해주시길 바랍니다.</div>`;
    }
    var html = template.HTML(title,`
    <div class = "app">
    <div class = "loginForm">
        <form class = "loginForm" action = "/form_receiver" name = "loginForm" id = "loginForm" method = "POST">
            <input type = "text"  size = "25" name ="uid" placeholder = "Enter User ID" required autofocus ><br>
            <input type = "password" size = "25" name = "upwd" placeholder = "Enter User PassWord" required><br>
            ${append}
            <input type = "submit" value = "로그인">
            <a href = "/main"><input type = "button" class = "skipButton"  value = "건너뛰기">
         </form>
    <div class ="subLogin">
        <a href="/findUser">아이디 비밀번호 찾기</a>&nbsp&nbsp
        /&nbsp&nbsp <a href= "/signUp">회원가입</a>
    </div>
   </div>
</div>
`);
res.send(html);
})
app.get('/findUser',(req,res)=>{
    var title = "Find User Page",
        html = template.HTML(title,`
    <div class = "app">
    <div class = "toplogin">
        <input type = "button"
            class = "stateButton"
            id = state 
            value = "로그인">
    </div>
    <div class = "content"
    style = "display:flex;flex-direction:column;justify-content:center">
        <div style = "display:flex;flex-direction:row;justify-content:stretch">
            <div id = 'id'style = "font-size: 20px;flex:1">아이디 찾기</div>
            <div id = 'pwd'style = "font-size: 20px;flex:1">비밀번호 찾기</div>
        </div>
        <div id = "form">
        <form>
            ${func.content('아이디','input_id','font-size:18px')}
            ${func.content('이름','name','font-size:18px')}
            ${func.content('가입시 등록한 이메일','e-mail','font-size:18px')}
            <p><input type='submit' value='찾기' /></p>
        </form>
        </div>
    </div>
    </div>
    `,`
    $(document).ready(function(){
        $('.app').css('background',"url('')");
        var flag = 1;
        $('#input_id').hide();
        $('#id, #form').css('background-color','darkgray');
        $('#id').click(()=>{
            flag = 1;
            $('#input_id').hide();
            $('#id, #form').css('background-color','darkgray');
            $('#pwd').css('background-color','');
        })
        $('#pwd').click(()=>{
            flag = -1;
            $('#pwd, #form').css('background-color','darkgray');
            $('#input_id').show();
            $('#id').css('background-color','');
        })
        $('.stateButton').click(()=> {
            location.href = '/login';
        })
    })
        `
    );
    res.send(html);
});

app.get('/signUp',(req,res)=>{
    var title = "signUp";
    var html = template.HTML(title,`
    <div class = "app">
        <div class = "toplogin">
            <input type = "button"
            class = "stateButton"
            id = state 
            value = "로그인">
        </div>
        <div class = "content"
        style = "display:flex;flex-direction:column;justify-content:center">
        <form style = "background-color:darkgray">
            ${func.content('아이디','input_id','font-size:18px')}
            ${func.content('이름','name','font-size:18px')}
            ${func.content('이메일','e-mail','font-size:18px')}
            ${func.content('비밀번호','password','font-size:18px')}
            ${func.content('비밀번호 확인','check_password','font-size:18px')}
            <p><input type='submit' value='회원가입'></p>
        </form>

        </div>
    </div>
    `,`
    $(document).ready(function(){
        //비밀번호하고 비밀번호 확인이 같은지 
        $('.app').css('background',"url('')");
        $('.stateButton').click(()=>{
            location.href='/login/';
        })
    })
    `);
    res.send(html);
});

app.get('/main',(req,res)=>{
    var title = 'Main Page',
        checkResult = func.checkUser(req.session),
        html = template.HTML(title,`
    <div class="app">
        <div class = "topLogin">
        ${checkResult.say}
        <input type = "button"
        class = "stateButton"
        onclick = "stateclick()" 
        id = state 
        value = "${checkResult.state}">
        </div>
        <div class = "content">
            <input type = "button" class = "fixed"
             value = "냉장고 관리" onclick = "goRefri()"/>
            <input type = "button" class = "fixed"
             value = "레시피 추천" onclick = "goRecipe()"/>     
        </div>
    </div>    
`,`function goRefri() {
    location.href ='./refrigerator';
    };
    function goRecipe(){
        location.href = './recipe';
    };
    function stateclick() {
        var state = document.getElementById('state');
        console.log(state);
        if(state.value === '로그인')
        {
            console.log('location to login');
            location.href = '/login/';
        }
        else if(state.value === '로그아웃')
        {
            console.log('location to logout');
            location.href = '/logout/';

        }
    }`   );

res.send(html);
})
app.get('/logout',(req,res)=>{
    
    req.session.destroy((err)=>{
    if(err) {
        throw err;
    }});
    backUrl = req.header('Referer') || '/';
    res.redirect(backUrl);
})
app.get('/refrigerator',(req,res)=>{
var title = "Refrigerator Page",
    checkResult = func.checkUser(req.session);

res.render('refrigerator',{
    title: title,
    say: checkResult.say,
    state: checkResult.state,
},(err,html)=>{
    if(err) {
        throw err;
     }
      res.end(html)
});
})
app.get('/classify',(req,res)=>{
    var title = 'Classify Page',
        html = template.HTML(title,
        `<div class="all">
           <div class = "header" id = "header"> 
            <font size="6px" color="#f8b600"><b>분류</b></font>
           </div>
            <div class = "content" id = "content">
                <input type="button" class="button" value = "육류">
                <input type="button" class="button" value = "채소">
                <input type="button" class="button" value = "과일">
                <input type="button" class="button" value = "수산물">
                <input type="button" class="button" value = "양념&소스">
                <input type="button" class="button" value = "가공&유제품">
                <input type="button" class="button" value = "기타">
            </div>
        </div>`,
        `
           $(':button').click((onClick)=>{
           var value = onClick.currentTarget.value;
           var adr = '/classify/'+value;
           location.href = adr;
        })`);
res.send(html);
});
app.get('/classify/:classifyId',(req,res)=>{
    const classify = require('./public/js/classify');
    var param = null,
    title = "Classify Page";
    switch(req.params.classifyId){
        case '육류':
            param = classify.Meat;
            break;
        case '채소':
            param = classify.Vegetable;
            break;
        case '과일':
            param = classify.Fruit;
            break;
        case '수산물':
            param = classify.SeaFood;
            break;
        case '양념&소스':
            param = classify.Seasoning;
            break;
        case '가공&유제품':
            param = classify.Product;
            break;
        case '기타':
            param = classify.Etc;
            break;
            default:
                console.error('switch Error');
            break;
    }
    res.render('classify',{
        title: title,
        value: param,
        classifyId: req.params.classifyId,   
    },(err,html)=>{if(err)throw err; res.end(html)});
});
app.get('/inif/:classiId/:inifId',(req,res)=>{
    var title = 'In Information Page',
        html = template.HTML(title,
`
<div class="all">
        <form>
    <div class = "content">
        <div class = "column">
            <div class = "columnItem left">분 류</div>
            <div class = "columnItem right" id = "classify">${req.params.classiId}</div>
        </div>
        <div class = "column">
            <div class = "columnItem left">이 름</div>
            <div class = "columnItem right">
                <input type = "text" required value = "${req.params.inifId}" id = "name" name = "name">
            </div>
        </div>
        <div class = "column">
            <div class = "columnItem left">보관방법</div>
            <div class = "columnItem right_btn">
                <input type = "button" id = "frozen" class = "list" value = "냉동 보관" name = "frozen">
                <input type = "button" id = "fresh" class = "list" value = "냉장 보관">
            </div>
        </div>
        <div class = "column">
            <div class = "columnItem left">상태</div>
            <div class = "columnItem right">
                    <input type="text" id="state"  name="state" value = "좋음">
            </div>
        </div>
    </div>
        <input type = "submit"  value = "입력">
        <input type = "button" value = "취소" id = "cancle_btn">
    </form>
</div>
`,`
var frozen = $('#frozen'),
    fresh = $('#fresh');

$(document).ready(()=>{
    
    var flag = 1,
        data = null,
        inputData = function(data,name,value) {
            return data.concat([{name: name, value: value}]);
        };

    $("#cancle_btn").click(()=>{
        window.history.back();
    })
    frozen.click(()=>{
        flag = 1;
        frozen.css('background-color',"lightblue");
        fresh.css('background-color','');
    })
    fresh.click(()=>{
        flag = -1;
        frozen.css('background-color','');
        fresh.css('background-color','lightblue');
    });
   $("form").submit((e)=>{
       data = $("form").serializeArray();
       flag === 1 ? data = inputData(data,"keep",frozen.val()) : data = inputData(data,"keep",fresh.val());
       data = inputData(data,"classify",$("#classify").text());

       $.ajax({
        url: "/processing",
        data: data,
        type: "get"
    }).done((data)=>
    {
        if(data === "Success") {
            alert("등록이 완료되었습니다.");
            location.href = '/refrigerator/';
        }
        else if(data === "Fail") {
            alert("이미 등록된 재료입니다.");
            location.href = '/classify/';
        }
    })
    })
    
})
`);
      res.send(html);
})
app.get('/processing',async (req,res)=>{
    var ingrdName = req.query.name,
   //var userid = req.session.userid;
        userid = "dygmm4288";

    const DataBase = require('./public/js/DataBase'),
          database = new DataBase();

   //사용자 정보가 없는 경우
    if(userid === undefined) { 
       console.log("Not exsists Users");
    }
      //사용자 정보가 있는 경우
    else {
        var query = 'select ing_name from ingredient_u where ingUser_id = ? and ing_name = ?';
        await database.query(query,[userid,ingrdName]).then((row) =>{
            return new Promise(async (response,reject) => {
                if(row.length === 0) {
                    query = 'insert into ingredient_u values(?,?)';
                    await database.query(query,[userid,ingrdName]);
                    await res.send("Success");
                }
                else {
                   await res.send("Fail");
                }
            })
        })
   }
})
app.get('/recipe',(req,res)=>{
    res.render('recipe',{},(err,html)=>{if(err)throw err;res.end(html);});
});
app.get('/recommand',(req,res)=>{

const cheerio = require('cheerio'),
      fs = require('fs'),
      data = require('./public/js/recipe.js')(),
      list = require('./public/js/linked_list'),
      ingrd_list = [],
      loginModule = require('./public/js/login'),
      login = new loginModule(),
      userData = require('./public/js/userData')(),
      arr_userData = [],
      first_recommend = [],
      setTable = function(Table,count) {
          if(count > 0) {
              Table.push(new list());
              return setTable(Table,count-1);
          }
          else {
              return Table;
          }
      },
      Recommend = (function () {
        return {
            first: function (cur,iv,v,is_prime) {
                do{
                    cur = cur.next;
                if(cur.data.recipe_id === iv.ingRecipe_id)
                {
                    cur.data.count += 1;
                    //확인한 레시피인가 아닌가?
                    if(first_recommend.indexOf(cur.data) === -1) first_recommend.push(cur.data);
                    //상태에 따른 가중치 부여
                    var tmp_weight = 0;
                    if(v.state === '좋음'){
                        tmp_weight += 5;
                    }
                    else if(v.state === '보통'){   
                        tmp_weight += 8;
                    }
                    else {
                        tmp_weight += 10;
                    }
                    cur.data.weight += (tmp_weight/10)*0.1;
                    //재료의 수량 가중치 부여
                    if(is_prime){
                        tmp_weight = 0;
                        cur.data.prime_ingrd++;
                        if(v.amount >= '500g'){
                            tmp_weight += 10;
                        }
                        else if(v.amount >= '250g'){
                            tmp_weight += 8;
                        }
                        else {tmp_weight += 5;}
                    cur.data.weight += (tmp_weight/10)*0.1;
                    }
                    else if(!is_prime)
                    {
                        cur.data.sub_ingrd += 1;
                        tmp_weight = 0;
                        if(v.amount >= '250g') tmp_weight = 10;
                        else if(v.amount >= '100g') tmp_weight = 8;
                        else tmp_weight = 5;
                    cur.data.weight += (tmp_weight/10)*0.1;
                    }
                    //주재료로 구성된 메뉴로 레시피를 만들수 있는지에 따른 가중치 부여
                    
            
                }
            }
            while(cur.next);
            },
            second: function(){

            }
        };
    }());
let recipeTable = new Array(),
    $ = null;

    recipeTable = setTable(recipeTable,10);


    $ = cheerio.load(fs.readFileSync(__dirname+'/public/recipe_data.xml','utf-8'),{xmlMode: true});

$('row').each(function(){
    let r_id = $(this).find('RECIPE_ID').text();
    let r_name = $(this).find('RECIPE_NM_KO').text();
    let t_code = $(this).find('NATION_CODE').text();
    let tp=$(this).find('NATION_CODE').text();
    let class_code=$(this).find('TY_CODE').text();
    let clas=$(this).find('TY_NM').text();
    let time=$(this).find('COOKING_TIME').text();
    let amount=$(this).find('QNT').text();
    let level=$(this).find('LEVEL_NM').text();
    let img = $(this).find('IMG_URL').text();
    let tmp_recipe = new data.Recipe(r_id,r_name,t_code,tp,class_code,clas,time,amount,level,img);
    recipeTable[r_id%10].append(tmp_recipe);
})

$ = cheerio.load(fs.readFileSync(__dirname+'/public/ingrd_data.xml','utf-8'),{xmlMode: true});
$('row').each(function(){
    let r_id = $(this).find('RECIPE_ID').text();
    let ing_name = $(this).find('IRDNT_NM').text();
    let ing_amount = $(this).find('IRDNT_CPCTY').text();
    let ing_ty_code = $(this).find('IRDNT_TY_CODE').text();
    let ing_ty = $(this).find('IRDNT_TY_NM').text();
    ingrd_list.push(new data.Ingredient(r_id,ing_name,ing_amount,ing_ty_code,ing_ty));
    var cur = recipeTable[r_id%10]._head;
    while(cur.next)
    {
        cur = cur.next;
        if(cur.data.recipe_id === r_id)
        {
            cur.data.count_ingrd++;
        }
        
    }
});
   //function Recommand()

function SecondRecommend(user_id){
    const User = (function() {
        function User(name,data) {
            this.name = name;
            this.data = data;
        };
        return User;
    })(),
          Data = (function() {
        function Data(){
            this.data = new Array();
        };
        //Error 있음
        Data.prototype.setData = function(recipe_id,count){
            //레시피 번호가 배열이라면?
            if(Array.isArray(recipe_id)){
                if(Array.isArray(count))
                {
                 recipe_id.length == count.length ?
                 recipe_id.forEach((value,index)=>{
                     this.data.push(this.info(value,count[index]));
                 }):
                 recipe_id.forEach((value,index)=>{
                     index  > count.length-1 ?
                     this.data.push(this.info(value,count[count.length-1])):
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
        Data.prototype.info = function(recipe_id,count)
        {
            const obj = {
               recipe_id: recipe_id,
               count: count
            };
            return obj;
        };
        return Data;
    })(),
         ubCF = (function(){
        function ubCF() {}
        /*
            @{param} {Array Object}
            @Array object {name, data(object)}
            @data(object){recipe_id, count} 
            @{return} {Number} recipe_id
         */
        ubCF.prototype.excute = function(arrObj,User){
            /* 
            @params {Array Obj, User {String}}
            @return {recipe_id Integer}
             */
            var i = 0,
                Graph = require('./public/js/Graph.js'),
                graph = new Graph(),
                arr_length = arrObj.length,
                selected_user = null,
                user = null,
                tempResult = null;
            const _ = require('lodash');

           for(i in arrObj){
               graph.insertVertex(arrObj[i].name,arrObj[i]);
               if(arrObj[i].name === User) {
                    user = arrObj[i];
               }
           };
           //코사인 값 계산
           for(i in arrObj){
                for(var j = parseInt(i)+1;j<arr_length;j+=1){
                    /*
                    @param {object} 
                    @return {int} 코사인 분자의 값
                    */
                    var user1 = arrObj[i].data, 
                        user2 = arrObj[j].data,
                        user1Recipe = null,
                        user2Recipe = null,
                        numerator = 0,//분자값
                        denominator = 0,//분모값
                        user1_pow_total = 0,
                        user2_pow_total = 0;
            
                    for(var x in user1){
                        user1Recipe = user1[x].recipe_id;
                        user1_pow_total += Math.pow(user1[x].count,2);
                        for(var y in user2){
                        user2_pow_total += Math.pow(user2[y].count,2);
                            user2Recipe = user2[y].recipe_id;
                            if(user1Recipe === user2Recipe){
                                numerator += (user1[x].count) * (user2[y].count);
                                break;
                            }
                        }
                    }
                    
                    denominator = Math.sqrt(user1_pow_total) * Math.sqrt(user2_pow_total);
                    result = numerator / denominator;
                    //무방향 그래프 값 삽입
                    graph.insertTwoWayArc(graph,result,arrObj[i].name,arrObj[j].name);
                }
           };
           selected_user = graph.findSimilar(User);
           tempResult = _.differenceBy(selected_user.data,user.data,'recipe_id');
           tempResult.sort(function(o) {return o.count;});
           tempResult.length < 5 ? null : _.slice(tempResult,0,5);
           return tempResult;
        };
        
        return ubCF;
    })(),
    /*Testing */
        arr_user = [];
    arr_user.push(new User('이진호',new Data().setData([1,3,5,6],[3,1])));
    arr_user.push(new User('이가온',new Data().setData([1,2,3],[2,4,1])));
    arr_user.push(new User('송훈섭',new Data().setData([1,2,4,5],[2,1,2,1])));
    //데이터 접근 arr_user[0].data[0].recipe_id// arr_user[0].data[0].count;
var result = null;
    result = (new ubCF().excute(arr_user,'이진호'));
    console.log(result);

    

    
}

//User Data
var userid = 'dygmm4288';

login.getIngrd(userid).then((rows)=>{
    rows.forEach((v)=>{
        arr_userData.push(new userData.UserIngrd(userid,v.ingrd_name,'좋음','500g'));
    });
    return new Promise((res,rej)=>{ 
        res(arr_userData);
})}).then((userData)=>{
    userData.forEach((v)=>{
        ingrd_list.forEach((iv)=>{ 
             //주재료 3060001
            if(iv.ingredient_name === v.ingrd_name && iv.ing_typeCode === '3060001')
            {
                var cur = recipeTable[iv.ingRecipe_id % 10]._head;
                Recommend.first(cur,iv,v,true);
                
            }
            else if (iv.ingrdient_name === v.ingrd_name){
                var cur = recipeTable[iv.ingRecipe_id % 10]._head;
                Recommend.first(cur,iv,v,false);
            }
        })
    });
    for(i in first_recommend) {
        var tmp = 0,
            prime = 0,
            sub = 0,
            that = first_recommend[i];
        prime = 14*(that.prime_ingrd/that.count_ingrd);
        sub = 6*(that.sub_ingrd/that.count_ingrd);
        tmp = prime + sub;
        that.weight += (tmp/20)*0.2;
    }
    return new Promise((res,rej)=>{
        res(first_recommend);
    })
}).then((arr_recipe)=>{res.send(arr_recipe);})
.catch((err)=>{console.log(err)});

});
app.get('/setRecipe',(req,res)=>{
    //const user_id = req.user_id;
    const DataBase = require('./public/js/DataBase'),
          database = new DataBase();

    let user_id = 'dygmm4288',
        recipe_id = Number(req.query.recipe_id),
        query = 'select * from user_recipe where user_id = ? and recipe_id = ?';


    database.query(query,[user_id,recipe_id]).then((row) => {
        //해당 검색 결과가 없을때
        if(row.length === 0) {
            query = 'insert into user_recipe values(?,?,1)';
            return new Promise((response,reject) => {
                database.query(query,[user_id,recipe_id]).then((row)=>{
                    console.log('Setting Recipe is Success');
                }).catch((err) => {
                    throw err;
                });
            });
        }
        //해당 검색 결과가 있다면 수정.UPDATE [테이블] SET [열] = '변경할값' WHERE [조건]

        else {
            query = 'update user_recipe set count = count+1 where user_id = ? and recipe_id = ?';
            return new Promise((response,reject) => {
                database.query(query,[user_id,recipe_id]).then((row) => {
                    console.log("Setting Recipe for updating is success");
                }).catch((err) => {
                    throw err;
                }) 
            })
        }
    })
})
app.get('/test',(req,res)=>{
    console.log(req.query);
})
app.get('/info',(req,res)=>{
    var title = 'In Information Page';
    var html = template.HTML(title,
        `   <div class="all">
        <div class="box">
            <div class="classify">분 류</div>
            <div class="solidbox">등 심</div>
        </div>
        <div class="box">
            <div class="classify">이 름</div>
            <div class="solidbox"><input type="text"></input></div>
        </div>
        <div class="box">
            <div class="classify">보관방법</div>
            <div class="solidbox"><div class="list">냉장보관</div>
            <div class="list">냉동보관</div>
            
        </div>
    </div>
        <div class="box">
            <div class="classify">유통기한</div>
            <div class="solidbox"><p><input type="text" id="datepicker_add_day" placeholder="3일후 날짜"></p>
</div>            
        </div>
</div>
<div class="inputbox">입 력</div>
      <div class="inputbox">취 소</div>

`,` $(function() {
    $( "#testDatepicker" ).datepicker({
    });
});
`);
    res.send(html);
});
//listen
app.listen(3000,function(){
    console.log('Connected 3000');
    
});
//post login
app.post('/form_receiver',async (req,res)=>{ 
    const uid = req.body.uid,
          upw = req.body.upwd,
        DataBase = require('./public/js/DataBase'),
        database = new DataBase(),
        sess = req.session;
        let result = null;
        result = await database.login('select * from user where user_id = ?',[uid,upw]);
        if(result.flag) {
            func.setSess(sess,uid,result.user_name);
            res.redirect('/main');
        }
        else{
            res.redirect(`/loginError/${result}`);
        }
});
