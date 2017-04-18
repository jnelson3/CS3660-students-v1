/**
 * Created by nelso on 4/17/2017.
 */

let mongo = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
const URL = 'mongodb://127.0.0.1:27017/students';

exports.list = function(callbackFunc) {
    mongo.connect(URL, function(err, db) {
        if (err) return callbackFunc(err, null);

        db.collection('students').distinct('id', {}, function(err, result){
            if (err) return callbackFunc(err, null);
            callbackFunc(err, result);
            db.close();
        });
    });
};

exports.read = function(id, callbackFunc) {
    mongo.connect(URL, function(err, db) {
        if (err) return callbackFunc(err, null);

        db.collection('students').findOne({id: id}, {}, function(err, result){
            console.log('read student ' + id);
            callbackFunc(err, result);
            db.close();
        });
    });
};

exports.update = function(id, data, callbackFunc) {
    mongo.connect(URL, function(err, db) {
        if(err) return callbackFunc(err, null);

        db.collection('students')
            .updateOne(
                {id: id},
                {$set: data},
                function(err, result) {
                    callbackFunc(err, result);
                    db.close();
                }
            );
    });
};

exports.delete = function(id, callbackFunc) {
    mongo.connect(URL, function(err, db) {
        if (err) return callbackFunc(err, null);

        db.collection('students')
            .deleteOne(
                {id: id},
                function(err, result) {
                    callbackFunc(err, result);
                    db.close();
                }
            );
    });
};

exports.create = function(data, callbackFunc) {
    mongo.connect(URL, function (err, db) {
        if (err) console.log(err);

        db.collection('students')
            .distinct('id', {}, function(err, ids) {
                ids.sort();
                let id = pad(parseInt(ids[ids.length - 1]) + 1);
                data.id = id;
                console.log("student = " + data);

                db.collection('students').insertOne(data, function (err, result) {
                    if (err) console.log(err);
                    callbackFunc(err, result);
                    db.close();
                });
        });
    });
};

function pad(num) {
    var s = "0000" + num;
    return s.substr(s.length - 4);
}