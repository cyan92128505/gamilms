angular.module('gamilms_badge', [
    'ui.bootstrap'
]).controller('BadgeCtrl', ['$scope', '$http', '$state', '$gamiEvent', function($scope, $http, $state, $gamiEvent) {
    $gamiEvent.look_at_where('Badge', function(err, result) {
        $scope.badges = [];
        for (var i = 0; i < result.icons_path.length; i++) {
            console.log(result.icons_path[i]);
            $scope.badges.push({
                path: result.icons_path[i].information,
                name: result.icons_path[i].arch_name,
                css: {
                    'background': 'linear-gradient(#f9f9f9 ' + (100 - result.icons_path[i].frequency*100) + '%, #f7cac9 ' + (100 - result.icons_path[i].frequency*100) + '%)'
                }
            });
        }
    });
}]);
