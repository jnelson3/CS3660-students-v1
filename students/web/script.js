/*global $*/
/*global compareStrings*/
/*global compareDate*/
/*global compareNumbers*/
/*global _*/

function yearNumToText(year) {

    if (year === parseInt(year, 10)) {
        switch (year) {
            case -3:
            case -2:
            case -1:
            case 0:
                return 'High School';
            case 1:
                return 'Freshman';
            case 2:
                return 'Sophmore';
            case 3:
                return 'Junior';
            case 4:
                return 'Senior';
        }
        if (year >= 5) {
            return 'Super Senior';
        }
    }
    return 'invalid year';
}
let students = [];
let studentIds;
let pageCount = 10;
let currentPage = 0;
let deletedStudents = [];
let cookieName = 'lastView';
let modalDelay = 1000;
let jQurl = 'http://localhost/api/v1/students';

// function renderTable() {
//     let studentRows = [];
//     for (let student of students) {
//         if (student) {
//             studentRows.push(`
//                     <tr id="${student.id}">
//                     <td>${student.fname} ${student.lname}</td>
//                     <td>${student.startDate}</td>
//                     <td>${student.street}</td>
//                     <td>${student.city}</td>
//                     <td>${student.state}</td>
//                     <td>${student.zip}</td>
//                     <td>${student.phone}</td>
//                     <td>${yearNumToText(student.year)}</td>
//                     <td>
//                         <a href='#' data-toggle='tooltip' title='Delete'>
//                             <span class="glyphicon glyphicon-trash delete-button" aria-hidden="true" data-student-id="${student.id}"></span>
//                         </a>
//
//                         <a href='#' data-toggle='tooltip' title='Edit'>
//                             <span class="glyphicon glyphicon-pencil edit-button" aria-hidden="true" data-student-id="${student.id}"></span>
//                         </a>
//                     </td>
//                     </tr>
//                 `);
//         }
//     }
//     $('#studentTableRows').html(studentRows.join(' '));
//
//     $('.edit-button').click(function() {
//         $('#editModalTitle').html('Edit Student')
//         showEditModal($(this).attr('data-student-id'));
//     });
//     $('.delete-button').click(function() {
//         console.log('delete button pressed ' + $(this).attr('data-student-id'));
//         handleDelete($(this).attr('data-student-id'));
//     });
// }

function renderTiles() {
    let studentTiles = [];
    for (let student of students) {
        if (student) {
            studentTiles.push(`
                    <div class='panel panel-default col-xxs-12 col-xs-6 col-sm-4 col-lg-2'>
                        <div class='panel-heading'>
                            <h3 class='panel-title'>${student.fname} ${student.lname}</h3>
                        </div>
                        <div class='panel-body'>
                            <b>Address</b><br>
                            ${student.street}<br>
                            ${student.city} ${student.state} ${student.zip}<br>
                            <b>Phone</b> ${student.phone}<br>
                            <b>Year </b>${yearNumToText(student.year)}<br>
                            <b>Start Date</b> ${student.startDate}
                        </div>
                    </div>
                `);
        }
    }
    $('#studentGridTiles').html(studentTiles.join(' '));
}



