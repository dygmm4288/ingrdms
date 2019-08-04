const mysql = require('mysql'),
      config = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'lee123321',
        database: 'hungry'
      },
      DataBase = (function () {
         function DataBase() {
            this.err_level = null;
            try{
              this.connection = mysql.createConnection(config);
            }
            catch(err){
                console.log('CONNECTION ERROR');
            }
         }
          DataBase.prototype.query = function(sql, args) {
            return new Promise((res,rej) => {
                this.connection.query(sql,args,(err,row) => {
                    if(err) {
                        return rej(err);
                    }
                    res(row);   
                })
            });
          };
          DataBase.prototype.close = function() {
              return new Promise((res,rej) => {
                  this.connection.end(err => {
                      if(err) {
                          return rej(err);
                      }
                      res();
                  })
              })
          };
          DataBase.prototype.login = function(sql,args) {
              var uid = args[0],
                  upw = args[1],
                  err_level = null;
            return new Promise((res,rej) =>{
                this.query(sql,uid).then(row => {
                    if(row.length === 0) {
                        err_level = 1;
                        rej(err_level);
                    }
                    else if(row[0].user_password === upw) {
                        res(row[0].user_name);                        
                    }
                    else {
                        err_level = 2;
                        rej(err_level);
                    }
                    this.close().catch((err)=>{
                        console.log('Closing Error');
                    throw err;
                });
                })
            }).then((user_name) => {
                var flag = true;
                return {
                    flag: flag,
                    user_name: user_name
                };
            })
            .catch((err_level) => {
                return err_level;
            })
          };
          return DataBase;
      }());
      module.exports = DataBase;
