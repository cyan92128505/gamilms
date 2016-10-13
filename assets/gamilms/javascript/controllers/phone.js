angular.module('gamilms_controller')
    .controller('PhoneCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', function($scope, $uibModalInstance, $gamiEvent) {
        $scope.url = $gamiEvent.project_name + '/app_' + $gamiEvent.LOOK_AT + '/index.html' + '?timeraw=' + (new Date()).getTime();
        $gamiEvent.gamer('/check_apk_state', function(err, _result) {
            if (_result) {
                $scope.apk = $gamiEvent.project_name + '/apk/' + $gamiEvent.LOOK_AT + '.apk';
            } else {
                $scope.apk = $gamiEvent.project_name + '/apk/0.apk';
            }
        });
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    }]);