function buildPage() {
    //console.log('students = ' + students);
    //$.getJSON('students.json', function(studentsJsonDoc) {
    //    students = studentsJsonDoc;
    //renderTable();
    renderTiles();

    $('#nextPageButton').unbind('click');
    $('#nextPageButton').click(function() {
        loadPage(currentPage + 1);
    })

    $('#previousPageButton').unbind('click');
    $('#previousPageButton').click(function() {
        loadPage(currentPage - 1);
    })

    switch (getCookie(cookieName)) {
        case '':
            $('#studentGridTiles').hide();
            break;
        case 'table':
            $('#studentGridTiles').hide();
            $('#tableViewButtonCheckbox').removeClass('glyphicon-unchecked');
            $('#tableViewButtonCheckbox').addClass('glyphicon-check');
            $('#tileViewButtonCheckbox').removeClass('glyphicon-check');
            $('#tileViewButtonCheckbox').addClass('glyphicon-unchecked');
            break;
        case 'tiles':
            $('#studentTable').hide();
            $('#tileViewButtonCheckbox').removeClass('glyphicon-unchecked');
            $('#tileViewButtonCheckbox').addClass('glyphicon-check');
            $('#tableViewButtonCheckbox').removeClass('glyphicon-check');
            $('#tableViewButtonCheckbox').addClass('glyphicon-unchecked');
            break;
    }

    $('.sortButton').removeClass('active');
    $('#fnameAscendSortButton').addClass('active');


    $('#tableViewButton').unbind('click');
    $('#tableViewButton').click(function() {
        setCookie(cookieName, 'table');
        //renderTable();
        $('#studentTable').show();
        $('#studentGridTiles').hide();
        $('#tableViewButtonCheckbox').removeClass('glyphicon-unchecked');
        $('#tableViewButtonCheckbox').addClass('glyphicon-check');
        $('#tileViewButtonCheckbox').removeClass('glyphicon-check');
        $('#tileViewButtonCheckbox').addClass('glyphicon-unchecked');
    });

    $('#tileViewButton').unbind('click');
    $('#tileViewButton').click(function() {
        setCookie(cookieName, 'tiles');
        renderTiles();
        $('#studentGridTiles').show();
        $('#studentTable').hide();
        $('#tileViewButtonCheckbox').removeClass('glyphicon-unchecked');
        $('#tileViewButtonCheckbox').addClass('glyphicon-check');
        $('#tableViewButtonCheckbox').removeClass('glyphicon-check');
        $('#tableViewButtonCheckbox').addClass('glyphicon-unchecked');
    });

    //Add Student button
    $('#addStudentButton').unbind('click');
    $('#addStudentButton').click(function() {
        $('#editModalTitle').html('Add Student');
        showEditModal();
    });

    //Restore Student Button
    $('#restoreStudentButton').unbind('click');
    $('#restoreStudentButton').click(function() {
        if (deletedStudents.length > 0) {
            console.log('restoring student');
            let student = deletedStudents.pop();
            delete student.id;
            $.when($.ajax({
                method: "POST",
                url: jQurl,
                contentType: 'application/json',
                data: JSON.stringify(student)
            })).done(function(data, statusText, jqXHR) {
                student.id = data;
                students.push(student);
                //renderTable();
                renderTiles();
            });

        }
        else {
            console.log('deleted students empty');
        }
    });

    //Table Sort Functions
    let sortedAs = 'fnameAscending'; //stores the current sorted column and direction

    $('#fnameHeading').unbind('click');
    $('#fnameHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');

        students = _.sortBy(students, 'fname');
        students = _.sortBy(students, 'lname');

        if (sortedAs == 'fnameAscending') {
            $('#fnameDescendSortButton').addClass('active');
            students.reverse();
            sortedAs = 'fnameDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#fnameAscendSortButton').addClass('active');
            sortedAs = 'fnameAscending';
            setCookie('sort', sortedAs);
        }
        //renderTable();
        $('#sortingModal').modal('hide');
    });

    $('#lnameHeading').unbind('click');
    $('#lnameHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');
        students.sort(function(studentA, studentB) {
            if (studentA.lname == studentB.lname) {
                return compareStrings(studentA.fname, studentB.fname);
            }
            else {
                return compareStrings(studentA.lname, studentB.lname);
            }
        });
        if (sortedAs == 'lnameAscending') {
            $('#lnameDescendSortButton').addClass('active');
            students.reverse();
            sortedAs = 'lnameDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#lnameAscendSortButton').addClass('active');
            sortedAs = 'lnameAscending';
            setCookie('sort', sortedAs);
        }

        //renderTable();
        $('#sortingModal').modal('hide');
    });

    $('#dateHeading').unbind('click');
    $('#dateHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');

        if (sortedAs == 'dateAscending') {
            $('#dateDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareDate(studentA.startDate, studentB.startDate);
            });
            students.reverse();
            sortedAs = 'dateDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#dateAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareDate(studentA.startDate, studentB.startDate);
            });
            sortedAs = 'dateAscending';
            setCookie('sort', sortedAs);
        }
        //renderTable();
        $('#sortingModal').modal('hide');
    });

    $('#addressHeading').unbind('click');
    $('#addressHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');

        if (sortedAs == 'addressAscending') {
            $('#addressDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.street, studentB.street);
            });
            students.reverse();
            sortedAs = 'addressDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#addressAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.street, studentB.street);
            });
            sortedAs = 'addressAscending';
            setCookie('sort', sortedAs);
        }
        //renderTable();
        $('#sortingModal').modal('hide');
    });

    $('#cityHeading').unbind('click');
    $('#cityHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');

        if (sortedAs == 'cityAscending') {
            $('#cityDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.city, studentB.city);
            });
            students.reverse();
            sortedAs = 'cityDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#cityAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.city, studentB.city);
            });
            sortedAs = 'cityAscending';
            setCookie('sort', sortedAs);
        }
        //renderTable();
        $('#sortingModal').modal('hide');
    });

    $('#stateHeading').unbind('click');
    $('#stateHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');

        if (sortedAs == 'stateAscending') {
            $('#stateDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.state, studentB.state);
            });
            students.reverse();
            sortedAs = 'stateDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#stateAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.state, studentB.state);
            });
            sortedAs = 'stateAscending';
            setCookie('sort', sortedAs);
        }
        //renderTable();
        $('#sortingModal').modal('hide');
    });

    $('#zipHeading').unbind('click');
    $('#zipHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');

        if (sortedAs == 'zipAscending') {
            $('#zipDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareNumbers(studentA.zip, studentB.zip);
            });
            students.reverse();
            sortedAs = 'zipDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#zipAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareNumbers(studentA.zip, studentB.zip);
            });
            sortedAs = 'zipAscending';
            setCookie('sort', sortedAs);
        }
        //renderTable();
        $('#sortingModal').modal('hide');
    });

    $('#phoneHeading').unbind('click');
    $('#phoneHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');

        if (sortedAs == 'phoneAscending') {
            $('#phoneDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.phone, studentB.phone);
            });
            students.reverse();
            sortedAs = 'phoneDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#phoneAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.phone, studentB.phone);
            });
            sortedAs = 'phoneAscending';
            setCookie('sort', sortedAs);
        }
        //renderTable();
        $('#sortingModal').modal('hide');
    });

    $('#yearHeading').unbind('click');
    $('#yearHeading').click(function() {
        $('#sortingModal').modal('show');

        $('.sortButton').removeClass('active');

        if (sortedAs == 'yearAscending') {
            $('#yearDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareNumbers(studentA.year, studentB.year);
            });
            students.reverse();
            sortedAs = 'yearDescending';
            setCookie('sort', sortedAs);
        }
        else {
            $('#yearAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareNumbers(studentA.year, studentB.year);
            });
            sortedAs = 'yearAscending';
            setCookie('sort', sortedAs);
        }
        //renderTable();
        $('#sortingModal').modal('hide');
    });

    console.log(getCookie('sort'));

    $('.sortButton').removeClass('active');

    switch (getCookie('sort')) {
        case 'fnameAcscending':
            students = _.sortBy(students, 'fname');
            students = _.sortBy(students, 'lname');

            $('#fnameAscendSortButton').addClass('active');
            sortedAs = 'fnameAscending';

            //renderTable();
            break;
        case 'fnameDescending':
            students = _.sortBy(students, 'fname');
            students = _.sortBy(students, 'lname');

            $('#fnameDescendSortButton').addClass('active');
            students.reverse();
            sortedAs = 'fnameDescending';

            //renderTable();
            break;
        case 'dateAscending':
            $('#dateAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareDate(studentA.startDate, studentB.startDate);
            });
            sortedAs = 'dateAscending';

            //renderTable();
            break;
        case 'dateDescending':
            $('#dateDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareDate(studentA.startDate, studentB.startDate);
            });
            sortedAs = 'dateDescending';


            //renderTable();
            break;
        case 'addressAscending':
            $('#addressAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.street, studentB.street);
            });
            sortedAs = 'addressAscending';

            //renderTable();
            break;
        case 'addressDescending':
            $('#addressDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.street, studentB.street);
            });
            students.reverse();
            sortedAs = 'addressDescending';

            //renderTable();
            break;
        case 'cityAscending':
            $('#cityAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.city, studentB.city);
            });
            sortedAs = 'cityAscending';

            //renderTable();
            break;
        case 'cityDescending':
            $('#cityDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.city, studentB.city);
            });
            students.reverse();
            sortedAs = 'cityDescending';

            //renderTable();
            break;
        case 'stateAscending':
            $('#stateAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.state, studentB.state);
            });
            sortedAs = 'stateAscending';

            //renderTable();
            break;
        case 'stateDescending':
            $('#stateDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.state, studentB.state);
            });
            students.reverse();
            sortedAs = 'stateDescending';

            //renderTable();
            break;
        case 'zipAscending':
            $('#zipAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareNumbers(studentA.zip, studentB.zip);
            });
            sortedAs = 'zipAscending';

            //renderTable();
            break;
        case 'zipDescending':
            $('#zipDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareNumbers(studentA.zip, studentB.zip);
            });
            students.reverse();
            sortedAs = 'zipDescending';

            //renderTable();
            break;
        case 'phoneAscending':
            $('#phoneAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.phone, studentB.phone);
            });
            sortedAs = 'phoneAscending';

            //renderTable();
            break;
        case 'phoneDescending':
            $('#phoneDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareStrings(studentA.phone, studentB.phone);
            });
            students.reverse();
            sortedAs = 'phoneDescending';

            //renderTable();
            break;
        case 'yearAscending':
            $('#yearAscendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareNumbers(studentA.year, studentB.year);
            });
            sortedAs = 'yearAscending';

            //renderTable();
            break;
        case 'yearDescending':
            $('#yearDescendSortButton').addClass('active');
            students.sort(function(studentA, studentB) {
                return compareNumbers(studentA.year, studentB.year);
            });
            students.reverse();
            sortedAs = 'yearDescending';

            //renderTable();
            break;
        default:
            students = _.sortBy(students, 'fname');
            students = _.sortBy(students, 'lname');

            $('#fnameAscendSortButton').addClass('active');
            sortedAs = 'fnameAscending';

            //renderTable();
            break;
    }


}

