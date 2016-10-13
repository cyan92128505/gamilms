angular.module('gamilms_controller')
    .controller('TerminalCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', '$timeout', function($scope, $uibModalInstance, $gamiEvent, $timeout) {
        var getKeyboardEventResult = function(keyEvent, keyEventDesc) {
            return keyEventDesc + " (keyCode: " + (window.event ? keyEvent.keyCode : keyEvent.which) + ")";
        };
        $scope.corrent_path = ['root'];
        $scope.terminal_path = ['root'];
        $scope.command_array = [];
        $scope.command_array_point = parseInt('0', 10);
        var home_path = "~";
        $gamiEvent.gamer('/getGamer/', function(_err, _response) {
            $scope.user_name = _response.username + '@gamilms:' + home_path + '$';
        });

        $scope.terminal_input = true;
        $scope.glued = true;
        $scope.outputs = [];


        //http://www.kammerl.de/ascii/AsciiSignature.php
        $scope.command_temp = $gamiEvent.command('wellcome');
        $scope.push_command = function(_command) {
            var command = _command || false;
            $scope.terminal_input = false;
            var array_temp = [];
            var command_time = function() {
                $timeout(function() {
                    var _temp = $scope.command_temp.shift();
                    if (_temp.type === 'command') {
                        _temp['user_name'] = $scope.user_name;
                    } else {
                        _temp['user_name'] = '';
                    }
                    $scope.outputs.push(_temp);
                    if ($scope.command_temp.length > 0) {
                        $scope.push_command();
                    } else {
                        $scope.terminal_input = true;
                    }
                }, 100);
            };
            if (command) {
                switch (true) {
                    case (command === 'node -v'):
                        $scope.command_temp.push({
                            type: 'command',
                            command: command
                        });
                        $scope.command_temp.push({
                            type: 'info',
                            command: 'v5.7.1'
                        });
                        command_time();
                        break;
                    case (command === 'help'):
                        array_temp = $gamiEvent.command(command);
                        $scope.command_temp.push({
                            type: 'command',
                            command: command
                        });
                        array_temp.map(function(element, index, list) {
                            $scope.command_temp.push(element);
                        });
                        command_time();
                        break;
                    case (command === 'ionic start -a "Ionic Book Store" -i app.bookstore.ionic book-store sidemenu'):
                        array_temp = $gamiEvent.command('create_project');
                        $scope.command_temp.push({
                            type: 'command',
                            command: command
                        });
                        $gamiEvent.gamer('/create_project', function(err, result) {
                            array_temp.map(function(element, index, list) {
                                $scope.command_temp.push(element);
                            });
                        });
                        command_time();
                        break;
                    case (command === 'ionic serve'):
                        var temp_regex = 'serve ';
                        $scope.command_temp.push({
                            type: 'command',
                            command: command
                        });
                        $scope.command_temp.push({
                            type: 'info',
                            command: temp_regex
                        });
                        command_time();
                        break;
                    case (command === 'ionic platform android'):
                        var temp_regex = 'platform ';
                        $scope.command_temp.push({
                            type: 'command',
                            command: command
                        });
                        $scope.command_temp.push({
                            type: 'info',
                            command: temp_regex
                        });
                        command_time();
                        break;
                    case (command === 'ionic build android'):
                        $gamiEvent.build_app(function(_result) {
                            var result_array = _result.data;
                            $scope.command_temp.push({
                                type: 'command',
                                command: command
                            });
                            result_array.map(function(element, index, list) {
                                $scope.command_temp.push({
                                    type: 'info',
                                    command: element
                                });
                                if ((index + 1) === list.length) {
                                    command_time();
                                }
                            });
                        });
                        break;
                    case /^ionic platform /.test(command):
                        var temp_regex = command.split('ionic platform ', '');
                        $scope.command_temp.push({
                            type: 'command',
                            command: command
                        });
                        $scope.command_temp.push({
                            type: 'info',
                            command: 'platform don\'t support ' + temp_regex
                        });
                        command_time();
                        break;
                    case /^ionic build /.test(command):
                        var temp_regex = command.split('ionic build ', '');
                        $scope.command_temp.push({
                            type: 'command',
                            command: command
                        });
                        $scope.command_temp.push({
                            type: 'info',
                            command: 'build don\'t support ' + temp_regex
                        });
                        command_time();
                        break;
                        // case command === 'ls':
                        //     $gamiEvent.look_at_where('Code', function(err, code_result) {
                        //         var command_string = '';
                        //         traverse(code_result.file_tree).forEach(function(node) {
                        //             if (!!node && !!(node['node_name'] === terminal_path[terminal_path.length - 1]) && (this.level === (terminal_path.length * 2 - 1))) {
                        //                 for (child in node.child_list) {
                        //                     command_string = command_string + ' ' + child;
                        //                 }
                        //             }
                        //         });
                        //         $scope.command_temp.push({
                        //             type: 'command',
                        //             command: command
                        //         });
                        //         $scope.command_temp.push({
                        //             type: 'info',
                        //             command: command_string
                        //         });
                        //         command_time();
                        //     });
                        //     break;
                        // case /^cd\s[\w\W]+/.test(command):
                        //     $gamiEvent.look_at_where('Code', function(err, code_result) {
                        //         var cd_folder = command.split(/\s/)[1];
                        //         var temp_path = [];
                        //         if(/\//.test(cd_folder)){
                        //             temp_path = cd_folder.split('/');
                        //             temp_path[0] =
                        //         }
                        //         traverse(code_result.file_tree).forEach(function(node) {
                        //             if (!!node && !!(node['node_name'] === terminal_path[terminal_path.length - 1]) && (this.level === (terminal_path.length * 2 - 1))) {
                        //                 for (child in node.child_list) {
                        //                     if ((node.child_list[child].type === 'folder') && (child === cd_folder)) {
                        //
                        //
                        //                         $scope.user_name = _response.username + '@gamilms:' + home_path + node.organ_url + '$';
                        //
                        //                     }
                        //                 }
                        //             }
                        //         });
                        //         $scope.command_temp.push({
                        //             type: 'command',
                        //             command: command
                        //         });
                        //         $scope.command_temp.push({
                        //             type: 'info',
                        //             command: command_string
                        //         });
                        //         command_time();
                        //     });
                        //     break;
                    case command === '':
                        break;
                    default:
                        $scope.command_temp.push({
                            type: 'command',
                            command: command
                        });
                        $scope.command_temp.push({
                            type: 'info',
                            command: command + ' ：無此指令'
                        });
                        command_time();
                        break;
                }
            } else {
                command_time();
            }
        };




        $scope.onKeyPress = function($event) {
            switch (true) {
                //按鍵ENTER
                case ($event.keyCode == 13 && $scope.terminal_input == true):
                    if ($scope.command !== '') {
                        $scope.command_array_point = parseInt('0', 10);
                        if ($scope.command_array[0] !== $scope.command) {
                            $scope.command_array.unshift($scope.command);
                        }
                        $scope.push_command($scope.command);
                        $scope.command = '';
                    } else {
                        $scope.push_command(' ');
                        $scope.command = '';
                    }
                    break;
                    //按鍵向上
                case ($event.keyCode == 38 && $scope.terminal_input == true):
                    if ($scope.command_array && $scope.command_array_point >= parseInt('0', 10)) {
                        $scope.command = $scope.command_array[$scope.command_array_point];
                        if ($scope.command_array_point < $scope.command_array.length - 1) {
                            $scope.command_array_point = $scope.command_array_point + 1;
                        }
                    }
                    break;
                    //按鍵向下
                case ($event.keyCode == 40 && $scope.terminal_input == true):
                    if ($scope.command_array && $scope.command_array_point > parseInt('0', 10)) {
                        if ($scope.command_array_point !== parseInt('0', 10)) {
                            $scope.command_array_point = $scope.command_array_point - 1;
                        }
                        $scope.command = $scope.command_array[$scope.command_array_point];
                    }
                    break;
                default:

            }
        };

        $scope.turn_input = function() {
            $scope.terminal_input = true;
        };

        $scope.close = function() {
            $uibModalInstance.close('finish');
        };
        $scope.push_command();
    }]);
