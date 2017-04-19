/**
 * Created by nelso on 4/17/2017.
 */

let express = require('express');
let bodyParser = require('body-parser');
let students = require('./studentPostgresDAO');
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
        else res.status(201).json(result.id);
    })
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
        res.set('id', result.id);
        res.status(200).json(result); // send status 200 and fileList

    });
});
//Update
router.put('/:id.json', function(req, res, next){
    var id = req.params.id;
    var data = req.body

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
            console.error(err);
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