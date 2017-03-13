var fs = require('fs');
var fileName = 'students.json';
console.log(`reading ${fileName}`);
var students = JSON.parse(fs.readFileSync(fileName, 'utf8'));

for (var i = 0; i < students.length; i++) {
    console.log(`adding id ${pad(i + 1)} to ${students[i].fname} ${students[i].lname}`);
    students[i].id = pad(i + 1);
}

console.log(`writing ${fileName}`);
fs.writeFileSync(fileName, JSON.stringify(students, null, 3), 'utf8');



function pad(num) {
    var s = "0000" + num;
    return s.substr(s.length-4);
    s.slice(-4);
}