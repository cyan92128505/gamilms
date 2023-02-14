angular.module('gamilms_profile', ['nvd3', 'ui.bootstrap'])
    .controller('ProfileCtrl', ['$scope', '$rootScope', '$stateParams', '$gamiEvent', '$window', '$sce',
        function($scope, $rootScope, $stateParams, $gamiEvent, $window, $sce) {
            $scope.start_learn = (gamilms_uid === $stateParams.uid) ? true : false;
            $scope.badges = [];
            $scope.user_logs = [];
            $scope.total_point = 0;
            $scope.user_get_point = 0;
            var app_uid = $stateParams.uid || gamilms_uid;
            var subjects = {
                finish: [],
                frequency: []
            };
            var suject_score = [{
                values: [], //values - represents the array of {x,y} data points
                key: '課程成績', //key  - the name of the series.
                color: '#92A8D1', //color - optional: choose your own line color.
                strokeWidth: 5,
                classed: 'dashed',
                bar: true
            }];
            $scope.start_learn_btn_text = '開始學習';
            $scope.start_learn_now = true;


            $rootScope.$on('all_subject_over',function(event, received){
                $scope.start_learn_btn_text = '填寫問卷';
                $scope.start_learn_now = false;
            });

            $gamiEvent.look_at_where("profile_" + app_uid, function(_err, _result_user_data) {
                app_uid = $stateParams.uid || _result_user_data.uid;
                if (/^profile_/.test(_result_user_data.web_state)) {
                    app_uid = /[0-9]+$/.exec(_result_user_data.web_state)[0];
                }

                $scope.start_answer_survey = function(){
                    $gamiEvent.gamer('/get_badge/thumb_up',function(err, result){
                        if(!result.finish){
                            $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/survey.html';
                            $gamiEvent.MODEL_CONFIG.controller = 'SurveyCtrl';
                            $gamiEvent.MODEL_CONFIG.user_name = _result_user_data.user_name;
                            $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(newChangeReturn) {
                                $gamiEvent.update_badge('thumb_up', function() {
                                    $gamiEvent.CHALLENGE_INFO = {
                                        challenge_title: result.arch_name,
                                        challenge_content: result.arch_name,
                                        challenge_img: $gamiEvent.project_name +'/images/achievement/' +result.information
                                    };
                                    $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/challenge.html';
                                    $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                                });

                            });
                        }
                    });
                };

                function getRandomIntInclusive(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };

                function convertArchName(arch_log) {
                    switch (true) {
                        case (/profile_/.test(arch_log)):
                            return '觀看檔案';
                            break;
                        case (/video_/.test(arch_log)):
                            return '觀看課程' + /[0-9]+/.exec(arch_log)[0];
                            break;
                        case (/Code/.test(arch_log)):
                            return '在學習區學習';
                            break;
                        case (/Subject/.test(arch_log)):
                            return '瀏覽課程列表';
                            break;
                        case (/Leaderboard/.test(arch_log)):
                            return '瀏覽排行榜';
                            break;
                        case (/Badge/.test(arch_log)):
                            return '瀏覽獎章列表';
                            break;
                        case (/About/.test(arch_log)):
                            return '瀏覽關於';
                            break;
                    }
                }

                var now_time = new Date();



                $scope.badge_color = function(value) {
                    color_type = ['sport_gold', 'sport_sliver', 'sport_normal'];
                    switch (true) {
                        case (value < 3):
                            return color_type[2];
                            break;
                        case (value > 2 && value < 10):
                            return color_type[1];
                            break;
                        case (value > 10):
                            return color_type[0];
                            break;
                        default:
                            return color_type[2];
                    }
                };

                $gamiEvent.gamer('/getGamer/' + app_uid, function(_err, _gamer) {
                    _gamer.subjects.sort(function(a, b) {
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
                    for (var subjects_i = 0; subjects_i < _gamer.subjects.length; subjects_i++) {
                        suject_score[0].values.push({
                            x: subjects_i,
                            y: _gamer.subjects[subjects_i].score
                        });
                        subjects.finish.push([subjects_i, _gamer.subjects[subjects_i].finish]);
                        subjects.frequency.push([subjects_i, _gamer.subjects[subjects_i].frequency]);
                    }
                    for (var badges_i = 0; badges_i < _gamer.badges.length; badges_i++) {
                        if (_gamer.badges[badges_i].finish) {
                            $scope.user_get_point = $scope.user_get_point + _gamer.badges[badges_i].value;
                        }
                        $scope.total_point = $scope.total_point + _gamer.badges[badges_i].value;
                        if (_gamer.badges[badges_i].finish) {
                            $scope.badges.push({
                                name: _gamer.badges[badges_i].arch_name,
                                image: $gamiEvent.project_name + '/images/achievement/' + _gamer.badges[badges_i].information,
                                value: _gamer.badges[badges_i].frequency
                            });
                            if(_gamer.badges[badges_i].arch_name === '完成全部的課程'){
                                console.log(_gamer.badges[badges_i].arch_name);
                                $scope.start_learn_btn_text = '填寫問卷';
                                $scope.start_learn_now = false;
                            }
                        }
                        if ((badges_i + 1) === _gamer.badges.length) {
                            $scope.progress_length = {
                                'stroke-dashoffset': Math.round(600 - ((600 / $scope.total_point) * $scope.user_get_point))
                            };
                            $rootScope.$broadcast('start_to_count');
                        }
                    }
                    for (var logs_i = 0; logs_i < _gamer.logs.length; logs_i++) {
                        $scope.user_logs.push({
                            raw_time: _gamer.logs[logs_i].update_time,
                            timestamp: /\d{4}[\w\W]\d{2}[\w\W]\d{2}/.exec(_gamer.logs[logs_i].update_time)[0],
                            image: $gamiEvent.project_name + '/images/cat_computer.jpg',
                            event_name: convertArchName(_gamer.logs[logs_i].arch_name)
                        });
                        if ((logs_i + 1) === _gamer.logs.length) {
                            $scope.user_logs.sort(function(a, b) {
                                return (a.raw_time - b.raw_time);
                            });
                        }
                    }
                    $scope.user = _gamer;

                    //圓形進度條 總圈長600px 長度與表示數值成反比
                    //http://codepen.io/mattstvartak/pen/mVLroJ
                    // if (_gamer.point === 9) {
                    //     $scope.progress_length = {
                    //         'stroke-dashoffset': 0
                    //     };
                    // } else {
                    //     $scope.progress_length = {
                    //         'stroke-dashoffset': Math.round(600 - ((600 / $scope.total_point) * $scope.user_get_point))
                    //     };
                    // }


                    //https://developers.facebook.com/docs/graph-api/reference/profile-picture-source/
                    $scope.user.image = 'http://graph.facebook.com/' + _gamer.uid + '/picture?type=large&width=240&height=240';
                    $scope.profile_info_image = {
                        'background-image': 'url(\'' + $scope.user.image + '\')',
                        'background-repeat': 'no-repeat'
                    };
                    $scope.subject_chart_options = {
                        chart: {
                            type: 'linePlusBarChart',
                            height: 200,
                            margin: {
                                top: 30,
                                right: 75,
                                bottom: 50,
                                left: 75
                            },
                            bars: {
                                forceY: [0]
                            },
                            bars2: {
                                forceY: [0]
                            },
                            color: ['#92A8D1', '#F7CAC9'],
                            x: function(d, i) {
                                return i
                            },
                            xAxis: {
                                axisLabel: '課程區間',
                                tickFormat: function(d) {
                                    var dx = $scope.subject_chart_data[0].values[d] && $scope.subject_chart_data[0].values[d].x || 0;
                                    if (dx > 0) {
                                        return dx;
                                    }
                                    return null;
                                }
                            },
                            x2Axis: {
                                tickFormat: function(d) {
                                    var dx = $scope.subject_chart_data[0].values[d] && $scope.subject_chart_data[0].values[d].x || 0;
                                    return dx;
                                },
                                showMaxMin: false
                            },
                            y1Axis: {
                                axisLabel: '課程參與次數',
                                tickFormat: function(d) {
                                    return d3.format(',f')(d) + '次';
                                },
                                axisLabelDistance: 12
                            },
                            y2Axis: {
                                axisLabel: '課程完成度',
                                tickFormat: function(d) {
                                    return d3.format('f')(d) + '%';
                                }
                            },
                            y3Axis: {
                                tickFormat: function(d) {
                                    return d3.format('f')(d) + '次';
                                }
                            },
                            y4Axis: {
                                tickFormat: function(d) {
                                    return d3.format('f')(d) + '%';
                                }
                            }
                        }
                    };
                    $scope.subject_chart_data = [{
                        "key": "課程參與次數",
                        "bar": true,
                        "values": subjects.frequency
                    }, {
                        "key": "課程完成度",
                        "values": subjects.finish
                    }].map(function(series) {
                        series.values = series.values.map(function(d) {
                            return {
                                x: d[0] + 1,
                                y: d[1]
                            }
                        });
                        return series;
                    });


                    $scope.engage_chart_options = {
                        chart: {
                            type: 'lineChart',
                            height: 200,
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 40,
                                left: 55
                            },
                            x: function(d) {
                                return (d.x + 1);
                            },
                            y: function(d) {
                                return d.y;
                            },
                            useInteractiveGuideline: true,
                            dispatch: {
                                stateChange: function(e) {},
                                changeState: function(e) {},
                                tooltipShow: function(e) {},
                                tooltipHide: function(e) {}
                            },
                            xAxis: {
                                axisLabel: '課程編號',
                                tickFormat: function(d) {
                                    return '課程' + (d);
                                },
                                axisLabelDistance: 1,
                                showMaxMin: false
                            },
                            yAxis: {
                                axisLabel: '成績',
                                tickFormat: function(d) {
                                    return d3.format('f')(d);
                                },
                                axisLabelDistance: 100
                            },
                            callback: function(chart) {}
                        }
                    };

                    $scope.engage_chart_data = suject_score;

                    $scope.getapk = function() {
                        $gamiEvent.LOOK_AT = app_uid;
                        $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/phone.html';
                        $gamiEvent.MODEL_CONFIG.controller = 'PhoneCtrl';
                        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                    };



                });
            });
        }
    ]);
