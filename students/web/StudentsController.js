let url = 'http://localhost/api/v1/students';

let app = angular.module('app', ['ngSanitize', 'ui.materialize']);
app.factory('studentService', function($http) {
    return {
        getStudents: function () {
            return $http.get(url + '/students.json');
        },
        getStudent: function (studentID) {
            return $http.get(`${url}/${studentID}.json`)
        },
        deleteStudent: function (studentID) {
            return $http.delete(`${url}/${studentID}.json`)
        },
        restoreStudent: function(student) {
            return $http.put(`${url}/${student.id}.json`, angular.toJson(student));
        },
        addStudent: function(student) {
            return $http.post(`${url}`, angular.toJson(student));
        },
        updateStudent: function(student) {
            return $http.put(`${url}/${student.id}.json`, angular.toJson(student))
        }
    };
});
app.controller('StudentsController', ['$scope', 'studentService',
function($scope, studentService){
    $scope.loadingModalOpen = true;
    dataLoaded = false;
    $scope.students = [];
    $scope.deletedStudents = [];
    $scope.reverseSort = false;
    $scope.propertyName = 'name';
    $scope.showTiles = false;

    studentService.getStudents().then(function(res) {
        //$scope.students = res.data;
        let studentIds = res.data;
        console.log("ids = ");
        console.log(studentIds);
        let count = 0;
        for (let studentId of studentIds){
            count++;
            studentService.getStudent(studentId).then(function(res){
                $scope.students.push(res.data);
                console.log(res.data);
                count--;
                if (count <= 0) {
                    dataLoaded = true;
                }
            });
        };
    })

    $scope.loadingModalReady = function() {
        if (dataLoaded) {
            //$scope.loadingModalOpen = false;
        }
        console.log("loading modal ready");
    }


    $scope.yearNumToText = function (year) {

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
    };

    $scope.sortBy = function(propertyName) {
        // name column flips between sorting by first name and last name
        if (propertyName === 'name') {
            if ($scope.propertyName === 'fname' && $scope.reverseSort === false){
                $scope.reverseSort = true;
            } else if ($scope.propertyName === 'fname' && $scope.reverseSort === true) {
                $scope.propertyName = 'lname';
                $scope.reverseSort = false;
            } else if ($scope.propertyName === 'lname' && $scope.reverseSort === false) {
                $scope.reverseSort = true;
            } else {
                $scope.propertyName = 'fname';
                $scope.reverseSort = false;
            }
        } else {
            $scope.reverseSort = ($scope.propertyName === propertyName) ? !$scope.reverseSort : false;
            $scope.propertyName = propertyName;
        }
    };

    $scope.deleteStudent = function (studentID) {
        console.log(`Deleting student  ${studentID}`);
        for (var i = 0; i < $scope.students.length; i++) {
            if ($scope.students[i] && $scope.students[i].id == studentID) {
                // kluge way to do a deep copy
                $scope.deletedStudents.push(JSON.parse(JSON.stringify($scope.students[i])));

                $scope.students.splice(i,1);
                //delete $scope.students[i];

                studentService.deleteStudent(studentID);

                break;
            }
        }
    }

    $scope.editStudent = function (student) {
        studentService.updateStudent(student);
    }

    $scope.addStudent = function(student) {
        console.log("adding Student");
        studentService.addStudent(student).then(function(res){
            studentService.getStudent(res.data).then(function(res){
                $scope.students.push(res.data);
            })
        });

    }

    $scope.restoreStudent = function() {
        if ($scope.deletedStudents.length > 0) {
            let student = $scope.deletedStudents.pop();
            delete student.$$hashKey;
            studentService.restoreStudent(student);
            $scope.students.push(student);
        }
    }

    $scope.viewTable = function(){
        $scope.showTiles = false;
    }

    $scope.viewTiles = function(){
        $scope.showTiles = true;
    }
}]);
app.directive('ngStudent', function() {
    return {
        template: '{{student.fname}} {{student.lname}}'
    };
});
