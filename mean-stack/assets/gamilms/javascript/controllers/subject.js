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

    $gamiEvent.gamer('/get_video', function(err, response) {
        console.log(response);
        var videos = response;
        var temp_subjects = [];
        for (var i = 0; i < videos.length; i++) {
            temp_subjects.push({
                index: videos[i].vid,
                provider: videos[i].provider,
                vid: videos[i].vid,
                title: videos[i].title,
                information: videos[i].information,
                content: videos[i].content,
                icon: 'https://i.ytimg.com/vi/' + videos[i].content + '/default.jpg',
                background_image: {
                    'background-image': 'url(//i.ytimg.com/vi/' + videos[i].content + '/default.jpg)'
                },
                score: videos[i].score,
                active: videos[i].active,
                finish: videos[i].finish,
                finish_css: {
                    'width': videos[i].score + '%'
                },
                quest_level: videos[i].quest_level,
                give_point: videos[i].give_point
            });
        }

        temp_subjects.sort(function(a, b) {
            var temp_a = parseInt(a.vid, 10);
            var temp_b = parseInt(b.vid, 10);
            if (temp_a > temp_b) {
                return 1;
            }
            if (temp_a < temp_b) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        $scope.subjects = temp_subjects;
    });
});
