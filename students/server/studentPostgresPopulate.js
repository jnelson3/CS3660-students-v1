/**
 * Created by nelso on 4/18/2017.
 */
let pg = require('pg');
let connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/students';
let fs = require('fs');

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

//let client = new pg.Client(connectionString);
//client.connect();
pool.query(
    'DROP TABLE IF EXISTS students;' +
    'CREATE TABLE students(_id SERIAL PRIMARY KEY,' +
    'fname VARCHAR(40),' +
    'lname VARCHAR(40),' +
    'startDate VARCHAR(10),' +
    'street VARCHAR(40),' +
    'city VARCHAR(40),' +
    'state VARCHAR(2),' +
    'zip VARCHAR(10),' +
    'phone VARCHAR(20),' +
    'year INTEGER,' +
    'id VARCHAR(4))', [], function(err, res){


    fs.readdir(`${__dirname}/students`, function(err, files) {
        console.log("reading file names");
        if (err) {
            console.log(err);
        }


        files.forEach(function (file) {
            fs.readFile(`${__dirname}/students/${file}`, 'utf8', function (err, data) {
                console.log('reading file ' + file);
                data = JSON.parse(data);
                if (err) {
                    console.log(err);
                }
                // console.log('inserting data');
                // console.log(data);
                pool.query(
                    'INSERT INTO students(fname, lname, startdate, street, city, state, zip, phone, year, id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                    [data.fname, data.lname, data.startDate, data.street, data.city, data.state, data.zip, data.phone, data.year, data.id],
                    function(err, res){
                        console.log('inserted ' + file);
                        console.log(err);
                        pool.query('SELECT * FROM students WHERE id=$1', [data.id], function(err, res){
                            console.log(res.rows[0]);
                        })
                    });
            });
        });
    });
});


