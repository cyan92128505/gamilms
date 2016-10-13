angular.module('AdminApp', [
        'ui.bootstrap',
        'JSONedit',
        'gamilms_factory'
    ])
    .controller('adminCtrl', ['$scope', '$http', '$gamiEvent', function($scope, $http, $gamiEvent) {
        $scope.app_title = 'Admin Panel';
        $scope.models = ['user', 'quest', 'video', 'survey', 'ionicfile', 'arch'];
        $scope.isAdd = false;
        $scope.editorOptions = {
            viewportMargin: 20,
            lineWrapping: true,
            lineNumbers: true,
            keyMap: 'sublime',
            theme: 'monokai',
            mode: 'text/javascript',
            htmlMode: true
        };

        var command = {
            'user': $gamiEvent.project_name + '/admin/user',
            'quest': $gamiEvent.project_name + '/admin/quest',
            'video': $gamiEvent.project_name + '/admin/video',
            'survey': $gamiEvent.project_name + '/admin/survey',
            'ionicfile': $gamiEvent.project_name + '/admin/ionicfile',
            'arch': $gamiEvent.project_name + '/admin/arch'
        };

        var add_event = {
            user: {
                uid: 'uid',
                username: 'User Name',
                web_state: 'where ara you',
                active_time: new Date(),
                create_time: new Date(),
                level: 1,
                point: 1
            },
            quest: {
                qid: 'String',
                vid: 'String',
                uid: 'String',
                title: 'String',
                content: 'String',
                score: 0,
                finish: false,
                create_time: new Date(),
                active_time: new Date()
            },
            video: {
                uid: 'uid',
                vid: 'vid',
                provider: 'Ionic_Video',
                title: 'Ionic_Number',
                information: 'Ionic video subject Information',
                content: 'URL',
                url: 'URL',
                icon: 'icon',
                give_point: 1,
                need_level: 1,
                score: 0,
                finish: false,
                create_time: new Date(),
                active_time: new Date()
            },
            arch: {
                aid: 'aid',
                uid: 'uid',
                provider: 'String',
                arch_name: 'First Badge',
                information: 'First Badge',
                content: 'First Badge',
                finish: false,
                create_time: new Date()
            },
            survey: {
                uid: 'String',
                type: 'Ionic_1',
                question: [{
                    quest_title: '問題：下列那一個程式語言環境是Ionic必須的？',
                    quest_terms: [{
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
                    }]
                }, {
                    quest_title: '問題：下列那一個程式語言環境是Ionic必須的？',
                    quest_terms: [{
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
                    }]
                }],
                answer: [1, 2],
                finish: false,
                create_time: new Date()
            }
        };
        $scope.icons = [];

        $scope.geticons = function() {
            $scope.turnicon = true;
            $gamiEvent.icons_path(function(err, response) {
                $scope.icons = response;
            });
        };

        $scope.change_model = function(_directive) {
            $http.get(command[_directive]).then(function(response) {
                $scope.jsonData = response.data;
                $scope.list_name = _directive;
            });
        };
        $scope.jsdiff = function() {
            $http.post($gamiEvent.project_name + '/admin_jsdiff/', {
                a: $scope.jsdiff_input_a,
                b: $scope.jsdiff_input_b
            }).then(function(response) {
                $scope.jsonData = response.data;
            });
        };

        $scope.js2json = function() {
            $http.post($gamiEvent.project_name + '/admin_js2json', {
                raw: $scope.jsdiff_input_a
            }).then(function(response) {
                $scope.jsonData = response.data;
                $scope.jsdiff_input_b = JSON.stringify(response.data, null, 2);
            });
        }

        $scope.add_model = function() {
            $scope.isAdd = true;
            $scope.addData = add_event[$scope.list_name];
        };

        $scope.send_model = function() {
            $scope.isAdd = false;
            $http.post($gamiEvent.project_name + '/admin_create/', {
                model_name: command[$scope.list_name],
                model_content: $scope.addData
            }).then(function(response) {
                $scope.jsonData = response.data;
            });
        };
    }]);

//http://codepen.io/felixw/pen/qEjarm
