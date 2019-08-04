const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'lee123321',
    database: 'hungry'
});
const db = function(){};
db.prototype.login() = function(){
    
}