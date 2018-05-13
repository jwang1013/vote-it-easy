angular.module("Vote-It-Easy").controller("PollsListCtrl", ["$scope", "$meteor", "$state",
    function ($scope, $meteor, $state) {
        $scope.userId = Meteor.userId();
        $scope.showMyPollsOnly = $state.current.data.showMyPollsOnly;
        if ($scope.showMyPollsOnly) {
            document.title = "My Polls | Vote-It-Easy";
        } else {
            document.title = "All Polls | Vote-It-Easy";
        }
        $scope.dataLoaded = false;
        $scope.propertyName = 'tVotes';
        $scope.reverse = true;
        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
        $scope.sortBySt = function(reverse) {

            $scope.propertyName = 'voteSt';         
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.getElementById("myTable");
            switching = true; 
            while (switching) {
                switching = false;
                rows = table.getElementsByTagName("TR");
                for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[3];
                y = rows[i + 1].getElementsByTagName("TD")[3];
                if (reverse) {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch= true;
                    break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch= true;
                    break;
                    }
                }
                }
                if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;     
                }
            }
            $scope.reverse = !$scope.reverse;
        };

        Meteor.call("getIp", function (error, result) {
            if (error || result === 0) {
                window.alert(error);
            } else {
                $scope.clientIp = result;
            }
        });

        $meteor.subscribe("polls", false).then(function (subscriptionHandle) {
            $scope.polls = $meteor.collection(Polls); 
            $scope.dataLoaded = true;
        });
}]);

