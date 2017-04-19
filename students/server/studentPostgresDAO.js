/**
 * Created by nelso on 4/17/2017.
 */

let mongo = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
const URL = 'mongodb://127.0.0.1:27017/students';
let pg = require('pg');

let dbConfig = {
    user: 'postgres',
    database: 'students',
    password: '102282',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

let pool = new pg.Pool(dbConfig);
pool.on('error', function(err, client){
    console.error('idle client error', err.message, err.stack);
});

exports.list = function(callbackFunc) {
    pool.query(
        'SELECT id FROM students', [], function(err, res){
            if (err) return callbackFunc(err, null);

            let ids = [];
            res.rows.forEach(function(id){
                ids.push(id.id);
            });
            console.log('ids = ' + ids);
            callbackFunc(err, ids);
        }
    )
};

exports.read = function(id, callbackFunc) {
    console.log('id = ' + id);
    pool.query('SELECT fname, lname, startdate as "startDate", street, city, state, zip, phone, year, id FROM students WHERE id=$1', [id], function(err, res){
        if (err) return callbackFunc(err, null);

        callbackFunc(err, res.rows[0]);
    });
};

exports.update = function(id, data, callbackFunc) {
    pool.query("UPDATE students SET fname=$1, lname=$2, startdate=$3, street=$4, city=$5, state=$6, zip=$7, phone=$8, year=$9, id=$10 WHERE id=$10",
        [data.fname, data.lname, data.startDate, data.street, data.city, data.state, data.zip, data.phone, data.year, data.id],
        function(err, res){
        if (err) return callbackFunc(err, null);

        //ToDo
        // replace the null with some data
        callbackFunc(err, null);
    });
};

exports.delete = function(id, callbackFunc) {
    pool.query("DELETE FROM students WHERE id=$1", [id], function(err, res){
        if (err) return callbackFunc(err, null);

        //ToDo
        // replace the null with some data
        callbackFunc(err, null);
    })
};

exports.create = function(data, callbackFunc) {
    let id = '';
    pool.query('SELECT MAX(id) FROM students', [], function(err, res){
        console.log(data)
        id = parseInt(res.rows[0].max) + 1;
        console.log('id = ' + id);
        data.id = pad(id);

        pool.query(
            'INSERT INTO students(fname, lname, startdate, street, city, state, zip, phone, year, id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [data.fname, data.lname, data.startDate, data.street, data.city, data.state, data.zip, data.phone, data.year, data.id],
            function(err, res){
            console.log('inserted ' + data.id);
            console.log(err);
            pool.query('SELECT * FROM students WHERE id=$1', [data.id], function(err, res){
                console.log(res.rows[0]);
            })
        });
    });
};

function pad(num) {
    var s = "0000" + num;
    return s.substr(s.length - 4);
}