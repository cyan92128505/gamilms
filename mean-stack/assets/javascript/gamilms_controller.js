angular.module('gamilms_controller', [])
    .controller('InstanceCtrl', ['$scope', '$uibModalInstance', 'snackbar', function($scope, $uibModalInstance, snackbar) {
        $scope.share = function() {
            snackbar.create("Hello World!!");
        };
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    }])
    .controller('Video_questCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', function($scope, $uibModalInstance, $gamiEvent) {
        var regex_video = /video_/;
        var video_id = regex_video.exec($gamiEvent.USER_DATA.web_state);
        var corrent_color = {
            'color': '#5c7dba'
        };
        var non_choice_color = {
            'color': '#bdbdbd'
        };
        $scope.corrent = false;


        $scope.quest_title = '問題：下列那一個程式語言環境是Ionic必須的？';
        $scope.quest_terms = [{
            term_name: 'Node.JS',
            term_corrent: true,
            term_index: 0
        }, {
            term_name: 'PHP',
            term_corrent: false,
            term_index: 1
        }, {
            term_name: 'Python',
            term_corrent: false,
            term_index: 2
        }, {
            term_name: 'Ruby',
            term_corrent: false,
            term_index: 3
        }];

        $scope.choice_css = $scope.quest_terms.map(function(element, index, list) {
            return non_choice_color;
        });


        $scope.choice = function(term_corrent, term_index) {
            $scope.choice_css.map(function(element, index, list) {
                if (term_index === index) {
                    $scope.choice_css[index] = corrent_color;
                } else {
                    $scope.choice_css[index] = non_choice_color;
                }
            });
            console.log($scope.choice_css);
            $scope.corrent = term_corrent;
        };

        $scope.close = function() {
            $uibModalInstance.close();
        };
        $scope.send_answer = function() {
            $uibModalInstance.close();
            if ($scope.corrent) {
                $gamiEvent.CHALLENGE_INFO = {
                    challenge_title: '恭喜你',
                    challenge_content: '完成第一堂課程',
                    challenge_img: '/images/Challenge.png'
                };
                $gamiEvent.MODEL_CONFIG.templateUrl = '/template/challenge.html';
                $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
            } else {
                $gamiEvent.CHALLENGE_INFO = {
                    challenge_title: '喔！ 錯了',
                    challenge_content: '再看一次影片吧',
                    challenge_img: '/images/walk.gif'
                };
                $gamiEvent.MODEL_CONFIG.templateUrl = '/template/challenge.html';
                $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
            }
        };
        // $gamiEvent.$gamiEvent('/commission/'+$gamiEvent.USER_DATA.uid+'/'+video_id,function(){
        //
        // });
    }])
    .controller('ChallengeCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', function($scope, $uibModalInstance, $gamiEvent) {
        $scope.challenge_title = $gamiEvent.CHALLENGE_INFO.challenge_title;
        $scope.challenge_content = $gamiEvent.CHALLENGE_INFO.challenge_content;
        $scope.challenge_img = $gamiEvent.CHALLENGE_INFO.challenge_img;
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    }])
    .controller('PhoneCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', function($scope, $uibModalInstance, $gamiEvent) {
        $scope.url = '/index.html?' + (new Date()).getTime();
        $gamiEvent.gamer('/check_apk_state', function(err, _result) {
            if (_result) {
                $scope.apk = '/apk/' + $gamiEvent.LOOK_AT + '.apk';
            } else {
                $scope.apk = '/apk/0.apk';
            }
        });
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    }])
    .controller('NewFileCtrl', ['$scope', '$http', '$rootScope', '$uibModalInstance', '$gamiEvent', 'fileReader', function($scope, $http, $rootScope, $uibModalInstance, $gamiEvent, fileReader) {
        var btn_ok = false;
        $scope.file_type_url = null;
        $scope.file_name = null;
        $scope.file_content = null;
        $scope.img_view = false;
        $scope.seleted_change = function() {
            switch ($scope.file_type) {
                case 'js':
                    $scope.file_type_url = '/js/';
                    $scope.file_content = escape('console.log(\'hello world!\');');
                    $scope.img_view = false;
                    break;
                case 'css':
                    $scope.file_type_url = '/css/';
                    $scope.file_content = escape('/* Empty. Add your own CSS if you like */');
                    $scope.img_view = false;
                    break;
                case 'html':
                    $scope.file_type_url = '/templates/';
                    $scope.file_content = escape('<h1>hello world</h1>');
                    $scope.img_view = false;
                    break;
                case 'img':
                    $scope.file_type_url = '/img/';
                    $scope.img_view = true;
                    break;
                default:
            }
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.ok = function() {
            var request_data = {
                file_name: null,
                content: $scope.file_content,
                existed: false
            }
            if (!!$scope.file_content && !!$scope.file_type_url && !btn_ok && $scope.file_name !== null) {
                switch ($scope.file_type) {
                    case 'js':
                        if (/\.js$/.exec($scope.file_name)) {
                            request_data.file_name = $scope.file_type_url + $scope.file_name;
                        } else {
                            request_data.file_name = $scope.file_type_url + $scope.file_name + '.js';
                        }
                        break;
                    case 'css':
                        if (/\.css$/.exec($scope.file_name)) {
                            request_data.file_name = $scope.file_type_url + $scope.file_name;
                        } else {
                            request_data.file_name = $scope.file_type_url + $scope.file_name + '.css';
                        }
                        break;
                    case 'html':
                        if (/\.html$/.exec($scope.file_name)) {
                            request_data.file_name = $scope.file_type_url + $scope.file_name;
                        } else {
                            request_data.file_name = $scope.file_type_url + $scope.file_name + '.html';
                        }
                        break;
                    case 'img':
                        if (/\.(png|jpg|gif|jpeg)$/.exec($scope.file_name)) {
                            request_data.file_name = $scope.file_type_url + $scope.file_name;
                        } else {
                            request_data.file_name = $scope.file_type_url + $scope.file_name + '.png';
                        }
                        break;
                    default:
                }
                btn_ok = true;
                $http.get('/node_file_tree').then(function(node_file_tree) {
                    traverse(node_file_tree).forEach(function(node) {
                        if (!!node && !!node.node_name && node.node_name === request_data.file_name) {
                            request_data.existed = true;
                        }
                    });
                    if (!request_data.existed) {
                        $gamiEvent.gamipost({
                            url: '/savefile',
                            data: request_data
                        }, function(response) {
                            btn_ok = false;
                            $uibModalInstance.close(request_data);
                        });
                    } else {
                        btn_ok = false;
                        $uibModalInstance.close(request_data);
                    }
                });
            }
        };
        $scope.getFile = function() {
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
                .then(function(result) {
                    $scope.imageSrc = result;
                    $scope.file_content = $scope.imageSrc.replace(/data:[\w\W]+;base64,/, '');
                });
        };
        $scope.$on("fileProgress", function(e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });

    }]);
// .controller('EditFileCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', 'fileReader', function($scope, $uibModalInstance, $gamiEvent, fileReader) {
//     $scope.file_type_url = null;
//     $scope.seleted_change = function() {
//         switch ($scope.file_type) {
//             case 'js':
//                 $scope.file_type_url = '/js/';
//                 $scope.file_content = escape('console.log(\'hello world!\');');
//                 $scope.img_view = false;
//                 break;
//             case 'css':
//                 $scope.file_type_url = '/css/';
//                 $scope.file_content = escape('/* Empty. Add your own CSS if you like */');
//                 $scope.img_view = false;
//                 break;
//             case 'html':
//                 $scope.file_type_url = '/templates/';
//                 $scope.file_content = escape('<h1>hello world</h1>');
//                 $scope.img_view = false;
//                 break;
//             case 'img':
//                 $scope.file_type_url = '/img/';
//                 $scope.img_view = true;
//                 break;
//             default:
//         }
//     };
//     $scope.cancel = function() {
//         $uibModalInstance.close();
//     };
//     $scope.ok = function() {
//         if (!!$scope.file_content && !!$scope.file_type_url) {
//             $gamiEvent.gamipost({
//                 url: '/addfile',
//                 data: {
//                     file_name: $scope.file_type_url + $scope.file_name,
//                     file_content: $scope.file_content
//                 }
//             }, function(response) {
//                 console.log(response);
//                 $uibModalInstance.close();
//             });
//         }
//     };
//     $scope.getFile = function() {
//         $scope.progress = 0;
//         fileReader.readAsDataUrl($scope.file, $scope)
//             .then(function(result) {
//                 $scope.imageSrc = result;
//                 $scope.file_content = result.replace(/data:[\w\W]+;base64,/, '');
//             });
//     };
//     $scope.$on("fileProgress", function(e, progress) {
//         $scope.progress = progress.loaded / progress.total;
//     });
//
// }]);
