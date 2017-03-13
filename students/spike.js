
console.log('nums');
var nums = [6, 34, 126, 231, 3345, 76231];

for (num of nums) {
    console.log(padSlice(num));
}




function padSubstr(num) {
var s = "0000" + num;
return s.substr(s.length - 4);
}

function padSlice(num) {
var s = "0000" + num;
return s.slice(-4);
}