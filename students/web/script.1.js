function yearNumToText(year) {

    if (year === parseInt(year, 10)) {
        switch (year) {
            case -3:
            case -2:
            case -1:
            case 0:
                return "High School";
            case 1:
                return "Freshman";
            case 2:
                return "Sophmore";
            case 3:
                return "Junior";
            case 4:
                return "Senior";
        }
        if (year >= 5) {
            return "Super Senior";
        }
    }
    return "invalid year";
}
let students;
let cookieName = 'lastView';
let modalDelay = 3000;

function renderTable() {
    let studentRows = [];
    for (let student of students) {
        studentRows.push(`
                    <tr>
                    <td>${student.fname} ${student.lname}</td>
                    <td>${student.startDate}</td>
                    <td>${student.street}</td>
                    <td>${student.city}</td>
                    <td>${student.state}</td>
                    <td>${student.zip}</td>
                    <td>${student.phone}</td>
                    <td>${yearNumToText(student.year)}</td>
                    </tr>
                `)
    }
    $("#studentTableRows").html(studentRows.join(' '));
}

function renderTiles() {
    let studentTiles = [];
    for (let student of students) {
        studentTiles.push(`
                    <div class="panel panel-default col-xxs-12 col-xs-6 col-sm-4 col-lg-2">
                        <div class="panel-heading">
                            <h3 class="panel-title">${student.fname} ${student.lname}</h3>
                        </div>
                        <div class="panel-body">
                            <b>Address</b><br>
                            ${student.street}<br>
                            ${student.city} ${student.state} ${student.zip}<br>
                            <b>Phone</b> ${student.phone}<br>
                            <b>Year </b>${yearNumToText(student.year)}<br>
                            <b>Start Date</b> ${student.startDate}
                        </div>
                    </div>
                `)
    }
    $("#studentGridTiles").html(studentTiles.join(' '));
}

