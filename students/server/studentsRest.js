/**
 * Created by nelso on 4/17/2017.
 */

let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
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

    fs.readdir(`${__dirname}/students`, function(err, files) {
        if (err) {
            res.sendStatus(500);
            return;
        };

        var fileList = files.map(fileName => fileName.replace('.json', ''));

        var id = pad(parseInt(fileList[fileList.length - 1]) + 1);
        data.id = id;

        fs.writeFile(`${__dirname}/students/${id}.json`, JSON.stringify(data, null, 2), 'utf8', function(err) {
            if (err) {
                res.sendStatus(500);
                return;
            };

            res.status(201).json(id); // send status 200 and fileList
        });
    });
});
//List
router.get('/students.json', function(req, res, next){
    fs.readdir(`${__dirname}/students`, function(err, files) {
        if (err) {
            res.sendStatus(404);
        } else {
            var fileList = files.map(fileName => fileName.replace('.json', ''));
            res.json(fileList); // send status 200 and fileList
        }
    });
});
//Read
router.get('/:id.json', function(req, res, next){
    var id = req.params.id;
    fs.readFile(`${__dirname}/students/${id}.json`, 'utf8', function(err, data) {
        if (err) {
            res.sendStatus(404);
            next();
        } else {

            res.set('id', req.params.id);

            res.status(200).json(JSON.parse(data)); // send status 200 and fileList
        }

    });
});
//Update
router.put('/:id.json', function(reg, res, next){
    var id = req.params.id;
    var data = JSON.stringify(req.body, null, 2);

    logger.debug(colors.green('content-type = ' + req.get('Content-Type')));
    logger.debug(colors.green('data = ' + JSON.stringify(req.body)));

    fs.writeFile(`${__dirname}/students/${id}.json`, data, 'utf8', function(err) {
        if (err) {
            throw err;
        } else {

            res.sendStatus(204); // send status 200 and fileList
        }
    });
});
//Delete
router.delete('/:id.json', function(req, res, next){
    var id = req.params.id;
    fs.unlink(`${__dirname}/students/${id}.json`, function(err) {
        if (err) {
            throw err;
        } else {

            res.sendStatus(204); // send status 200 and fileList
        }
    });
})


module.exports = router;

function pad(num) {
    var s = "0000" + num;
    return s.substr(s.length - 4);
}