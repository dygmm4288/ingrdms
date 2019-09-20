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
    res.render('welcome',{},(err,html) => {
        if(err) {
            console.log('err?');
            throw err;
        }
        res.end(html)
    });
});
app.get('/login/:errlevel',(req,res)=>{
    
    res.render('login',{err_level : req.params.errlevel},(err,html) => {
        if(err) {
            console.log('err?');
            throw err;
        }
        res.end(html)
    });
});
app.get('/login',(req,res) => {
    res.render('login',{err_level: undefined},(err,html) => {
        if(err) {
            throw err;
        }
        res.end(html);
    });
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
res.render('findUser',{},(err,html) => {
    if(err) {
        throw err;
    }
    res.end(html);
})
});

app.get('/signUp',(req,res)=>{
    res.render('signUp',{},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
    });
});

app.get('/main',(req,res)=>{
    const user_id = req.session.user_id
    res.render('main',{user_id: user_id},(err,html) => {
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
const user_id = req.session.user_id;

res.render('refrigerator',{
    user_id: user_id
},(err,html)=>{
    if(err) {
        throw err;
     }
      res.end(html)
});
});
app.get('/getRecipe',(req,res) => {
    var user_id = req.query.user_id,
        query = 'select * from ingredient_u where ingUser_id = ?';

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
        user_id = req.session.user_id,
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
        var user_id = '${user_id}';
        if(user_id !== 'undefined') {
            $('#login_btn').text('로그아웃');
        }
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
    var param = null,
        user_id = req.session.user_id;
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
        user_id: user_id
    },(err,html)=>{if(err)throw err; res.end(html)});
});
app.get('/processing',async (req,res)=>{
    var ingrdName = req.query.name || null,
        userid = req.session_user_id || "dygmm4288",
        resist_date = new Date();
        classify_id = req.query.classify_id;

    const DataBase = require('./public/js/DataBase'),
          db = new DataBase();
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
       res.send('fail');
    }
    //사용자 정보가 있는 경우
    else {
        let query = "select * from sensor order by 'time' desc";
        new Promise((resolve,reject) => {
            db.query(query,null).then((row) => {
                if(row.length !== 0) {
                    let current_time = new Date(),
                        result = {
                        user_id: userid,
                        ingrd_name: ingrdName,
                        resist_date: resist_date,
                        classify_id: classify_id,
                        sensor_id: null,
                        };
                    
                    row.forEach((value) => {
                        temp_time = new Date(value.time);
                        var diff_time = (current_time - temp_time)/(1000*60);
                        if(diff_time < 2 && diff_time > 0) {
                            result.sensor_id = value.sensor_id;
                        }
                    });
                    if(result.sensor_id) {
                        resolve(result);
                    } else {
                        result.sensor_id = row[0].sensor_id;
                        resolve(result);
                    }
                }
            }).catch((err) => {
                if(err) {
                    reject(err);
                    throw err;
                }
            });
        }).then((result) => {
            //센서가 겹치는 지 확인.
            var query = 'select * from ingredient_u where ingUser_id = ? and sensor_id = ?';
                db.query(query,[result.user_id,result.sensor_id]).then((row) => {
                    let row_length = row.length;
                    //센서가 겹치지 않는다. 삽입
                    if(row_length === 0) {
                        query = 'insert into ingredient_u values (?,?,?,?,?)';
                        db.query(query,[result.user_id,result.ingrd_name,result.resist_date,result.classify_id,result.sensor_id])
                        .then(() => {
                            console.log("Inserting");
                            res.send("success");
                        }).catch((err) => {
                            res.send("fail");
                            if(err) {
                                throw err;
                            }
                        });// 센서가 하나 겹친다. 업데이트
                } else if(row_length === 1) { 
                    query = 'update ingredient_u set ing_name = ? where sensor_id = ?';
                    db.query(query,[result.ingrd_name,result.sensor_id]).then((row) => {
                        console.log("Updating");
                        res.send("update");
                    }).catch((err) => {
                        if(err) {
                            throw err;
                        }
                    })
                } else {

                }
        }).catch((err) => {
            if(err) {
                throw err;
            }
        });
        }) .catch((err) => {
            if(err) {
                throw err;
            }
    });
    }
})
app.get('/recipe',(req,res)=>{
    res.render('recipe',{},(err,html)=>{if(err)throw err;res.end(html);});
});
app.get('/recommend',(req,res)=>{
    var user_id = req.session.user_id;

    res.render('recommend',{user_id:user_id},(err,html) => {
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
    var IBCF = require('./IBCF.js'),
        ibcf = new IBCF();
    res.send(ibcf.excute(1));
    
});
app.get('/recommend/:way',(req,res) => {
var way = req.params.way,
    user_id = req.session.user_id;

res.render('recipe',{way: way, user_id: user_id},(err,html) => {
    if(err) {
        console.log(err);
        throw err;
    }
    res.end(html);
    });
});
app.get('/process_recommend',(req,res) => {
    const fs = require('fs'),
          readFile = function(result,path,json) {
              result = fs.readFileSync(__dirname+path,'utf-8',(err,data)=>{
                  if(err) {
                      throw err;
                  }
              });
              result = json(result);
              return result;
          },jsonParse = function(data) {
              return JSON.parse(data);
          },find = function(key,arr,predi) {
             var result = undefined;
              for(var i = 0,len = arr.length;i<len;i++)
              {
                if(key === predi(arr[i])) {
                    result = arr[i].key;
                    break;
                }
              }
              return result;
          };

    let recipe_table = [],
        ingrd_list = [];
        $ = null,
        query = null,
        target = req.session.user_id || 'dygmm4288';
        //Init recipe_table and Ingrd_list For Content Recommend
        recipe_table = readFile(recipe_table,'/public/recipe_data.json',jsonParse);
        ingrd_list = readFile(ingrd_list,'/public/ingrd_data.json',jsonParse);
    //재료 기반.
    if(req.query.way === 'content'){

    const DataBase = require('./public/js/DataBase'),
          database = new DataBase(),
          UserData = require('./public/js/userData')(),
          arr_userData = [],
          result_recommend = [];

    var content = function(cur,ingrd_v,v,is_prime) {
        /* @param  cur 연결리스트의 헤드
                   ingrd_v 재료 객체
                   v 사용자가 가진 재료
                   is_prime 주재료인지 부재료인지 구별
        */
    var tmp_weight = 0,
        cur_result = null,
        result_index = 0;
        while(cur.next) {
            cur = cur.next;
            tmp_weight = 0;
            if(cur.data.recipe_id === ingrd_v.ingRecipe_id) {
                result_index = findIndex(result_recommend,matchObject(cur.data));
                if( result_index === -1){
                    result_recommend.push(copyObject(cur.data));
                    result_index = result_recommend.length - 1;
                    cur_result = result_recommend[result_index];
                    tmp_weight = stateWeight(v.state);
                    cur_result.weight += weightCalc(tmp_weight,10,0.1);
                    tmp_weight = 0;
                    tmp_weight = primeWeight(is_prime,v.amount);
                    is_prime ? cur_result.prime_ingrd++ : cur_result.sub_ingrd++;
                    cur_result.weight += weightCalc(tmp_weight,10,0.1);
                } else {
                    cur_result = result_recommend[result_index];
                    tmp_weight = stateWeight(v.state);
                    cur_result.weight += weightCalc(tmp_weight,10,0.1);
                    tmp_weight = 0;
                    tmp_weight = primeWeight(is_prime,v.amount);
                    is_prime ? cur_result.prime_ingrd++ : cur_result.sub_ingrd++;
                    cur_result.weight += weightCalc(tmp_weight,10,0.1);
                }
            }
        }
      },findIndex = function(list,predicate) {
          for(var i = 0,len =list.length;i<len;i++) {
              if(predicate(list[i])) {
                  return i;
              }
          }
          return -1;
      },matchObject = function(target) {
          return function(compared) {
              return (target === compared);
          }
      },weightCalc = function(weight,total_score,points) {
          return (weight/total_score)*points;
      },copyObject = function(target) {
          var copy = {};
          if(Array.isArray(target)) {
              copy = target.slice().map(v=>{
                  return copyObject(v);
                })
          } else if(typeof target === 'obejct' && targ !== null) {
              for(var attr in target) {
                  if(target.hasOwnProperty(attr)) {
                      copy[attr] = copyObject(obj[attr]);
                  }
              }
          } else {
              copy = target;
          }
          return copy;
      },stateWeight = function(state) {
        tmp_weight = 0;
            switch(state) {
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
        return tmp_weight;
      },primeWeight = function(prime,amount){
          var tmp_weight = 0;
        if(prime) {
            if(amount > 500) {
                tmp_weight += 10;
            } else if(amount > 250) {
                tmp_weight += 8;
            } else {
                tmp_weight += 5;
            }

        } else {
            if(amount > 250) {
                tmp_weight += 10;
            } else if(amount > 100) {
                tmp_weight += 8;
            } else {
                tmp_weight = 5;
            }
        }
        return tmp_weight;
      };
//testing Data user => dygmm4288
var user_id = target;
    query = 'select * from ingredient_u where ingUser_id = ?';
    database.query(query,user_id).then(row => {
        if(row.length === 0) {
            console.log('not exsist');
            return null;
        }
        else {

            row.forEach(value => {
                arr_userData.push(new UserData.UserIngrd(user_id,value,'좋음',500));
            });

            return new Promise((respone,reject) => {
            var name_u = null,
                name_i = null;
                //_compose 방법을 응용하면 될 듯 하다.
            arr_userData.forEach(user_value => {
            name_u = user_value.ingrd_name.ing_name;
            ingrd_list.forEach((ingrd_value) => {
                name_i = ingrd_value.ingredient_name;
                if(name_u === name_i) {
                    var cur = recipe_table[ingrd_value.ingRecipe_id % 10]._head,
                        flag = ingrd_value.ing_ty_code == '3060001' ? true : false;
                    content(cur,ingrd_value,user_value,flag);
                    }
                });
             });
             result_recommend.forEach(value =>{
                var prime = value.prime_ingrd,
                    sub = value.sub_ingrd,
                    total_count = value.count_ingrd,
                    tmp_weight = 0;
                tmp_weight += weightCalc(prime,total_count,14);
                tmp_weight += weightCalc(sub,total_count,6);
                value.weight = weightCalc(tmp_weight,20,0.2);
             })
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
        const IBCF = require('./public/js/IBCF.js'),
              ibcf = new IBCF(),
              UBCF = require('./public/js/UBCF'),
              ubcf = new UBCF(),
              DataBase = require('./public/js/DataBase'),
              db = new DataBase(),
              listFind = function(linked_list,predi) {
                  var cur = linked_list._head;
                  while(cur.next) {
                      cur = cur.next;
                      if(predi(cur)) return cur;
                  }
                  return -1;
              };

        let to_send_arr = [],
            arr_user = [];

        /* Init Array User for UBCF */
        new Promise((resolve,reject) => {
            var query = 'select * from user_recipe',
                findIndex = function(arr,predi) {
                    for(var i = 0,len = arr.length;i<len;i++)
                    {
                        if(predi(arr[i])) return i;
                    }
                    return -1;
                },compareValue = function(value) {
                    return function(target) {
                        return (target.name === value);
                    }
                };
            db.query(query,null).then((row) => {
                db.close().catch((err) => {
                    /* DB Closing Error */
                    reject(err);
                    if(err) {
                        throw err;
                    }
                });
                row.forEach((value) => {
                    var index = findIndex(arr_user,compareValue(value.user_id)),
                        data = {
                        recipe_id: null,
                        count : null
                    },  user_data = {
                        name: null,
                        data: []
                    };
                    if(index === -1) {
                        user_data['name'] = value.user_id;
                        data['recipe_id'] = value.recipe_id;
                        data['count'] = value.count;
                        user_data['data'].push(data);
                        arr_user.push(user_data);
                    } else {
                        data['recipe_id'] = value.recipe_id;
                        data['count'] = value.count;
                        arr_user[index].data.push(data);
                    }
                });
                resolve(arr_user);
            }).catch((err) => {
                /* DB Error */
                if(err) {
                    throw err;
                }
            });
        }).then((result) => {
            var ubcf_result = ubcf.execute(result,target),
                ibcf_result = ibcf.execute(ubcf_result[0].recipe_id);
                ubcf_result.forEach((value) => {
                    var recipe_id = value.recipe_id,
                        cur = null;
                    cur = listFind(recipe_table[recipe_id % 10],recipe_id => cur => cur.data.recipe_id === recipe_id);
                    to_send_arr.push(cur.data);
                });
                ibcf_result.forEach((value) => {
                   var recipe_id = parseInt(value.arc_recipe_id),
                       cur = null;
                    cur = listFind(recipe_table[recipe_id % 10],recipe_id => cur => cur.data.recipe_id === recipe_id);
                    to_send_arr.push(cur.data);
                    /* 중복되는것이 들어갈 수 있다. */
                });
                res.send(to_send_arr);
        }).catch((err) => {
            throw err;
        })
    }

});
//listen
console.log("Port : "+ process.env.PORT);
app.listen(process.env.PORT || 3000,function(){
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
app.post('/form_receiver',(req,res) => {
    const uid = req.body.uid,
          upw = req.body.upwd,
        DataBase = require('./public/js/DataBase'),
        db = new DataBase(),
        sess = req.session;
    let err_level = null;
    return new Promise((resolve,reject) => {
        db.query('select * from user where user_id = ?',uid).then((row) => {
            //Error
            //None User information
            if(row.length === 0) {
                console.log('사용자 아이디 정보 없음');
                err_level = 1;
                reject(err_level);
            }//Correct
            else if(row[0].user_password === upw) {
                console.log('correct login');
                resolve();
            }//사용자 아이디는 있으나 비밀번호가 같지 않음.
            else {
                err_level = 2;
                reject(err_level);
            }
            db.close().then(() => {
                console.log('Closing Connection');
            }).catch((err) => {
                console.log(`'Closing Error : ${err.code}`);
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }).then(() => {
        sess.user_id = uid;
        console.log(sess);
        res.send('login success');
    })
    .catch((err_level) => {
        console.log(err_level);
        res.send(`${err_level}`);
    });
});
app.get('/db_findUser',(req,res) => {
    var req = req.query,
        user_id = req.user_id || undefined,
        user_name = req.user_name,
        user_mail = req.user_email || undefined,
        query = null;
    const DataBase = require('./public/js/DataBase'),
          db = new DataBase();
console.log(user_id);
    if(user_id === undefined) {
        query = 'select user_id from user where user_name =? and e_mail = ?';
        db.query(query,[user_name,user_mail]).then((row) => {
            if(row.length === 0) {
                res.send('Not Found');
            } else {
                res.send(row);
            }
        }).catch((err) => {
            if(err) {
                throw err;
            }
        })
        
    } //비밀번호 찾기 
    else {
    }
});
app.post('/db_signup',(req,res) => {
    const user_id = req.body.id,
          user_name = req.body.name,
          e_mail = req.body.e_mail,
          user_password = req.body.pwd,
          DataBase = require('./public/js/DataBase'),
          db = new DataBase();
    let query = 'select user_id from user where user_id = ?';
    try {
        db.query(query,user_id)
        .then((row) => {
            console.log(`${query} result is ${row}`);
            if(row.length === 0) {
                query = 'insert into user values (?,?,?,?)';
                return new Promise((resolve,reject) => {
                    db.query(query,[user_id,user_password,user_name,e_mail])
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
                })
                .then(() => {
                    res.send('success');
                })
                .catch((err) => {
                    console.log('insert error');
                    res.send('fail');
                    throw err;
                })
            } else {
                res.send('exist');
            }
        })
        .catch((err) => {
            console.log(`${query} error ${err}`);
            throw err;
        })
    } catch(err) {
        throw err;
    }
    
    
    
})
app.get('/sensor',(req,res) => {
    const DataBase = require('./public/js/DataBase'),
          db = new DataBase();
    let sensor_id = req.query.sensor_id,
        value = parseFloat(req.query.value),
        time = new Date(),
        query = null;
        console.log(req.query);
    if(sensor_id && value !== undefined ) {
        query = 'UPDATE sensor SET value = ? ,time = ? WHERE sensor_id = ?';
        db.query(query,[value,time,sensor_id]).then((row) => {
            console.log('Updating!');
        }).catch((err) => {
            if(err) {
                throw err;
            }
        });
    }
    
    
})

