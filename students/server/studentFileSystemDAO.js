/**
 * Created by nelso on 4/17/2017.
 */
let fs = require('fs');

exports.list = function(callbackFunc) {
    fs.readdir(`${__dirname}/students`, function(err, files) {
        if (err) {
            return callbackFunc(err, null);
        } else {
            var fileList = files.map(fileName => fileName.replace('.json', ''));
            callbackFunc(err, fileList);
        }
    });
};

exports.read = function(id, callbackFunc) {
    fs.readFile(`${__dirname}/students/${id}.json`, 'utf8', function(err, data) {
        if (err) {
            callbackFunc(err, null);
        } else {
            callbackFunc(err, JSON.parse(data));
        }
    });
};

exports.update = function(id, data, callbackFunc) {
    var id = req.params.id;
    var data = JSON.stringify(req.body, null, 2);

    fs.writeFile(`${__dirname}/students/${id}.json`, data, 'utf8', function(err) {
        if (err) {
            callbackFunc(err, null);
        } else {
            callbackFunc(err, null);
        }
    });
};

exports.delete = function(id, callbackFunc) {
    var id = req.params.id;
    fs.unlink(`${__dirname}/students/${id}.json`, function(err) {
        if (err) {
            callbackFunc(err, null);
        } else {
            callbackFunc(err, null);
        }
    });
};

exports.create = function(data, callbackFunc) {
    fs.readdir(`${__dirname}/students`, function(err, files) {
        if (err) {
            callbackFunc(err, null);
            return;
        };

        var fileList = files.map(fileName => fileName.replace('.json', ''));

        var id = pad(parseInt(fileList[fileList.length - 1]) + 1);
        data.id = id;

        fs.writeFile(`${__dirname}/students/${id}.json`, JSON.stringify(data, null, 2), 'utf8', function(err) {
            if (err) {
                callbackFunc(err, null);
            } else {
                callbackFunc(err, {id: id});
            }
        });
    });
};

function pad(num) {
    var s = "0000" + num;
    return s.substr(s.length - 4);
}