angular.module('gamilms_code', [
    'ui.bootstrap',
    'ui.codemirror'
]).controller('CodeCtrl', ['$rootScope', '$scope', '$http', '$gamiEvent', '$sce', '$timeout', function($rootScope, $scope, $http, $gamiEvent, snackbar, $sce, $timeout) {



    $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
        $scope.edit_file_name = _result_user_data.username;
        $scope.editorOptions = editorOptions_html;
        $scope.file_name = null;
        $scope.file_tree = '/create_file_tree?time=' + (new Date()).getTime();
        $scope.url = '/index.html';
        $scope.saveover = false;
        $scope.destroyover = false;
        $scope.buildover = false;
        $scope.load_mode = true;
        $scope.code_mode = false;
        $scope.view_mode = false;
    });


    $scope.load_count_func = function() {
        console.log($scope.load_count);
    };

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
            $http.get(_url).then(function(code_data) {
                $scope.cmModel = code_data.data;
            });
        } else {
            $scope.code_img = _url;
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
        $gamiEvent.MODEL_CONFIG.templateUrl = '/template/new_file.html';
        $gamiEvent.MODEL_CONFIG.controller = 'NewFileCtrl';
        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(newfileReturn) {
            $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
                if (!newfileReturn.existed) {
                    $gamiEvent.createSnackbar('Create ' + newfileReturn.file_name + ' !');
                    $scope.file_name = newfileReturn.file_name;
                    $scope.file_tree = '/create_file_tree?time=' + (new Date()).getTime();
                    $scope.url = '/index.html?uid=' + _result_user_data.uid + '&time=' + (new Date()).getTime();
                } else {
                    $gamiEvent.createSnackbar(newfileReturn.file_name + ' is existed!');
                }
            });
        });
    };



    $scope.editfilename = function($event) {
        switch (true) {
            case ($event.keyCode == 13 && $scope.edit_file_name !== 'Aoma Shinku\'s Editor' && !!$scope.file_name):
                $http.get('/node_file_tree').then(function(node_file_tree) {
                    var temp_file_name = $scope.file_name.split('/');
                    temp_file_name[temp_file_name.length - 1] = $scope.edit_file_name;
                    temp_file_name = temp_file_name.join('/');
                    var find_file = false;
                    traverse(node_file_tree).forEach(function(node) {
                        if (!!node && !!node.node_name && node.node_name === temp_file_name) {
                            find_file = true;
                        }
                    });
                    if (!find_file) {
                        $http.post('/editfilename', {
                            file_name: $scope.file_name,
                            edit_file_name: temp_file_name
                        }).then(function(response) {
                            $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
                                $gamiEvent.createSnackbar($scope.edit_file_name + '\'s name is changed!');
                                $scope.file_name = temp_file_name;
                                $scope.file_tree = '/create_file_tree?time=' + (new Date()).getTime();
                                $scope.url = '/index.html?uid=' + _result_user_data.uid + '&time=' + (new Date()).getTime();
                            });
                        });
                    } else {
                        $gamiEvent.look_at_where('Code', function(_err, _result_user_data) {
                            $gamiEvent.createSnackbar($scope.edit_file_name + ' is existed!');
                            $scope.file_name = temp_file_name;
                            $scope.file_tree = '/create_file_tree?time=' + (new Date()).getTime();
                            $scope.url = '/index.html?uid=' + _result_user_data.uid + '&time=' + (new Date()).getTime();
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
            $http.post('/destroyfile', {
                file_name: $scope.file_name
            }).then(function(response) {
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
                    $scope.file_tree = '/create_file_tree?time=' + (new Date()).getTime();
                    $scope.url = '/index.html?uid=' + _result_user_data.uid + '&time=' + (new Date()).getTime();
                });
            });
        }
    };

    $scope.savefile = function() {
        if (!$scope.saveover && !!$scope.code_mode && !!$scope.cmModel) {
            $scope.saveover = true;
            $http.post('/savefile', {
                file_name: $scope.file_name,
                content: escape($scope.cmModel)
            }).then(function(response) {
                if (response) {
                    $gamiEvent.gamer('/getGamer/', function(_err, _gamer) {
                        $gamiEvent.createSnackbar($scope.edit_file_name + ' saved!');
                        $scope.saveover = false;
                        $scope.url = '/index.html?uid=' + _gamer.uid + '&time=' + (new Date()).getTime();
                    });
                }
            });
        }
    };

    $scope.buildfile = function() {
        $gamiEvent.MODEL_CONFIG.templateUrl = '/template/terminal.html';
        $gamiEvent.MODEL_CONFIG.controller = 'TerminalCtrl';
        $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
    };
}]);
