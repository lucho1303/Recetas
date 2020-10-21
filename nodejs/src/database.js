const mysql = require('mysql');
const {database} = require('./keys');
const { promisify} = require('util');

const pool = mysql.createPool(database);
pool.getConnection((err, connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.err('DATABASE  HAST TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.err('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DB is CONNECTED');
    return;
});
pool.query = promisify(pool.query);

module.exports = pool;
