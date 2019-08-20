const express = require('express'),
      app = express(),
      template = require('./lib/template'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      path =require('path'),
      doAsync = fn => async (req,res,next) => {
          try {
          await fn(req,res,next);
          } catch(err){
              next(err);
          }
        };
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
    //Check Init Data 
    const cheerio = require('cheerio'),
          fs = require('fs');
    let recipe_table = null;
    //Init Data
    if(true){
    const list = require('./public/js/linked_list'),
          Data = require('./public/js/recipe.js')(),
          initTable = function(table,count) {
            if(count > 0) {
                table.push(new list());
                return initTable(table,count-1);
            }
            else {
                return table;
            }
        };
    let $ = null,
        query = null,
        ingrd_list = new Array(),
        util = require('util');
    recipe_table = new Array();

    recipe_table = initTable(recipe_table,10);

    $ = cheerio.load(fs.readFileSync(__dirname+'/public/recipe_data.xml','utf-8'),{xmlMode:true});
    $('row').each(function() {
        let recipe_id = $(this).find('RECIPE_ID').text(),
            recipe_name = $(this).find('RECIPE_NM_KO').text(),
            type_code = $(this).find('NATION_CODE').text(),
            cooking_time = $(this).find('COOKING_TIME').text(),
            level = $(this).find('LEVEL_NM').text(),
            img_url = $(this).find('IMG_URL').text(),
            classify_code = $(this).find('TY_CODE').text(),
            amount = $(this).find('QNT').text();
        recipe_table[recipe_id % 10].append(new Data.Recipe(recipe_id,recipe_name,type_code,classify_code,cooking_time,amount,level,img_url));
    });
    $ = cheerio.load(fs.readFileSync(__dirname+'/public/ingrd_data.xml','utf-8'),{xmlMode: true});
    $('row').each(function(){
        let recipe_id = $(this).find('RECIPE_ID').text(),
            ing_name = $(this).find('IRDNT_NM').text(),
            ing_amount = $(this).find('IRDNT_CPCTY').text(),
            ing_ty_code = $(this).find('IRDNT_TY_CODE').text(),
            cur = null;

        ingrd_list.push(new Data.Ingredient(recipe_id,ing_name,ing_amount,ing_ty_code));
        cur = recipe_table[recipe_id%10]._head;
        while(cur.next)
        {
            cur = cur.next;
            if(cur.data.recipe_id === recipe_id)
            {
                cur.data.count_ingrd++;
            }
        }
    });
    
    } else {    //exist init

    }
    
    
    //render page
    res.render('welcome',{},(err,html) => {
        if(err) {
            console.log('err?');
            throw err;
        }
        res.end(html)
    });
});
app.get('/login',(req,res)=>{   
    res.render('login',{},(err,html) => {
        if(err) {
            console.log('err?');
            throw err;
        }
        res.end(html)
    });
});
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
            <header class = "header">
            </header>
            <div class = "content">
                ${append}
                <form action= "/form_receiver" method ="POST">
                    <input type = "text"  size = "25" name ="uid" placeholder = "Enter User ID" required autofocus />
                    <input type = "password" size = "25" name = "upwd" placeholder = "Enter User PassWord" required/>
                    <div>
                        <input type = "submit" class = "submitButton" id = "loginButton" value = "로그인"/>
                        <input type = "button" class = "submitButton" id = "skipButton" value = "건너뛰기"/>
                    </div>
                </form>
                <div>
                        <a href="/findUser">아이디 비밀번호 찾기</a> / 
                        <a href= "/signUp">회원가입</a>
                </div>
            </div>
            <div class = "footer">
            </div>
        </div>
`,` $(document).ready(() => {
    $('#skipButton').click(()=>{
   location.href = '/main';
   });
    
})
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
    res.render('main',(err,html) => {
        if(err) {
            console.log('Main Page Error Rendering Error'+err);
            throw err;
        }
        res.end(html);
    })
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
    checkResult = func.checkUser(req.session),
    id = req.session.user_id || null;

