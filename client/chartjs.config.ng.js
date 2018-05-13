angular.module("Vote-It-Easy")
    .config(["ChartJsProvider", function (ChartJsProvider) {
        
        ChartJsProvider.setOptions({
            responsive: true,
            animationEasing: "easeOutQuart",
            animationSteps: 40
        });
        
}]);