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
                engage_point: data.engage_point,
                last_css: ''
            };
            if(data.user_id === gamilms_uid){
                $gamiEvent.update_badge('first_win_the_leaderboard', function() {
                });
            }
            return temp;
        });

        $scope.users = users;
        $scope.getProfile = function(uid) {
            if(gamilms_uid != uid){
                $gamiEvent.update_badge('view_other_profile', function() {
                    console.log('view_other_profile');
                });
            }
            $state.go('profile', {
                uid: uid
            });
        };
        $scope.setleaderterm = function(last_term, user_uid) {
            var last = (!!last_term) ? '100px' : '10px';
            var user = (_result_user_data.uid === user_uid) ? '0 5px 5px #f7cac9' : '0 5px 5px rgba(0, 0, 0, 0.1)';
            return {
                "margin-bottom": last,
                "box-shadow": user
            };
        }
    });
}]);
