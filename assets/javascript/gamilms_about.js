angular.module('gamilms_about', [
    'ui.bootstrap'
]).controller('AboutCtrl', ['$scope', '$http', '$state', '$gamiEvent', function($scope, $http, $state, $gamiEvent) {
    $gamiEvent.look_at_where('About', function(_err, _result_user_data) {
        $gamiEvent.USER_DATA = _result_user_data;
    });
}]);
