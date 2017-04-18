/**
 * Created by nelso on 4/17/2017.
 */

let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let students = require('./studentMongoDAO');
var router = express.Router();

// middleware
router.use(bodyParser.json());

// REST endpoints
//Create
router.post('/', function(req, res, next){
    var data = req.body;
    if (!data) {
        res.sendStatus(400);
        return;
    }

    students.create(data, function(err, result){
        if (err) res.sendStatus(500);

        res.status(201).json(result.ops[0].id);
    })

    // fs.readdir(`${__dirname}/students`, function(err, files) {
    //     if (err) {
    //         res.sendStatus(500);
    //         return;
    //     };
    //
    //     var fileList = files.map(fileName => fileName.replace('.json', ''));
    //
    //     var id = pad(parseInt(fileList[fileList.length - 1]) + 1);
    //     data.id = id;
    //
    //     fs.writeFile(`${__dirname}/students/${id}.json`, JSON.stringify(data, null, 2), 'utf8', function(err) {
    //         if (err) {
    //             res.sendStatus(500);
    //             return;
    //         };
    //
    //         res.status(201).json(id); // send status 200 and fileList
    //     });
    // });
});
//List
router.get('/students.json', function(req, res, next){
    students.list(function(err, result) {
        res.json(result);
    });
});
//Read
router.get('/:id.json', function(req, res, next){
    let id = req.params.id;
    students.read(id, function(err, result) {
        res.set('id', req.params.id);
        res.status(200).json(result); // send status 200 and fileList

    });
});
//Update
router.put('/:id.json', function(req, res, next){
    var id = req.params.id;
    var data = req.body;
    delete data['_id'];

    students.update(id, data, function(err, result){
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else {
            res.sendStatus(204);
        }
    });
});
//Delete
router.delete('/:id.json', function(req, res, next){
    var id = req.params.id;

    students.delete(id, function(err, result){
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(204);
        }

    });
});


module.exports = router;

function pad(num) {
    var s = "0000" + num;
    return s.substr(s.length - 4);
}