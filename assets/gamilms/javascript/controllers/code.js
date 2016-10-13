angular.module('gamilms_code', [
    'ui.bootstrap',
    'ui.codemirror'
]).controller('CodeCtrl', ['$rootScope', '$scope', '$http', '$state', '$gamiEvent', '$sce', '$timeout', function($rootScope, $scope, $http, $state, $gamiEvent, snackbar, $sce, $timeout) {

    $scope.totalItems = 10;
    $scope.currentPage = 4;
    $scope.trips = [];
    $scope.trip_index = 0;
    $scope.step_progress = {
        'width': '0%'
    };
    $scope.step = 0;
    $scope.md = 0;
    $scope.step_next_text = '下一步';
    $scope.test_game_on = true;


    $scope.change_step_progress = function(option) {

        var step_over = false;
        $scope.hide_step_md_ctrl_btn = false;
        if ($gamiEvent.ONBOARDING_QUEUE.length === 0) {
            if ((option === 1) && (($scope.step + 1) === $scope.steps.length) && (($scope.md + 1) === $scope.steps[$scope.step].md_array.length)) {
                $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/quest.html';
                $gamiEvent.MODEL_CONFIG.controller = 'QuestCtrl';
                $gamiEvent.MODEL_CONFIG.quest = $scope.steps[$scope.step].quest;
                $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(newChangeReturn) {
                    if (newChangeReturn.is_answer) {
                        if (newChangeReturn.current_value === 1) {
                            $scope.CreateGamiEvent({
                                challenge_title: '第' + ($scope.step + 1) + '關',
                                challenge_content: '恭喜通過挑戰',
                                challenge_img: $gamiEvent.project_name + '/images/achievement/step_' + ($scope.step + 1) + '.svg'
                            }, function(info_result) {
                                $gamiEvent.update_badge('step_' + ($scope.step + 1), function() {

                                });
                                $scope.step_progress = {
                                    'width': '100%'
                                };
                                $scope.trip_now = $scope.steps.length;
                                $scope.trip_click();
                                $scope.edit_file_name = '課程結束';
                                $scope.step_contents = "##" + $scope.code_user_name + "，恭喜你，已經通過全部的課程！\n";
                                $scope.step_md_over = true;
                                $scope.CreateGamiEvent({
                                    challenge_title: '課程結束',
                                    challenge_content: $scope.code_user_name + "，恭喜你，已經通過全部的課程！",
                                    challenge_img: $gamiEvent.project_name + '/images/achievement/finish_all_step.svg'
                                }, function(info_result) {
                                    $gamiEvent.update_badge('finish_all_step', function() {
                                        $state.go('profile', {
                                            uid: gamilms_uid
                                        });
                                    });
                                    // $scope.surevy_modal_open();
                                });
                            });
                        } else {
                            $scope.CreateGamiEvent({
                                challenge_title: '第' + ($scope.step + 1) + '關',
                                challenge_content: '答錯了，再思考看看喔',
                                challenge_img: $gamiEvent.project_name + '/images/walk.gif'
                            }, function(info_result) {
                                step_over = false;
                            });
                        }
                    }
                });
            } else {
                if (option === 1) {
                    if (($scope.md + 1) < $scope.steps[$scope.step].md_array.length) {

                        $scope.md = $scope.md + option;
                    } else {
                        step_over = true;
                        $scope.step = $scope.step + option;
                        $scope.md = 0;
                    }
                } else {
                    $gamiEvent.update_badge('first_roll_back_step', function() {});
                    if ($scope.md === 0) {
                        if ($scope.step !== 0) {
                            $scope.step = $scope.step + option;
                            $scope.md = $scope.steps[$scope.step].md_array.length - 1;
                        }
                    } else {
                        $scope.md = $scope.md + option;
                    }
                }
                if (step_over) {
                    $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/quest.html';
                    $gamiEvent.MODEL_CONFIG.controller = 'QuestCtrl';
                    $gamiEvent.MODEL_CONFIG.quest = $scope.steps[$scope.step - 1].quest;
                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(newChangeReturn) {
                        if (newChangeReturn.is_answer) {
                            if (newChangeReturn.current_value === 1) {
                                $gamiEvent.update_badge('first_good_answer', function() {});
                                $scope.CreateGamiEvent({
                                    challenge_title: '第' + $scope.step + '關',
                                    challenge_content: '恭喜通過挑戰',
                                    challenge_img: $gamiEvent.project_name + '/images/achievement/step_' + $scope.step + '.svg'
                                }, function(info_result) {
                                    $gamiEvent.update_badge('step_' + ($scope.step), function() {});
                                    $scope.step_next_text = '下一步';
                                    $scope.create_tutorial($scope.step, $scope.md);
                                });
                            } else {
                                $scope.CreateGamiEvent({
                                    challenge_title: '第' + $scope.step + '關',
                                    challenge_content: '答錯了，再思考看看喔',
                                    challenge_img: $gamiEvent.project_name + '/images/walk.gif'
                                }, function(info_result) {
                                    $gamiEvent.update_badge('first_fall_answer', function() {});
                                    step_over = false;
                                    $scope.step = $scope.step - option;
                                    $scope.md = $scope.steps[$scope.step].md_array.length - 1;
                                });
                            }
                        } else {
                            step_over = false;
                            $scope.step = $scope.step - option;
                            $scope.md = $scope.steps[$scope.step].md_array.length - 1;
                        }
                    });
                } else {
                    $scope.create_tutorial($scope.step, $scope.md);
                }
            }
        }
    };

    $scope.CreateGamiEvent = function(_log, callback) {
        $gamiEvent.CHALLENGE_INFO = _log;
        $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/challenge.html';
        $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(newChangeReturn) {
            callback(newChangeReturn);
        });
    };

    $scope.open_modal = function() {
        $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/video_quest.html';
        $gamiEvent.MODEL_CONFIG.controller = 'Video_questCtrl';
        $gamiEvent.MODEL_CONFIG.quests = result;
        $gamiEvent.MODEL_CONFIG.vid = video_detail.vid;
        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
    };
    $scope.create_tutorial = function(step, md) {
        $scope.hide_step_md_ctrl_btn = false;
        var process_bar_length = ((100 * (md)) / ($scope.steps[step].md_array.length - 1));
        if ((Number.isNaN(process_bar_length)) || (process_bar_length === 100)) {
            $scope.step_next_text = '挑戰';
        } else {
            $scope.step_next_text = '下一步';
        }
        $scope.step_md_over = false;
        $scope.step_md_show = true;
        $scope.step = step;
        $scope.md = md;
        $scope.step_progress = {
            'width': process_bar_length + '%'
        };
        $scope.trip_now = step;
        $scope.trip_click();
        $scope.edit_file_name = $scope.steps[step].step_name;
        $scope.step_contents = $scope.steps[step].md_array[md];
        http_get_file('/js/game_1_' + step + '.js', true);
        $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?point=' + $scope.step + '&uid=' + gamilms_uid + '&time=' + (~~Math.random() * 10000);
    }

    var create_trip = function() {
        if (navigator.userAgent.match('Firefox')) {
            $scope.trip_bar = {
                'width': (1 / ($scope.trip_length)) * 100 + '%'
            };
        } else {
            $scope.trip_bar = {
                'width': (0 / ($scope.trip_length - 1)) * 100 + '%'
            };
        }

        for (var i = 0; i < $scope.trip_length; i++) {
            $scope.trips.push({
                trip_index: 0,
                step_index: i,
                trip_name: 'step' + (i + 1),
                trip_css: '',
                trip_choices: $scope.steps[i].md_title,
                trip_old: (($scope.trip_now === i && $scope.trip_now > i) ? true : false)
            });
        }
    };

    $scope.trip_click = function() {
        if (navigator.userAgent.match('Firefox')) {
            $scope.trip_bar = {
                'width': ($scope.trip_now + 1) / ($scope.trip_length) * 100 + '%'
            };
        } else {
            $scope.trip_bar = {
                'width': ($scope.trip_now) / ($scope.trip_length - 1) * 100 + '%'
            };
        }

        for (var i = 0; i < $scope.trip_length; i++) {
            if ($scope.trip_now > i) {
                $scope.trips[i].trip_css = 'trip_point__complete';
            }
            if ($scope.trip_now === i) {
                $scope.trips[i].trip_css = 'trip_point__active';
            }
            if ($scope.trip_now < i) {
                $scope.trips[i].trip_css = '';
            }
        }
    };

    $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
        $scope.code_user_name = _result_user_data.username;
        $scope.edit_file_name = _result_user_data.trip.step[_result_user_data.point].step_name;
        $scope.steps = _result_user_data.trip.step;
        $scope.editorOptions = editorOptions_js;
        $scope.file_name = null;
        $scope.file_tree = $gamiEvent.project_name + '/create_file_tree?time=' + (new Date()).getTime();
        $scope.url = $gamiEvent.project_name + '/app_' + _result_user_data.uid + '/index.html';
        $scope.saveover = false;
        $scope.destroyover = false;
        $scope.buildover = false;
        $scope.load_mode = false;
        $scope.code_mode = true;
        $scope.view_mode = false;
        $scope.hint_page = true;
        $scope.landing_page = false;
        $scope.step_md_over = false;
        $scope.trip_index = _result_user_data.level - 1;
        $scope.trip_length = _result_user_data.trip.trip_length;
        $scope.trip_now = 0;
        $scope.step = _result_user_data.step_level - 1;
        $scope.md = 0;
        create_trip();
        $scope.create_tutorial($scope.step, $scope.md);
        $scope.trip_click();
        http_get_file('/js/game_' + _result_user_data.level + '_' + _result_user_data.point + '.js', true);
    });


    $scope.load_count_func = function() {};

    var editorOptions_js = {
        viewportMargin: 20,
        lineWrapping: true,
        lineNumbers: true,
        keyMap: 'sublime',
        theme: 'monokai',
        mode: 'text/javascript',
        htmlMode: true
    };

    var editorOptions_css = {
        viewportMargin: 20,
        lineWrapping: true,
        lineNumbers: true,
        keyMap: 'sublime',
        theme: 'monokai',
        mode: 'text/css',
        htmlMode: true
    };

    var editorOptions_html = {
        viewportMargin: 20,
        lineWrapping: true,
        lineNumbers: true,
        keyMap: 'sublime',
        theme: 'monokai',
        mode: 'xml',
        htmlMode: true
    };

    var editorOptions_img = false;

    var http_get_file = function(_url, noimg) {
        if (noimg) {
            $gamiEvent.gamer('/app_' + gamilms_uid + _url, function(err, code_data) {
                $scope.cmModel = code_data;
            });
        } else {
            $scope.code_img = $gamiEvent.project_name + '/app_' + gamilms_uid + _url;
        }
    };



    $scope.get_files = function(file_type, file_name) {
        $scope.file_name = file_name;
        $scope.edit_file_name = file_name.split('/')[file_name.split('/').length - 1];
        switch (file_type) {
            case 'js':
                http_get_file(file_name, true);
                $scope.editorOptions = editorOptions_js;
                $scope.load_mode = false;
                $scope.code_mode = true;
                $scope.view_mode = false;
                break;
            case 'css':
                http_get_file(file_name, true);
                $scope.editorOptions = editorOptions_css;
                $scope.load_mode = false;
                $scope.code_mode = true;
                $scope.view_mode = false;
                break;
            case 'html':
                http_get_file(file_name, true);
                $scope.editorOptions = editorOptions_html;
                $scope.load_mode = false;
                $scope.code_mode = true;
                $scope.view_mode = false;
                break;
            default:
                http_get_file(file_name, false);
                $scope.editorOptions = editorOptions_img;
                $scope.load_mode = false;
                $scope.code_mode = false;
                $scope.view_mode = true;
                break;
        }
    };

    $scope.newfile = function() {
        $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/new_file.html';
        $gamiEvent.MODEL_CONFIG.controller = 'NewFileCtrl';
        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(newfileReturn) {
            $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
                if (!newfileReturn.existed) {
                    $gamiEvent.createSnackbar('Create ' + newfileReturn.file_name + ' !');
                    $scope.file_name = newfileReturn.file_name;
                    $scope.file_tree = $gamiEvent.project_name + '/create_file_tree?time=' + (new Date()).getTime();
                    $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _result_user_data.uid + '&time=' + (new Date()).getTime();
                } else {
                    $gamiEvent.createSnackbar(newfileReturn.file_name + ' is existed!');
                }
            });
        });
    };



    $scope.editfilename = function($event) {
        var regex_file_type = /\.(js|css|html)$/;
        switch (true) {
            case ($event.keyCode == 13 && !!$scope.file_name && regex_file_type.test($scope.file_name)):
                $http.get($gamiEvent.project_name + '/node_file_tree').then(function(node_file_tree) {
                    var temp_file_name = $scope.file_name.split('/');
                    var organ_file_type = regex_file_type.exec($scope.file_name)[0];
                    if (regex_file_type.test($scope.edit_file_name)) {
                        temp_file_name[temp_file_name.length - 1] = $scope.edit_file_name;
                    } else {
                        temp_file_name[temp_file_name.length - 1] = $scope.edit_file_name + organ_file_type;
                        $scope.edit_file_name = $scope.edit_file_name + organ_file_type;
                    }

                    temp_file_name = temp_file_name.join('/');
                    var find_file = false;
                    traverse(node_file_tree).forEach(function(node) {
                        if (!!node && !!node.node_name && node.node_name === temp_file_name) {
                            find_file = true;
                        }
                    });
                    if (!find_file) {
                        $gamiEvent.gamipost({
                            url: '/editfilename',
                            data: {
                                file_name: $scope.file_name,
                                edit_file_name: temp_file_name
                            }
                        }, function(err, response) {
                            $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
                                $gamiEvent.createSnackbar($scope.edit_file_name + '\'s name is changed!');
                                $scope.file_name = temp_file_name;
                                $scope.file_tree = $gamiEvent.project_name + '/create_file_tree?time=' + (new Date()).getTime();
                                $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _result_user_data.uid + '&time=' + (new Date()).getTime();
                            });
                        });
                    } else {
                        $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
                            $gamiEvent.createSnackbar($scope.edit_file_name + ' is existed!');
                            $scope.file_name = temp_file_name;
                            $scope.file_tree = $gamiEvent.project_name + '/create_file_tree?time=' + (new Date()).getTime();
                            $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _result_user_data.uid + '&time=' + (new Date()).getTime();
                        });
                    }
                });
                break;
            default:
        }
    };

    $scope.destroyfile = function() {
        if (!$scope.destroyover && !!$scope.file_name) {
            $scope.destroyover = true;
            $gamiEvent.gamipost({
                url: '/destroyfile',
                data: {
                    file_name: $scope.file_name
                }
            }, function(err, response) {
                $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
                    $gamiEvent.createSnackbar($scope.edit_file_name + ' destroyed!');
                    $scope.edit_file_name = _result_user_data.username + '\'s Editor';
                    $scope.destroyover = false;
                    $scope.editorOptions = editorOptions_html;
                    $scope.file_name = null;
                    $scope.saveover = false;
                    $scope.destroyover = false;
                    $scope.buildover = false;
                    $scope.load_mode = true;
                    $scope.code_mode = false;
                    $scope.view_mode = false;
                    $scope.file_tree = $gamiEvent.project_name + '/create_file_tree?time=' + (new Date()).getTime();
                    $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _result_user_data.uid + '&time=' + (new Date()).getTime();
                });
            });
        }
    };

    $scope.savefile = function() {
        if (!$scope.saveover && !!$scope.code_mode && !!$scope.cmModel) {
            $scope.saveover = true;
            $gamiEvent.gamipost({
                url: '/savefile',
                data: {
                    file_name: $scope.file_name,
                    content: $gamiEvent.escape($scope.cmModel)
                }
            }, function(err, response) {
                if (response) {
                    $gamiEvent.gamer('/getGamer/', function(_err, _gamer) {
                        $gamiEvent.createSnackbar($scope.edit_file_name + ' saved!');
                        $scope.saveover = false;
                        $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _gamer.uid + '&time=' + (new Date()).getTime();
                    });
                }
            });
        }
    };

    $scope.step_info = function(step) {
        if (step < ($scope.trip_now + 1)) {
            $gamiEvent.gamer('/step_info/' + $scope.trip_index + '_' + step, function(err, step_info_data) {
                $scope.edit_file_name = step_info_data.step_name;
                $scope.step_contents = create_tutorial(step_info_data.step_info);
                $scope.information_active = 0;
            });
        }
    };

    $scope.save_step = function() {
        if (!$scope.saveover && !!$scope.code_mode && !!$scope.cmModel) {
            $scope.saveover = true;
            $gamiEvent.gamer('/getGamer/', function(_err, _gamer) {
                $gamiEvent.gamipost({
                    url: '/save_step',
                    data: {
                        file_name: '/js/game_' + _gamer.level + '_' + _gamer.point + '.js',
                        content: $gamiEvent.escape($scope.cmModel),
                    }
                }, function(err, response) {
                    if (response) {
                        $scope.information_active = 0;
                        $gamiEvent.createSnackbar('進度儲存完成!');
                        $scope.saveover = false;
                        http_get_file('/js/game_' + _gamer.level + '_' + _gamer.point + '.js', true);
                        $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _gamer.uid + '&time=' + (new Date()).getTime();
                    }
                });
            });
        }
    };
    $scope.next_step = function() {
        if (!$scope.nextover && !!$scope.code_mode && !!$scope.cmModel) {
            $scope.nextover = true;
            $gamiEvent.gamer('/getGamer/', function(_err, _gamer) {
                $gamiEvent.gamipost({
                    url: '/next_step',
                    data: {
                        // file_name: '/js/game_' + _gamer.level + '_' + _gamer.point + '.js',
                        // content: $gamiEvent.escape($scope.cmModel),
                        point: $scope.step
                    }
                }, function(err, response) {
                    // if (response.data.finish) {
                    //     $scope.information_active = 0;
                    //     $scope.edit_file_name = response.data.step_name;
                    //     $scope.trip_now = _gamer.point + 1;
                    //     $scope.trip_click();
                    //     $scope.step_contents = create_tutorial(response.data.step_info);
                    //     $scope.nextover = false;
                    //     http_get_file('/js/game_' + _gamer.level + '_' + _gamer.point + '.js', true);
                    //     $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _gamer.uid + '&time=' + (new Date()).getTime();
                    // } else {
                    //     $scope.information_active = 0;
                    //     $scope.edit_file_name = response.data.step_name;
                    //     $scope.step_contents = create_tutorial(response.data.step_info);
                    //     $scope.nextover = false;
                    //     http_get_file('/js/game_' + _gamer.level + '_' + _gamer.point + '.js', true);
                    $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _gamer.uid + '&time=' + (new Date()).getTime();
                    // }
                });
            });

        }
    };

    $scope.clean_code = function() {
        $gamiEvent.gamipost({
            url: '/clean_code',
            data: {
                code: $gamiEvent.escape($scope.cmModel),
            }
        }, function(err, response) {
            if (response) {
                $scope.information_active = 0;
                $gamiEvent.createSnackbar('程式碼整理完成！');
                $scope.cmModel = $gamiEvent.unescape(response.data);
            }
        });
    };

    $scope.restart_game = function() {
        $scope.information_active = 1;
        $gamiEvent.createSnackbar('遊戲測試重新啟動！');
        $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + gamilms_uid + '&time=' + (new Date()).getTime();
    };

    $scope.surevy_modal_open = function() {
        $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/survey.html';
        $gamiEvent.MODEL_CONFIG.controller = 'SurveyCtrl';
        $gamiEvent.MODEL_CONFIG.user_name = $scope.code_user_name;
        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(newChangeReturn) {
            $scope.step_progress = {
                'width': '0%'
            };
            $scope.trip_now = $scope.steps.length;
            $scope.trip_click();
            $scope.edit_file_name = '感謝填寫問卷';
            $scope.step_contents = "##問卷已經全部填寫完成，" + $scope.code_user_name + "，感謝你！\n";
            $scope.step_md_over = true;
            $scope.hide_step_md_ctrl_btn = true;
        });
    };

    $scope.buildfile = function() {
        $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/terminal.html';
        $gamiEvent.MODEL_CONFIG.controller = 'TerminalCtrl';
        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(newChangeReturn) {
            $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
                $gamiEvent.createSnackbar('關閉終端機！');
                $scope.edit_file_name = _result_user_data.username;
                $scope.editorOptions = editorOptions_html;
                $scope.file_name = null;
                $scope.file_tree = $gamiEvent.project_name + '/create_file_tree?time=' + (new Date()).getTime();
                $scope.url = $gamiEvent.project_name + '/app_' + _result_user_data.uid + '/index.html';
                $scope.saveover = false;
                $scope.destroyover = false;
                $scope.buildover = false;
                $scope.load_mode = true;
                $scope.code_mode = false;
                $scope.view_mode = false;
            });
        });
    };

    $scope.step_control_trigger = function(step_index, md_index) {
        $gamiEvent.update_badge('jump_step', function() {});
        if (step_index === 0) {
            $scope.create_tutorial(step_index, md_index);
        } else {
            $gamiEvent.gamer('/get_badge/step_' + (step_index + 1), function(err, badge_result) {
                if (badge_result.finish) {
                    $scope.create_tutorial(step_index, md_index);
                }
            });
        }
    }
    $scope.step_trigger = true;
    $rootScope.$on('set_step_trigger_false', function() {
        $scope.step_trigger = false;
    });
    $rootScope.$on('set_step_trigger_true', function() {
        $scope.step_trigger = true;
    });

    $scope.turn_on_test_game = function() {
        $gamiEvent.update_badge('test_game', function() {});
        $scope.test_game_on = false;
        $gamiEvent.gamipost({
            url: '/savefile',
            data: {
                file_name: '/js/game_1_dev.js',
                content: $gamiEvent.escape($scope.cmModel)
            }
        }, function(err, response) {
            if (response) {
                $gamiEvent.gamer('/getGamer/', function(_err, _gamer) {
                    $gamiEvent.createSnackbar('遊戲測試中！！');
                    $scope.url = $gamiEvent.project_name + '/app_' + gamilms_uid + '/index.html?uid=' + _gamer.uid + '&point=dev&time=' + (new Date()).getTime();
                });
            }
        });
    };
    $scope.turn_off_test_game = function() {
        $scope.test_game_on = true;
    };



    $scope.step_is_open = function() {
        if ($scope.step_trigger) {
            $scope.status.isopen = true;
        } else {
            $scope.status.isopen = false;
        };
    }
}]);
