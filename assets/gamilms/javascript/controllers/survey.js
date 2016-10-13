angular.module('gamilms_controller')
    .controller('SurveyCtrl', ['$scope', '$location', '$anchorScroll', '$uibModalInstance', '$gamiEvent', function($scope, $location, $anchorScroll, $uibModalInstance, $gamiEvent) {
        var survey_data = $gamiEvent.SURVEY_DATA;
        $scope.user_name = $gamiEvent.MODEL_CONFIG.user_name;
        $scope.answer = [true];
        $scope.answer_state = [];
        $scope.answer_css_state = [];
        for (var i = 0; i < survey_data.length; i++) {
            $scope.answer_state.push([]);
            $scope.answer_css_state.push([]);
            for (var j = 0; j < survey_data[i].parts.length; j++) {
                $scope.answer_state[i].push([]);
                $scope.answer_css_state[i].push([]);
                for (var k = 0; k < survey_data[i].parts[j].part_terms.length; k++) {
                    $scope.answer_state[i][j].push(false);
                    $scope.answer_css_state[i][j].push(false);
                }
            }
        }
        $scope.set_answer_state = function(survey, part, term) {
            $scope.answer_state[survey][part][term] = true;
            if ($scope.answer_css_state[survey][part][term]) {
                $scope.answer_css_state[survey][part][term] = false;
            }
        };
        $scope.set_answer_state_text = function(survey, part, term, text) {
            $scope.answer_state[survey][part][term] = text;
            if ($scope.answer_css_state[survey][part][term]) {
                $scope.answer_css_state[survey][part][term] = false;
            }
        };
        var check_answer_state = function() {
            var all_right = 1;
            for (var i = 0; i < survey_data.length; i++) {
                for (var j = 0; j < survey_data[i].parts.length; j++) {
                    for (var k = 0; k < survey_data[i].parts[j].part_terms.length; k++) {
                        $scope.answer_css_state[i][j][k] = !$scope.answer_state[i][j][k];
                        all_right = all_right * ((!!$scope.answer_state[i][j][k]) ? 1 : 0);
                    }
                }
            }
            return all_right;
        };
        var create_init = function() {
            $scope.init_show = true;
            $scope.survey_show = false;
            $scope.info_show = false;
            $scope.over_show = false;
            $scope.init_title = true;
            // $scope.title_name = "有意義的遊戲化架構於線上學習管理系統之研究調查問卷";
            $scope.survey_id = 1;
            $scope.old_survey_id = 0;
        };
        var create_survey = function(survey_id) {
            var create_survey_data = survey_data[survey_id];
            $scope.title_name = (survey_id + 1) + '/' + survey_data.length + ' ' + create_survey_data.survey;
            $scope.init_show = false;
            $scope.survey_show = true;
            $scope.info_show = false;
            $scope.over_show = false;
            $scope.init_title = false;
            $scope.survey = create_survey_data.parts;
        };
        var create_info = function(info) {
            $scope.init_show = false;
            $scope.survey_show = false;
            $scope.info_show = true;
            $scope.over_show = false;
            $scope.init_title = true;
            // $scope.title_name = "有意義的遊戲化架構於線上學習管理系統之研究調查問卷";
            $scope.survey_info = info;
            $scope.survey_id = 1;
            $scope.old_survey_id = 0;
        };
        var create_over = function(info) {
            $scope.init_show = false;
            $scope.survey_show = false;
            $scope.info_show = false;
            $scope.over_show = true;
            $scope.init_title = true;
            // $scope.title_name = "有意義的遊戲化架構於線上學習管理系統之研究調查問卷";
            $scope.survey_info = info;
        };
        $scope.show_data = function() {
            var answer_structure = [];
            console.log($scope.answer);
        };
        $scope.show_survey = function(survey_id) {
            $location.hash('title_name');
            $anchorScroll();
            if (survey_id === 0) {
                create_init();
            } else {
                if (survey_id === (survey_data.length + 1)) {
                    if (check_answer_state()) {
                        $gamiEvent.gamipost({
                            url: '/save_survey',
                            data: {
                                answer: $scope.answer
                            }
                        }, function(err, result) {
                            create_over('量表已全數填寫完成，謝謝您的參與');
                        });
                    } else {
                        create_info('咦？量表未填寫完成，請檢查謝謝');
                    }
                } else {
                    $scope.old_survey_id = survey_id - 1;
                    $scope.survey_id = survey_id + 1;
                    create_survey((survey_id - 1));
                }
            }
        };
        $scope.close = function() {
            $uibModalInstance.close();
        };
        create_init();
    }]);
