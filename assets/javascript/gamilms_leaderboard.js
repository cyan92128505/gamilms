angular.module('gamilms_leaderboard', [
    'ui.bootstrap'
]).controller('LeaderboardCtrl', ['$scope', '$http', '$state', '$gamiEvent', function($scope, $http, $state, $gamiEvent) {
    $gamiEvent.look_at_where('Leaderboard', function(_err, _result_user_data) {
        var datas = [];
        datas = _result_user_data.leaderboard;
        datas.sort(function(a, b) {
            return b.engage_point - a.engage_point;
        });
        var users = datas.map(function(data, index) {
            var temp = {
                index: "#" + (index + 1),
                uid: data.user_id,
                img: "http://graph.facebook.com/" + data.user_id + "/picture?type=large&width=48&height=48",
                user_name: data.user_name,
                engage_point: data.engage_point
            };
            return temp;
        });
        $scope.users = users;
        $scope.getProfile = function(uid) {
            $state.go('profile', {
                uid: uid
            });
        };
    });
}]);
