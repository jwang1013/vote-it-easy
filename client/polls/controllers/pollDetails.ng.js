var shareitDep = new Tracker.Dependency();

Template.shareitEnh.shareData = function () {
    shareitDep.depend();
    return {title: document.title};
};

var htmlEntitiesEscapeMap = {
    '&': '&amp;',
    '&amp;': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
};
var escapeHtmlEntites = function (input) {
    return input.replace(/[&<>]/g, function (char) {
        return htmlEntitiesEscapeMap[char] || char;
    });
};

angular.module("Vote-It-Easy")

    .controller("PollDetailsCtrl", ["$scope", "$stateParams", "$meteor", "$state",

        function ($scope, $stateParams, $meteor, $state) {

            $scope.statePollId = $stateParams.pollId;
            $scope.dataLoaded = false;
            var poll = undefined;
            $meteor.subscribe("polls", $stateParams.pollId).then(function (subscribeHandle) {
                poll = $meteor.object(Polls, $stateParams.pollId);

                if (poll._id) {
                    $scope.dataLoaded = true;
                    document.title =  poll.title + " | Vote-It-Easy";
                    shareitDep.changed();
                    $scope.pollTitle = escapeHtmlEntites(poll.title);
                    $scope.chartLabels = Object.keys(poll.results).map(escapeHtmlEntites);
                    $scope.chartData = [];
                    $scope.isPollOwner = (poll.owner === Meteor.userId());
                    $scope.userId = Meteor.userId();
                    for (var i = 0; i < $scope.chartLabels.length; i++) {
                        $scope.chartData.push(poll.results[$scope.chartLabels[i]]);
                    }
                } else {
                    window.alert("Wrong PollId provided.");
                    $state.go("pollsList");
                }
            });

            $scope.submitVote = function () {
                var votefor = "";
                if ($scope.votefor && $scope.votefor !== "===custom-option") {
                    votefor = $scope.votefor;
                } else if ($scope.votefor === "===custom-option" && $scope.voteforCustom) {
                    votefor = $scope.voteforCustom;
                }

                if (votefor) {
                    Meteor.call("voteFor", poll._id, votefor,function (error, result) {
                        if (error || result === 0) {
                            window.alert(error);
                        } else {
                            window.alert("You've voted for: " + votefor + ".");
                            $state.go($state.current, {}, {reload: true});
                        }
                    });
                } else {
                    window.alert("You must choose which option to vote for.");
                }
            };

            $scope.removePoll = function () {
                if (window.confirm("Are you sure to remove this poll?")) {
                    Meteor.call("removePoll", poll._id, function (error, result) {
                        if (error) {
                            window.alert(error);
                            $state.go($state.current, {}, {reload: true});
                        } else {
                            window.alert("Successfully removed the poll.");
                            $state.go("pollsList", {}, {reload: true});
                        }
                    });
                }
            };

    }]);