$(function() {
    $.getJSON("students.json", function(studentsJsonDoc) {

        switch (getCookie(cookieName)) {
            case '':
                $('#studentGridTiles').hide();
                break;
            case 'table':
                $('#studentGridTiles').hide();
                $('#tableViewButtonCheckbox').removeClass("glyphicon-unchecked");
                $('#tableViewButtonCheckbox').addClass("glyphicon-check");
                $('#tileViewButtonCheckbox').removeClass("glyphicon-check");
                $('#tileViewButtonCheckbox').addClass("glyphicon-unchecked");
                break;
            case 'tiles':
                $('#studentTable').hide();
                $('#tileViewButtonCheckbox').removeClass("glyphicon-unchecked");
                $('#tileViewButtonCheckbox').addClass("glyphicon-check");
                $('#tableViewButtonCheckbox').removeClass("glyphicon-check");
                $('#tableViewButtonCheckbox').addClass("glyphicon-unchecked");
                break;
        }

        $('.sortButton').removeClass('active');
        $('#lnameAscendSortButton').addClass('active');

        $('#tableViewButton').click(function() {
            setCookie(cookieName, 'table');
            renderTable();
            $('#studentTable').show();
            $('#studentGridTiles').hide();
            $('#tableViewButtonCheckbox').removeClass("glyphicon-unchecked");
            $('#tableViewButtonCheckbox').addClass("glyphicon-check");
            $('#tileViewButtonCheckbox').removeClass("glyphicon-check");
            $('#tileViewButtonCheckbox').addClass("glyphicon-unchecked");
        });

        $('#tileViewButton').click(function() {
            setCookie(cookieName, 'tiles');
            renderTiles();
            $('#studentGridTiles').show();
            $('#studentTable').hide();
            $('#tileViewButtonCheckbox').removeClass("glyphicon-unchecked");
            $('#tileViewButtonCheckbox').addClass("glyphicon-check");
            $('#tableViewButtonCheckbox').removeClass("glyphicon-check");
            $('#tableViewButtonCheckbox').addClass("glyphicon-unchecked");
        })


        students = studentsJsonDoc;
        students.sort(function(studentA, studentB) {
            return compareStrings(studentA.lname, studentB.lname);
        });
        renderTable();
        renderTiles();

        //Table Sort Functions
        let sortedAs = "fnameAscending"; //stores the current sorted column and direction

        $('#fnameHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);
            $('.sortButton').removeClass('active');

            students = _.sortBy(students, 'fname');
            students = _.sortBy(students, 'lname');

            if (sortedAs == "fnameAscending") {
                $('#fnameDescendSortButton').addClass('active');
                students.reverse();
                sortedAs = "fnameDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#fnameAscendSortButton').addClass('active');
                sortedAs = "fnameAscending";
                setCookie('sort', sortedAs);
            }
            renderTable();
        });

        $('#lnameHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);
            $('.sortButton').removeClass('active');
            students.sort(function(studentA, studentB) {
                if (studentA.lname == studentB.lname) {
                    return compareStrings(studentA.fname, studentB.fname);
                }
                else {
                    return compareStrings(studentA.lname, studentB.lname);
                }
            });
            if (sortedAs == "lnameAscending") {
                $('#lnameDescendSortButton').addClass('active');
                students.reverse();
                sortedAs = "lnameDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#lnameAscendSortButton').addClass('active');
                sortedAs = "lnameAscending";
                setCookie('sort', sortedAs);
            }

            renderTable();
        });

        $('#dateHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);

            $('.sortButton').removeClass('active');

            if (sortedAs == "dateAscending") {
                $('#dateDescendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareDate(studentA.startDate, studentB.startDate);
                });
                students.reverse();
                sortedAs = "dateDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#dateAscendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareDate(studentA.startDate, studentB.startDate);
                });
                sortedAs = "dateAscending";
                setCookie('sort', sortedAs);
            }
            renderTable();
        });
        $('#addressHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);
            $('.sortButton').removeClass('active');

            if (sortedAs == "addressAscending") {
                $('#addressDescendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareStrings(studentA.street, studentB.street);
                });
                students.reverse();
                sortedAs = "addressDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#addressAscendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareStrings(studentA.street, studentB.street);
                });
                sortedAs = "addressAscending";
                setCookie('sort', sortedAs);
            }
            renderTable();
        });
        $('#cityHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);
            $('.sortButton').removeClass('active');

            if (sortedAs == "cityAscending") {
                $('#cityDescendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareStrings(studentA.city, studentB.city);
                });
                students.reverse();
                sortedAs = "cityDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#cityAscendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareStrings(studentA.city, studentB.city);
                });
                sortedAs = "cityAscending";
                setCookie('sort', sortedAs);
            }
            renderTable();
        });
        $('#stateHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);
            $('.sortButton').removeClass('active');

            if (sortedAs == "stateAscending") {
                $('#stateDescendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareStrings(studentA.state, studentB.state);
                });
                students.reverse();
                sortedAs = "stateDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#stateAscendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareStrings(studentA.state, studentB.state);
                });
                sortedAs = "stateAscending";
                setCookie('sort', sortedAs);
            }
            renderTable();
        });
        $('#zipHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);
            $('.sortButton').removeClass('active');

            if (sortedAs == "zipAscending") {
                $('#zipDescendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareNumbers(studentA.zip, studentB.zip);
                });
                students.reverse();
                sortedAs = "zipDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#zipAscendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareNumbers(studentA.zip, studentB.zip);
                });
                sortedAs = "zipAscending";
                setCookie('sort', sortedAs);
            }
            renderTable();
        });
        $('#phoneHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);
            $('.sortButton').removeClass('active');

            if (sortedAs == "phoneAscending") {
                $('#phoneDescendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareStrings(studentA.phone, studentB.phone);
                });
                students.reverse();
                sortedAs = "phoneDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#phoneAscendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareStrings(studentA.phone, studentB.phone);
                });
                sortedAs = "phoneAscending";
                setCookie('sort', sortedAs);
            }
            renderTable();
        });
        $('#yearHeading').click(function() {
            $('#sortingModal').modal('show');
            setTimeout(function() {
                $('#sortingModal').modal('hide');
            }, modalDelay);
            $('.sortButton').removeClass('active');

            if (sortedAs == "yearAscending") {
                $('#yearDescendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareNumbers(studentA.year, studentB.year);
                });
                students.reverse();
                sortedAs = "yearDescending";
                setCookie('sort', sortedAs);
            }
            else {
                $('#yearAscendSortButton').addClass('active');
                students.sort(function(studentA, studentB) {
                    return compareNumbers(studentA.year, studentB.year);
                });
                sortedAs = "yearAscending";
                setCookie('sort', sortedAs);
            }
            renderTable();
        });

        switch (getCookie('sort')) {
            case 'fnameDescending':
                $('#fnameHeading').click();
                break;
            case 'fnameAcscending':
                $('#fnameHeading').click();
                $('#fnameHeading').click();
                break;

        }
    });



    // this function borrowed from W3Schools
    function getCookie(cname) {
        var name = cname + "=";
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
        return "";
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        if (exdays) {
            var expires = "expires=" + d.toUTCString();
        }
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }


});