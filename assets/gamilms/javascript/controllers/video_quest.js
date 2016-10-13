angular.module('gamilms_controller')
    .controller('Video_questCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', function($scope, $uibModalInstance, $gamiEvent) {
        var data = {
            vid: $gamiEvent.MODEL_CONFIG.vid,
            answer: $gamiEvent.MODEL_CONFIG.quests.map(function(element, index, array) {
                var term_answer = element.terms.map(function(element, index, array) {
                    if (element.term_corrent === 1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                return term_answer;
            })
        };
        $scope.answer = $gamiEvent.MODEL_CONFIG.quests.map(function(element, index, array) {
            return false;
        });
        $scope.quests = $gamiEvent.MODEL_CONFIG.quests;
        $scope.survey_complete = {
            'width': '0%'
        };
        $scope.corrent = false;

        var is_survey_complete = function() {
            var sum = 0;
            data = {
                vid: $gamiEvent.MODEL_CONFIG.vid,
                answer: $scope.quests.map(function(element, index, array) {
                    var term_answer = element.terms.map(function(element, index, array) {
                        if (element.term_corrent === 1) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    return term_answer;
                })
            };
            for (var i = 0; i < $scope.answer.length; i++) {
                if ($scope.answer[i] === true) {
                    sum++;
                }
                if ((i + 1) === $scope.answer.length) {
                    $scope.survey_complete = {
                        'width': ((sum / $scope.answer.length) * 100) + '%'
                    }
                    if (sum === $scope.answer.length) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        };

        $scope.choice = function(quest_index, term_index) {
            $scope.answer[quest_index] = true;
            for (var i = 0; i < $scope.quests[quest_index].terms.length; i++) {
                if (i === term_index) {
                    $scope.quests[quest_index].terms[i].term_css = {
                        'color': '#5c7dba'
                    };
                    $scope.quests[quest_index].terms[i].term_corrent = 1;
                } else {
                    $scope.quests[quest_index].terms[i].term_css = {
                        'color': '#bdbdbd'
                    };
                    $scope.quests[quest_index].terms[i].term_corrent = 0;
                }
            }
            is_survey_complete();
        };

        $scope.close = function() {
            $uibModalInstance.close();
        };
        $scope.send_answer = function() {
            if (is_survey_complete()) {
                $uibModalInstance.close();
                $gamiEvent.gamipost({
                    url: '/store_survey/' + $gamiEvent.MODEL_CONFIG.vid,
                    data: data
                }, function(err, result) {
                    if (result.data.finish) {
                        $gamiEvent.CHALLENGE_INFO = {
                            challenge_title: '恭喜你',
                            challenge_content: '完成第一堂課程',
                            challenge_img: $gamiEvent.project_name + '/images/Challenge.png'
                        };
                        $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/challenge.html';
                        $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                    } else {
                        $gamiEvent.CHALLENGE_INFO = {
                            challenge_title: '喔！ 錯了',
                            challenge_content: '再看一次影片吧',
                            challenge_img: $gamiEvent.project_name + '/images/walk.gif'
                        };
                        $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/challenge.html';
                        $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                    }
                });
            } else {
                $gamiEvent.createSnackbar('問題還沒答完喔');
            }

        };
        // $gamiEvent.$gamiEvent('/commission/'+$gamiEvent.USER_DATA.uid+'/'+video_id,function(){
        //
        // });
    }]);
