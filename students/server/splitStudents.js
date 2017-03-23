var fs = require('fs');
var fileName = 'students.json';
console.log(`reading ${fileName}`);
var students = JSON.parse(fs.readFileSync(fileName, 'utf8'));
var id;

for (var i = 0; i < students.length; i++) {
    //id = students[i].id;
    //delete students[i].id;
    console.log(`writing id ${students[i].id}`);
    
    fs.writeFileSync(`./students/${students[i].id}.json`, JSON.stringify(students[i], null, 3), 'utf8');
}



function pad(num) {
    var s = "0000" + num;
    return s.substr(s.length-4);
}