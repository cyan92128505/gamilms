angular.module('gamilms_controller', [])
    .controller('ChallengeCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', function($scope, $uibModalInstance, $gamiEvent) {
        $scope.challenge_title = $gamiEvent.CHALLENGE_INFO.challenge_title;
        $scope.challenge_content = $gamiEvent.CHALLENGE_INFO.challenge_content;
        $scope.challenge_img = $gamiEvent.CHALLENGE_INFO.challenge_img;
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    }]);
