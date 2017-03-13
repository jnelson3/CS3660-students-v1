function compareNumbers(a, b) {
    return a - b;
}

function compareStrings(a, b) {
    let strA = a.toLowerCase();
    let strB = b.toLowerCase();
    
    if (strA < strB) return -1;
    
    if (strA > strB) return 1;
    
    return 0;
}

function compareDate(a, b) {
    let dateA = a.split('/');
    let dateB = b.split('/');


    if (dateA[2] != dateB[2]) {
        // compare year
        return parseInt(dateA[2]) - parseInt(dateB[2]);
    }
    else if (dateA[0] != dateB[0]) {
        // compare month
        return parseInt(dateA[0]) - parseInt(dateB[0]);
    }
    else if (dateA[1] != dateB[1]) {
        // compare day
        return parseInt(dateA[1]) - parseInt(dateB[1]);
    }

    return 0;
}
