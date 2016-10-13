angular.module('gamilms_subject', [
    'ui.bootstrap'
]).controller('SubjectCtrl', function($scope, $http, $state, $gamiEvent) {
    $gamiEvent.look_at_where('Subject', function(_err, _result_user_data) {});
    $scope.grid_class = true;
    $scope.isactive = true;

    $scope.formturn = function(_command) {
        if (_command === 'grid') {
            $scope.grid_class = true;
            $scope.isactive = true;
        } else {
            $scope.grid_class = false;
            $scope.isactive = false;
        }
    };

    $scope.subjects = [{
        provider: 'video',
        vid: -1,
        quest_name: 'loading',
        information: 'loading information',
        content: 'loading content',
        icon: '',
        active: Date(),
        quest_level: 1,
        give_point: 1
    }];

    $scope.link = function(page_type, vid) {
        console.log(page_type + " " + vid);
        $state.go(page_type, {
            vid: vid
        });
    };

    $http.get('/get_video').then(function(response) {
        var videos = response.data;
        $scope.subjects = videos.map(function(video, index) {
            var temp = {
                index: video.vid,
                provider: video.provider,
                vid: video.vid,
                title: video.title,
                information: video.information,
                content: video.content,
                icon: 'https://i.ytimg.com/vi/' + video.content + '/default.jpg',
                score: video.score,
                active: video.active,
                finish: video.finish,
                finish_css: 'width: ' + video.score + '%;',
                quest_level: video.quest_level,
                give_point: video.give_point
            };
            return temp;
        });
    });
});
