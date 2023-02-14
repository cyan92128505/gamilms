angular.module('gamilms_video', [
    'ui.bootstrap',
    'youtube-embed'
]).controller('VideoCtrl', [
    '$scope',
    '$http',
    '$stateParams',
    '$gamiEvent',
    'youtubeEmbedUtils',
    function($scope, $http, $stateParams, $gamiEvent, youtubeEmbedUtils) {
        $gamiEvent.look_at_where('video_' + $stateParams.vid, function(_err, _result_user_data) {
            var video_detail = _result_user_data.video;
            $scope.web_state_list = _result_user_data.web_state_list;
            $scope.video_title = video_detail.title;
            $scope.video_information = video_detail.information;
            $scope.SubjectVideo = video_detail.url;
            $scope.video_time = video_detail.video_length;
            // have a video id

            $scope.open_modal = function() {
                $gamiEvent.MODEL_CONFIG.templateUrl = '/template/video_quest.html';
                $gamiEvent.MODEL_CONFIG.controller = 'Video_questCtrl';
                $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
            };
            $scope.ok = function() {
                console.log('ok');
            };

            $scope.$on('youtube.player.ended', function($event, player) {
                // play it again
                $gamiEvent.gamipost({
                    url: '/video_ended',
                    data: {
                        vid: video_detail.vid
                    }
                }, function(result) {});
                $scope.open_modal();
            });
        });
    }
]);