function showEditModal(id) {
    console.log('id = ' + id);
    if (id) {
        for (var i = 0; i < students.length; i++) {
            console.log("i = " + i);
            //console.log('student = ' + students[i].fname)
            if (students[i].id == id) {
                $('#editModalFName').attr('value', students[i].fname);
                $('#editModalLName').attr('value', students[i].lname);
                $('#editModalStartDate').attr('value', students[i].startDate);
                $('#editModalAddres').attr('value', students[i].street);
                $('#editModalCity').attr('value', students[i].city);
                $('#editModalState').attr('value', students[i].state);
                $('#editModalZip').attr('value', students[i].zip);
                $('#editModalPhone').attr('value', students[i].phone);
                $('#editModalYear').attr('value', students[i].year);
            }
        }
    }
    else {
        $('#editModalFName').attr('value', '');
        $('#editModalLName').attr('value', '');
        $('#editModalStartDate').attr('value', '');
        $('#editModalAddres').attr('value', '');
        $('#editModalCity').attr('value', '');
        $('#editModalState').attr('value', '');
        $('#editModalZip').attr('value', '');
        $('#editModalPhone').attr('value', '');
        $('#editModalYear').attr('value', '');
    }
    $('#editModal').modal('show');
    $('#editModalSubmit').unbind('click');
    $('#editModalSubmit').click(function() {
        handleEdit(id);
    });
}

