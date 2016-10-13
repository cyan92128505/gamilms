angular.module('gamilms_controller', [])
    .controller('InstanceCtrl', ['$scope', '$uibModalInstance', 'snackbar', function($scope, $uibModalInstance, snackbar) {
        $scope.share = function() {
            snackbar.create("Hello World!!");
        };
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    }]);