res.render('refrigerator',{
    title: title,
    say: checkResult.say,
    state: checkResult.state,
    id: id
},(err,html)=>{
    if(err) {
        throw err;
     }
      res.end(html)
});
});
app.get('/getRecipe',(req,res) => {
    //var user_id = req.query.user_id,
    var user_id = 'dygmm4288',
        query = 'select ing_name, expiry_date from ingredient_u where ingUser_id = ?';

    const DataBase = require('./public/js/DataBase'),
          database = new DataBase();
    try {
    database.query(query,user_id).then((row)=>{
        if(row.length !== 0) {
            console.log(row);
            res.send(row);
            }
        else {
            res.send([]);
        }
        }).catch((err) => {
            throw err;
        });
    }
    catch(err){
        throw err;
    }
});
app.get('/classify',(req,res)=>{
    var title = 'Classify Page',
        html = template.HTML(title,
        `<div class="app">
           <header id = "main_header"> 
                <aside id="user_menu"></aside>
                <h1>분 류</h1>
                <button id="login_btn">로그인</button>
           </header>
           <div class = "content">
               <input type="button" class="btn_classify" value = "육류">
               <input type="button" class="btn_classify" value = "채소">
               <input type="button" class="btn_classify" value = "과일">
               <input type="button" class="btn_classify" value = "수산물">
               <input type="button" class="btn_classify" value = "양념&소스">
               <input type="button" class="btn_classify" value = "유제품">
               <input type="button" class="btn_classify" value = "가공&기타">
           </div>
           <nav id = "main_footer">
                <input type="button" id="back"/>
                <input type="button" id="reload"/>
           </nav>
        </div>`,
        ` /* 로그인 관련 */
        /* 로그인 ajax */
        $.ajax({
            url: '/is_login',
            type: 'get',
            datatype: 'json',
            success: function(flag) {
                if(flag) {
                    $('#login_btn').text('로그아웃');
                }
            }
        });
        /* 로그인 로그아웃 버튼 변경 */
        $('#login_btn').click(function() {
            if($(this).text() === '로그인') {
                location.href = '/login';
            }
            else {
                location.href = '/logout';
            }
        });
           $('input[type=button]').click((onClick)=>{
           var value = onClick.currentTarget.value;
           var adr = '/classify/'+value;
           location.href = adr;
            });
            $('#back').click(() => {
                location.href = '/refrigerator';
            });
            $('#reload').click(() => {
                location.reload();
            });
            $('#user_menu').click(() => {
                location.href = '/main';
            })`);
res.send(html);
});
app.get('/classify/:classifyId',(req,res)=>{
    const classify = require('./public/js/classify');
    var param = null;
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
        case '유제품':
            param = classify.Dairy;
            break;
        case '가공&기타':
            param = classify.Product;
            break;
            default:
                console.error('switch Error');
            break;
    } 
    res.render('classify',{
        value: param,
        classifyId: req.params.classifyId,   
    },(err,html)=>{if(err)throw err; res.end(html)});
});
app.get('/processing',async (req,res)=>{
    var ingrdName = req.query.name || null,
   //var userid = req.session.userid;
        userid = "dygmm4288",
        resist_date = new Date();
        classify_id = req.query.classify_id;
    
    const DataBase = require('./public/js/DataBase'),
          database = new DataBase();
    /* 분류 별 날짜 기준 */
    switch(classify_id) {
        case '육류':
            resist_date.setDate(resist_date.getDate()+3);
            break;
        case '채소':
            resist_date.setDate(resist_date.getDate()+5);
            break;
        case '과일':
            resist_date.setDate(resist_date.getDate()+7);
            break;
        case '수산물':
            resist_date.setDate(resist_date.getDate()+6);
            break;
        case '유제품':
            resist_date.setDate(resist_date.getDate()+10);
            break;
        default :
            resist_date.setFullYear(resist_date.getFullYear()+1);
            break;
    }
   //사용자 정보가 없는 경우
    if(userid === undefined || ingrdName === null) { 
       console.log("Not exsists Users Or ingrdName is null");
       res.send("Fail");
    }
      //사용자 정보가 있는 경우
    else {
        var query = 'select ing_name from ingredient_u where ingUser_id = ? and ing_name = ?';
        try{
            database.query(query,[userid,ingrdName]).then((row) =>{
                return new Promise(async (response,reject) => {
                    if(row.length === 0) {
                        query = 'insert into ingredient_u values(?,?,?,null)';
                        await database.query(query,[userid,ingrdName,resist_date]);
                        response();
                    }
                    else {
                       reject();
                    }
                }).then(() => {
                    console.log('insert is success');
                    res.send("Success");
                }).catch(() => {
                    res.send("Fail");
                });
            });
        } catch(err) {
            console.log('Async Error');
            throw err;
        }
   }
})
app.get('/recipe',(req,res)=>{
    res.render('recipe',{},(err,html)=>{if(err)throw err;res.end(html);});
});
app.get('/recommend',(req,res)=>{
    res.render('recommend',{},(err,html) => {
        if(err) {
            throw err;
        }
        res.end(html);
    });
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
    //Check Init Data 
    const cheerio = require('cheerio'),
          fs = require('fs');

          //Init Data
    if(true){
    const list = require('./public/js/linked_list'),
          Data = require('./public/js/recipe.js')(),
          initTable = function(table,count) {
            if(count > 0) {
                table.push(new list());
                return initTable(table,count-1);
            }
            else {
                return table;
            }
        },json = async function(wr,filename,result) {
            if(wr === 'r') {
                var output = fs.readFileSync(__dirname+filename,'utf-8',(err,data) => {
                    if(err) {
                        throw err;
                    }
                    console.log('Read Success');
                });
                output = JSON.parse(output);
                return output;
               
            } 
            else {
                result = JSON.stringify(result);
                return fs.writeFile(__dirname+filename,result,'utf-8',(err,data) => {
                    if(err) {
                        throw err;
                    }
                    console.log('Write Success');
                });
            }
        };
    let $ = null,
        query = null,
        ingrd_list = new Array(),
        recipe_table = new Array();

        recipe_table = initTable(recipe_table,10);

    $ = cheerio.load(fs.readFileSync(__dirname+'/public/recipe_data.xml','utf-8'),{xmlMode:true});

    $('row').each(function() {
        let recipe_id = $(this).find('RECIPE_ID').text(),
            recipe_name = $(this).find('RECIPE_NM_KO').text(),
            type_code = $(this).find('NATION_CODE').text(),
            cooking_time = $(this).find('COOKING_TIME').text(),
            level = $(this).find('LEVEL_NM').text(),
            img_url = $(this).find('IMG_URL').text(),
            classify_code = $(this).find('TY_CODE').text(),
            amount = $(this).find('QNT').text();
        recipe_table[recipe_id % 10].append(new Data.Recipe(recipe_id,recipe_name,type_code,classify_code,cooking_time,amount,level,img_url));
    });
    $ = cheerio.load(fs.readFileSync(__dirname+'/public/ingrd_data.xml','utf-8'),{xmlMode: true});
    $('row').each(function(){
        let recipe_id = $(this).find('RECIPE_ID').text(),
            ing_name = $(this).find('IRDNT_NM').text(),
            ing_amount = $(this).find('IRDNT_CPCTY').text(),
            ing_ty_code = $(this).find('IRDNT_TY_CODE').text(),
            cur = null;

        ingrd_list.push(new Data.Ingredient(recipe_id,ing_name,ing_amount,ing_ty_code));
        cur = recipe_table[recipe_id%10]._head;
        while(cur.next)
        {
            cur = cur.next;
            if(cur.data.recipe_id === recipe_id)
            {
                cur.data.count_ingrd++;
            }
        }
    });
    var output_data = json('r','/public/ingrd_data.json');
    console.log(output_data);
}
});
app.get('/recommend/:way',(req,res) => {
var way = req.params.way;

res.render('recipe',{way: way},(err,html) => {
    if(err) {
        console.log(err);
        throw err;
    }
    res.end(html);
    });
});
app.get('/process_recommend',(req,res) => {
    const cheerio = require('cheerio'),
          fs = require('fs'),
          ingrd_list = [],
          list = require('./public/js/linked_list'),
          Data = require('./public/js/recipe.js')(),
          initTable = function(table,count) {
              if(count > 0) {
                  table.push(new list());
                  return initTable(table,count-1);
              }
              else {
                  return table;
              }
          };
    let recipe_table = [];

        $ = null,
        query = null;
        //init recipe_table
    recipe_table = initTable(recipe_table,10);
    $ = cheerio.load(fs.readFileSync(__dirname+'/public/recipe_data.xml','utf-8'),{xmlMode:true});
    $('row').each(function() {
        let recipe_id = $(this).find('RECIPE_ID').text(),
            recipe_name = $(this).find('RECIPE_NM_KO').text(),
            type_code = $(this).find('NATION_CODE').text(),
            cooking_time = $(this).find('COOKING_TIME').text(),
            level = $(this).find('LEVEL_NM').text(),
            img_url = $(this).find('IMG_URL').text(),
            classify_code = $(this).find('TY_CODE').text(),
            amount = $(this).find('QNT').text();
        recipe_table[recipe_id % 10].append(new Data.Recipe(recipe_id,recipe_name,type_code,classify_code,cooking_time,amount,level,img_url));
    });
    $ = cheerio.load(fs.readFileSync(__dirname+'/public/ingrd_data.xml','utf-8'),{xmlMode: true});
$('row').each(function(){
    let r_id = $(this).find('RECIPE_ID').text();
    let ing_name = $(this).find('IRDNT_NM').text();
    let ing_amount = $(this).find('IRDNT_CPCTY').text();
    let ing_ty_code = $(this).find('IRDNT_TY_CODE').text();
    let ing_ty = $(this).find('IRDNT_TY_NM').text();
    ingrd_list.push(new Data.Ingredient(r_id,ing_name,ing_amount,ing_ty_code,ing_ty));
    var cur = recipe_table[r_id%10]._head;
    while(cur.next)
    {
        cur = cur.next;
        if(cur.data.recipe_id === r_id)
        {
            cur.data.count_ingrd++;
        }
        
    }
});
    if(req.query.way === 'content'){
        
    const DataBase = require('./public/js/DataBase'),
          database = new DataBase(),
          userData = require('./public/js/userData')(),
          arr_userData = [],
          result_recommend = [];

    var content = function(cur,ingrd_v,v,is_prime) { 
        while(cur.next) {
            cur = cur.next;
            var tmp_weight = 0;
            if(cur.data.recipe_id === ingrd_v.ingRecipe_id) {
                cur.data.count += 1;
                if(result_recommend.indexOf(cur.data) === -1) {
                    result_recommend.push(cur.data);
                }
                switch(v.state) {
                    case '좋음':
                        tmp_weight += 5;
                        break;
                    case '보통':
                        tmp_weight += 8;
                        break;
                    default:
                        tmp_weight += 10;
                        break;
                }
                cur.data.weight += (tmp_weight/10)*0.1;

                if(is_prime) {
                    tmp_weight = 0;
                    cur.data.prime_ingrd++;
                    if(v.amount > 500) {
                        tmp_weight += 10;
                    } else if(v.amount > 250) {
                        tmp_weight += 8;
                    } else {
                        tmp_weight += 5;
                    }
                    cur.data.weight += (tmp_weight/10)*0.1;
                } else {
                    cur.data.sub_ingrd += 1;
                    tmp_weight = 0;
                    if(v.amount > 250) {
                        tmp_weight += 10;
                    } else if(v.amount > 100) {
                        tmp_weight += 8;
                    } else {
                        tmp_weight = 5;
                    }
                    cur.data.weight += (tmp_weight/10) * 0.1;
                }
            }
        }
    };
var user_id = 'dygmm4288';
    query = 'select * from ingredient_u where ingUser_id = ?';
    database.query(query,user_id).then(row => {
        if(row.length === 0) {
            console.log('not exsist');
            return null;
        } 
        else {

            row.forEach(value => {
                arr_userData.push(new userData.UserIngrd(user_id,value,'좋음',500));
            });

            return new Promise((respone,reject) => {
            var name_u = null,
                name_i = null;
            arr_userData.forEach(user_value => {
            name_u = user_value.ingrd_name.ing_name;
            ingrd_list.forEach((ingrd_value,index) => {
                name_i = ingrd_value.ingredient_name;
                if(name_u === name_i) {
                    var cur = recipe_table[ingrd_value.ingRecipe_id % 10]._head,
                        flag = ingrd_value.ing_ty_code == '3060001' ? true : false;
                    content(cur,ingrd_value,user_value,flag); 
                    } 
                });
             });
             respone();
            }).then(() => {
                res.send(result_recommend);
            }).catch((err) => {
                console.log(err);
            })
        }
    }).catch(err => {
        if(err) {
            console.log('query error');
            throw err;
        }
    })
    } else {
        console.log('ubcf Start');
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
      var result = null,
          to_send_arr = [];
        result = (new ubCF().excute(arr_user,'이진호'));
        
        result.forEach(value => {
            /* recipe_id : int, count: string? */
            var cur = recipe_table[value.recipe_id%10]._head;
                
            while(cur.next) {
                cur = cur.next;
                var recipe_id = cur.data.recipe_id
                
                if(recipe_id === value.recipe_id.toString()) {
                    to_send_arr.push(cur.data);
                }
            }
        });
        res.send(to_send_arr);
    }
    
});
//listen
app.listen(3000,function(){
    console.log('Connected 3000');
    
});
app.get('/db_query',(req, res) => {
    var text = req.query.text,
        query = null,
        date = req.query.date,
        id = req.query.user_id || 'dygmm4288',
        ing_name = req.query.name,
        flag = {response: true};


    const DataBase = require('./public/js/DataBase'),
          database = new DataBase();

    if(text === '확인') {
        query = 'update ingredient_u set expiry_date = ? where ing_name = ? and ingUser_id = ?';
        database.query(query,[date,ing_name,id]).then((row) => {
            console.log('updating is completed');
            flag.response = true;
            res.status(200).send(flag);
        })
        .catch((err) => {
            console.log('확인 Error');
            flag.respones = false;
            res.status(400).send(flag);
            throw err;
        })
    } else if(text === '삭제') {
        query = 'select * from ingredient_u where ingUser_id = ? and ing_name = ?';
        database.query(query,[id,ing_name]).then((row) => {
            console.log('selection is completed');
            return new Promise((resolve,reject) => {
                if(row.length === 0) {
                    reject();
                } else {
                    query = 'delete from ingredient_u where ingUser_id = ? and ing_name = ?';
                    database.query(query,[id,ing_name]).then((row) => {
                        console.log('deleting is completed');
                        resolve();
                    }).catch((err) => {
                        reject();
                        console.log('삭제 오류');
                        throw err;
                    });
                }
            }).then(() => {
                flag.response = true;
                res.status(200).send(flag);
            }).catch(() => {
                flag.response = false;
                res.status(204).send(flag);
            });
        }).catch((err) => {
            console.log('삭제 Error');
            throw err;
        });
    }
});
app.post('/form_receiver',async (req,res) => { 
    const uid = req.body.uid,
          upw = req.body.upwd,
        DataBase = require('./public/js/DataBase'),
        database = new DataBase(),
        sess = req.session;

    let err_level = null;
    return new Promise((resolve,reject) => {
        database.query('select * from user where user_id = ?',uid).then((row) => {
            database.close().then(() => {
                console.log('Closing Connection');
            }).catch((err) => {
                console.log(`'Closing Error : ${err.code}`);
            });
            //사용자 아이디 정보가 없음
            if(row.length === 0) {
                console.log('사용자 아이디 정보 없음');
                err_level = 1;
                reject(err_level);
            }//사용자 아이디 정보가 같음.
            else if(row[0].user_password === upw) {
                resolve();
            }//사용자 아이디는 있으나 비밀번호가 같지 않음.
            else {
                err_level = 2;
                reject(err_level);
            }
        }).catch(err => {
            console.log(err);
            throw err;
        });    
    }).then(() => {
        sess.user_id = uid;
        console.log(sess);
        res.redirect('/main');
    })
    .catch((err_level) => {
        res.redirect(`/loginError/${err_level}`);
    });
});
app.get('/is_login',(req,res) => {
    const sess = req.session;
    console.log(sess);
    if(!sess.user_id) {
        res.send(false);
    }
    else {
        res.send(true);
    }
})
