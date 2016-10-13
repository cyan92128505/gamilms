angular.module('gamilms_factory', [])
    .factory('$gamiEvent', ['$rootScope', '$http', '$uibModal', 'terminal_command', function($rootScope, $http, $uibModal, terminal_command) {
        var MODEL_CONFIG = {
            animation: true,
            controller: 'InstanceCtrl',
            templateUrl: project_name + '/template/challenge.html',
            size: 'lg',
            backdrop: 'static',
            keyboard: false
        };
        var CHALLENGE_INFO = {
            challenge_title: '恭喜你',
            challenge_content: '完成第一堂課程',
            challenge_img: '/images/Challenge.png'
        };
        var TERMINAL_OUTPUT_CACHE = [];
        var ONBOARDING_QUEUE = [];
        var LOOK_AT = '';
        var USER_DATA = {};
        var gaminum = 0;
        var event_log = function(gami_option) {
            var gami_option_url = gami_option.join('/');
            $http.get(project_name + '/gamievent/' + gami_option_url).then(function(_response) {
                console.log(_response);
            });
        };
        var GAMIEVENT = {
            project_name: project_name,
            icons_path: function(callback) {
                $http.get(project_name + '/get_icons_path').then(function(response) {
                    console.log(response);
                    return callback(null, response.data);
                });
            },
            look_at_where: function(_url, _callback) {
                var gamer_uid = _url;
                if (!gamer_uid) {
                    this.gamer('/getGamer', function(_err, _result) {
                        _callback(false, _result);
                    });
                }
                $http.post(project_name + '/look_at_where', {
                    look_at: _url
                }).then(function(look_at_where_response) {
                    USER_DATA = look_at_where_response.data;
                    _callback(false, look_at_where_response.data);
                }, function(error_response) {
                    console.log(error_response);
                });
            },
            build_app: function(_callback) {
                if (ONBOARDING_QUEUE.length === parseInt('0', 10)) {
                    $http.get(project_name + '/build_app').then(_callback);
                }
            },
            gamer: function(_url, _callback) {
                if (ONBOARDING_QUEUE.length === parseInt('0', 10)) {
                    $http.get(project_name + _url).then(function(_response) {
                        _callback(false, _response.data);
                    });
                }
            },
            gamipost: function(option, callback) {
                if (ONBOARDING_QUEUE.length === parseInt('0', 10)) {
                    $http.post(project_name + option.url, option.data).then(function(result) {
                        callback(null, result);
                    }, function(err) {
                        callback(true, err);
                    });
                }
            },
            update_badge: function(badge_name, callback) {
                this.gamipost({
                    url: '/update_badge',
                    data: {
                        badge_name: badge_name
                    }
                }, function(err, badge_result) {
                    console.log(badge_result.data);
                    if (!badge_result.data.finish) {
                        $rootScope.$broadcast('createSnackbar', {
                            'content': '獲得獎章『' + badge_result.data.arch_name + '』',
                            'duration': ''
                        });
                        callback();
                    }
                });
            },
            createOnboarding: function() {
                $rootScope.$broadcast('createOnboarding');
            },
            createSnackbar: function(content, duration) {
                $rootScope.$broadcast('createSnackbar', {
                    'content': content,
                    'duration': duration
                });
            },
            escape: function(string) {
                return ('' + string).replace(/["'\\\n\r\u2028\u2029]/g, function(character) {
                    // Escape all characters not included in SingleStringCharacters and
                    // DoubleStringCharacters on
                    // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
                    switch (character) {
                        case '"':
                        case "'":
                        case '\\':
                            return '\\' + character
                                // Four possible LineTerminator characters need to be escaped:
                        case '\n':
                            return '\\n'
                        case '\r':
                            return '\\r'
                        case '\u2028':
                            return '\\u2028'
                        case '\u2029':
                            return '\\u2029'
                    }
                })
            },
            unescape: function(string) {
                return ('' + string).replace(/(\\\\\"|\\\\\'|\\\\\\|\\\\n|\\\\r|\\\\u2028|\\\\u2029)/g, function(character) {
                    // Escape all characters not included in SingleStringCharacters and
                    // DoubleStringCharacters on
                    // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
                    switch (character) {
                        case '\\"':
                            return '"'
                        case "\\'":
                            return "'"
                        case '\\\\':
                            return '\\'
                                // Four possible LineTerminator characters need to be escaped:
                        case '\\n':
                            return '\n'
                        case '\\r':
                            return '\r'
                        case '\\u2028':
                            return '\u2028'
                        case '\\u2029':
                            return '\u2029'
                    }
                })
            },
            command: terminal_command,
            open_modal: function(option) {
                if (this.ONBOARDING_QUEUE.length === parseInt('0', 10)) {
                    console.log(option);
                    return $uibModal.open(option);
                }
            },
            open_logo_modal: function(option) {
                this.gamipost({
                    url: '/update_badge',
                    data: {
                        badge_name: 'first_login'
                    }
                }, function(err, result) {

                });
                return $uibModal.open(option);
            },

            //變數
            LOOK_AT: LOOK_AT,
            USER_DATA: USER_DATA,
            TERMINAL_OUTPUT_CACHE: TERMINAL_OUTPUT_CACHE,
            MODEL_CONFIG: MODEL_CONFIG,
            ONBOARDING_QUEUE: ONBOARDING_QUEUE,
            SURVEY_DATA: [{
                "survey": "基本資料",
                "likert": false,
                "textarea": false,
                "parts": [{
                    "part_name": "基本資料填寫",
                    "part_terms": [{
                        "term_name": "性別",
                        "term_option": [
                            "女",
                            "男 "
                        ]
                    }, {
                        "term_name": "年紀(歲)",
                        "term_option": [
                            "小於18",
                            "18~25",
                            "25~35",
                            "35~45 ",
                            "45~55 ",
                            "55~65 ",
                            "大於65"
                        ]
                    }, {
                        "term_name": "學歷",
                        "term_option": [
                            "國中 ",
                            "高中 ",
                            "大學 ",
                            "研究所 ",
                            "其他"
                        ]
                    }, {
                        "term_name": "職業",
                        "term_option": [
                            "學生 ",
                            "公務人員 ",
                            "教師 ",
                            "軍人 ",
                            "工業/製造/營造相關 ",
                            "金融/保險/貿易相關 ",
                            "工商企業投資 ",
                            "農、林、漁、牧業 ",
                            "文化/運動/休閒相關 ",
                            "運輸/倉儲/通信相關 ",
                            "專業技術人員(如醫師/律師/資訊/工程/會計/設計等) ",
                            "家庭管理 ",
                            "無業/待業 ",
                            "退休 ",
                            "服務業 ",
                            "其他"
                        ]
                    }]
                }]
            }, {
                "survey": "學習管理系統可用性量表",
                "likert": false,
                "textarea": false,
                "parts": [{
                    "part_name": "好感度",
                    "part_terms": [{
                        "term_name": "此學習管理系統的視覺效果是有趣的",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "此學習管理系統是令人印象深刻的",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "此學習管理系統的體驗是熟悉的",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }]
                }, {
                    "part_name": "實用度",
                    "part_terms": [{
                        "term_name": "我能立即在學習管理系統上找到我想要的訊息",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "此學習管理系統上大多數的說明我都可以理解",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "我覺得在使用此學習管理系統上找尋目標所花的時間很少",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }]
                }, {
                    "part_name": "操作的簡易性",
                    "part_terms": [{
                        "term_name": "此學習管理系統的操作是簡單的且容易理解",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "立即就能理解學習管理系統內容並且上手",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "在使用學習管理系統時不需要猶豫",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }]
                }, {
                    "part_name": "視覺效果",
                    "part_terms": [{
                        "term_name": "此學習管理系統的文字編排、佈局是容易閱讀的",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "此學習管理系統的圖表和圖片是合理且恰當",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "使用學習管理系統時視覺是舒適的",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }]
                }]
            }, {
                "survey": "自我決定量表",
                "likert": false,
                "textarea": false,
                "parts": [{
                    "part_name": "自主感",
                    "part_terms": [{
                        "term_name": "課程難易度等級讓我覺得我能控制我的學習過程",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "獎章讓我有興趣使用學習管理系統",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "點數讓我有信心去使用學習管理系統",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "獎章讓我有信心去使用學習管理系統",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }]
                }, {
                    "part_name": "關聯感",
                    "part_terms": [{
                        "term_name": "個人資訊頁面讓我易於向其他人展現我的學習狀態",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "個人資訊頁面讓易於觀看別人的學習狀態",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "排行榜讓我易於判斷自己與他之間的差異",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }]
                }, {
                    "part_name": "勝任感",
                    "part_terms": [{
                        "term_name": "我很享受獲得點數的感覺,讓我覺得很有趣",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "我很享受獲得獎章的感覺,讓我覺得很有趣",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "獎章與排行榜讓我易於理解自身的能力",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "課程等級調整讓我覺得很容易就能找到我想要的內容",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }]
                }]
            }, {
                "survey": "內在動機量表",
                "likert": false,
                "textarea": false,
                "parts": [{
                    "part_name": "",
                    "part_terms": [{
                        "term_name": "當我使用此學習管理系統學習時覺得很喜歡",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "當我使用此學習管理系統學習時，我不會感到不安",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "此學習管理系統並沒有引起我的注意",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "我覺得此學習管理系統相當不錯",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "我會形容此學習管理系統很有趣",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "比起其他人，我覺得此學習管理系統很好",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "我很享受在此學習管理系統學習",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "使用此學習管理系統學習時，我覺得很緊張",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }, {
                        "term_name": "使用此學習管理系統時的體驗是愉快的",
                        "term_option": [
                            "非常同意",
                            "同意",
                            "無意見",
                            "不同意",
                            "非常不同意"
                        ]
                    }]
                }]
            }, {
                "survey": "開放試問卷",
                "likert": false,
                "textarea": true,
                "parts": [{
                    "part_name": "",
                    "part_terms": [{
                        "term_name": "您覺得使用此遊戲化學習管理系統時，是否能有效提升學習動機？請說明。",
                        "term_option": []
                    }, {
                        "term_name": "您覺得此遊戲化學習管理系統的設計有何優點和缺點？請說明。",
                        "term_option": []
                    }, {
                        "term_name": "您對於遊戲化學習管理系統有無其他建議或感想？",
                        "term_option": []
                    }]
                }]
            }]
        };
        return GAMIEVENT;
    }]);
