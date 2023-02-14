angular.module('gamilms_controller')
    // .directive("drawLogo", function() {
    //     return {
    //         restrict: "A",
    //         link: function(scope, element) {
    //             gamilms_logo(element[0]);
    //         }
    //     };
    // })
    .controller('LogoCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', function($scope, $uibModalInstance, $gamiEvent) {
        $scope.project_name = $gamiEvent.project_name.replace('/','');
        $scope.ok = function() {
            $uibModalInstance.close({state: 'ok'});
            $gamiEvent.ONBOARDING_QUEUE = [];
        };
        $scope.close = function() {
            $uibModalInstance.close({state: 'close'});
            $gamiEvent.ONBOARDING_QUEUE = [];
        };
    }]);
