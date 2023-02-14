angular.module('gamilms_profile', ['nvd3', 'ui.bootstrap'])
    .controller('ProfileCtrl', ['$scope', '$stateParams', '$gamiEvent', '$window',
        function($scope, $stateParams, $gamiEvent, $window) {
            $scope.badges = [];
            $scope.user_logs = [];
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
            $gamiEvent.look_at_where("profile_" + app_uid, function(_err, _result_user_data) {
                app_uid = $stateParams.uid || _result_user_data.uid;
                if (/^profile_/.test(_result_user_data.web_state)) {
                    app_uid = /[0-9]+$/.exec(_result_user_data.web_state)[0];
                }
                /*Random Data Generator */
                // function suject_data() {
                //     // var temp_data = [];
                //     // //Data is represented as an array of {x,y} pairs.
                //     // for (var i = 1; i < 26; i++) {
                //     //     temp_data.push({
                //     //         x: i,
                //     //         y: getRandomIntInclusive(60, 100)
                //     //     });
                //     // }
                //
                //     //Line chart data should be sent as an array of series objects.
                //     return [{
                //         values: subjects.score, //values - represents the array of {x,y} data points
                //         key: '課程成績', //key  - the name of the series.
                //         color: '#92A8D1', //color - optional: choose your own line color.
                //         strokeWidth: 5,
                //         classed: 'dashed',
                //         bar: true
                //     }];
                // };

                function getRandomIntInclusive(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };

                // var subject_data = {
                //     subject_finish: [],
                //     subject_times: []
                // };

                var now_time = new Date();


                // for (var i = 1; i < 26; i++) {
                //     subject_data.subject_finish.push([i, getRandomIntInclusive(60, 100)]);
                //     subject_data.subject_times.push([i, getRandomIntInclusive(1, 5)]);
                // }

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
                    for (var i = 0; i < _gamer.subjects.length; i++) {
                        suject_score[0].values.push({
                            x: i,
                            y: _gamer.subjects[i].score
                        });
                        subjects.finish.push([i, _gamer.subjects[i].finish]);
                        subjects.frequency.push([i, _gamer.subjects[i].frequency]);
                    }
                    console.log(subjects);
                    for (var i = 0; i < _gamer.badges.length; i++) {
                        $scope.badges.push({
                            name: _gamer.badges[i].arch_name,
                            image: '/icons/badges/' + _gamer.badges[i].information,
                            value: _gamer.badges[i].frequency
                        });
                    }
                    for (var i = 0; i < _gamer.logs.length; i++) {
                        $scope.user_logs.push({
                            timestamp: _gamer.logs[i].update_time,
                            image: '/images/cat_computer.jpg',
                            event_name: _gamer.logs[i].arch_name
                        });
                    }
                    $scope.user = _gamer;
                    $scope.progress_length = {
                        'stroke-dashoffset': Math.round(600 - ((600 / 700) * _gamer.point))
                    };
                    //https://developers.facebook.com/docs/graph-api/reference/profile-picture-source/
                    $scope.user.image = 'http://graph.facebook.com/' + _gamer.uid + '/picture?type=large&width=200&height=200';

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
                                x: d[0],
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
                                return d.x;
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
                                    return '課程' + d;
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
                        $gamiEvent.MODEL_CONFIG.templateUrl = '/template/phone.html';
                        $gamiEvent.MODEL_CONFIG.controller = 'PhoneCtrl';
                        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                    };

                });
            });
        }
    ]);