function handleEdit(id) {
    let student = {
        fname: $('#editModalFName').val(),
        lname: $('#editModalLName').val(),
        startDate: $('#editModalStartDate').val(),
        street: $('#editModalAddres').val(),
        city: $('#editModalCity').val(),
        state: $('#editModalState').val(),
        zip: $('#editModalZip').val(),
        phone: $('#editModalPhone').val(),
        year: $('#editModalYear').val(),
    };

    if (id) {
        $.when($.ajax({
            method: "PUT",
            url: `${jQurl}/${id}.json`,
            contentType: 'application/json',
            data: JSON.stringify(student)
        })).done(function(data, statusText, jqXHR) {

        });
    }
    else {
        $.when($.ajax({
            method: "POST",
            url: jQurl,
            contentType: 'application/json',
            data: JSON.stringify(student)
        })).done(function(data, statusText, jqXHR) {
            studentIds.push(data);
        });
    }

    $('#editModal').modal('hide');
    //renderTable();
    renderTiles();
}

function handleDelete(id) {
    console.log(`Deleting student  ${id}`);
    for (var i = 0; i < students.length; i++) {
        if (students[i] && students[i].id == id) {
            // kluge way to do a deep copy
            deletedStudents.push(JSON.parse(JSON.stringify(students[i])));
            delete students[i];

            $.when($.ajax({
                method: "DELETE",
                url: `${jQurl}/${id}.json`
            })).done(function(data, statusText, jqXHR) {

            });

            studentIds.splice(studentIds.indexOf(id), 1);

            break;
        }
    }
    //renderTable();
    renderTiles();
}

$(function() {
    loadStudents();
});

function loadStudentIds() {
    $.when($.ajax(jQurl + '/students.json')).done(function(data, statusText, jqXHR) {
        studentIds = data;
    });
}

function loadStudents() {
    let studentMax = 10;

    $('#loadingModal').modal('show');
    $.when($.ajax(jQurl + '/students.json')).done(function(data, statusText, jqXHR) {
        studentIds = data;
        loadPage(0);
    });
}

function loadPage(page) {

    if (page < 0) {
        currentPage = 0;
    }
    else {
        currentPage = page;
    }

    console.log('loading page' + currentPage);

    let studentCount = 0;
    let count;
    let offset = currentPage * pageCount;

    if (offset > studentIds.length) {
        currentPage = Math.trunc(studentIds.length / pageCount);
        return;
    }

    if (studentIds.length - offset > pageCount) {
        count = pageCount;
    }
    else {
        count = studentIds.length - offset;
    }

    students = [];

    for (var i = 0; i < count; i++) {
        $.when($.ajax(jQurl + '/' + studentIds[i + offset] + '.json', {context: {url: jQurl + '/' + studentIds[i + offset] + '.json'}})).done(function(data, statusText, jqXHR) {
            studentCount++;
            data.id = jqXHR.getResponseHeader('id');
            students.push(data);
            //TODO progress bar
            if (studentCount == count) {
                buildPage();
                $('#loadingModal').modal('hide');
            }
        });
    }
}

// this function borrowed from W3Schools
function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    if (exdays) {
        var expires = 'expires=' + d.toUTCString();
    }
    document.cookie = cname + '=' + cvalue + '; ' + expires;
}

function pad(num) {
    var s = "0000" + num;
    return s.substr(s.length - 4);
}

function depad(num) {

}