angular.module("Vote-It-Easy").controller("NewPollCtrl", ["$scope", "$meteor", "$state", 
    function ($scope, $meteor, $state) {
        $scope.newPollTitle = "";
        $scope.newPollOptions = [];
        document.title = "Make a new poll | Vote-It-Easy";
        $scope.addNewPoll = function () {
            if ($scope.newPollTitle !== "" && $scope.newPollOptions.length >= 2) {
                Meteor.call("addNewPoll", $scope.newPollTitle, $scope.newPollOptions, function (error, result) {
                    if (error) {
                        window.alert("Something went wrong!" + error);
                    } else {
                        $scope.newPollTitle = "";
                        $scope.newPollOptions = [];
                        $state.go("pollDetails", {pollId: result}, {reload: true});
                        $scope.$apply();
                    }
                });
            } else {
                if ($scope.newPollTitle === "") {
                    window.alert("Your poll needs a title!");
                }
                if ($scope.newPollOptions.length < 2) {
                    window.alert("You need 2 or more options to make a poll!");
                }
            }
        };
}]);