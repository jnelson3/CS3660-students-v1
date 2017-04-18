/**
 * Created by nelso on 4/17/2017.
 */

let mongo = require('mongodb').MongoClient;
let ObjectID = require('mongodb').OjbectID;
let fs = require('fs');
const URL = 'mongodb://127.0.0.1:27017/students';

fs.readdir(`${__dirname}/students`, function(err, files) {
    console.log("reading file names");
    if (err) {
        console.log(err);
    }

    files.forEach(function(file){
        fs.readFile(`${__dirname}/students/${file}`, 'utf8', function(err, data) {
            console.log('reading file ' + file);
            if (err) {
                console.log(err);
            }
            mongo.connect(URL, function(err, db) {
                console.log('inserting file');
                if (err) console.log(err);

                db.collection('students').insertOne(JSON.parse(data), function(err, r){
                    if (err) console.log(err);

                    // db.collection('students').findOne({id: JSON.parse(data).id}, {}, function(err, result){
                    //     console.log("student = " + JSON.stringify(result));
                    // });

                    db.close();
                });
            });
        });
    });

    mongo.connect(URL, function(err, db){
        if (err) console.log(err);

        db.collection('students').find().toArray(function(err, docs) {
            console.log(docs.length);
            docs.forEach(function(doc){
                console.log(doc);
            });
            db.close;
        });
    });
});

