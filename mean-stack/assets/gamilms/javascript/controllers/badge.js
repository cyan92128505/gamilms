angular.module('gamilms_badge', [
    'ui.bootstrap'
]).controller('BadgeCtrl', ['$scope', '$http', '$state', '$gamiEvent', function($scope, $http, $state, $gamiEvent) {
    $gamiEvent.look_at_where('Badge', function(err, result) {
        $scope.badges = [];

        for (var i = 0; i < result.icons_path.length; i++) {
            if (!result.icons_path[i].finish) {
                result.icons_path[i].frequency = 0;
            }
            $scope.badges.push({
                path: $gamiEvent.project_name + '\/images\/achievement\/' + result.icons_path[i].information,
                name: result.icons_path[i].arch_name,
                info: (result.icons_path[i].finish ? result.icons_path[i].arch_name : '未取得'),
                css: {
                    'background': 'linear-gradient(#f9f9f9 ' + (100 - result.icons_path[i].frequency * 100) + '%, #f7cac9 ' + (100 - result.icons_path[i].frequency * 100) + '%)'
                }
            });
        }
    });
}]);
