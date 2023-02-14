angular.module('gamilms_controller')
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
                    $scope.file_content = $gamiEvent.escape('console.log(\'hello world!\');');
                    $scope.img_view = false;
                    break;
                case 'css':
                    $scope.file_type_url = '/css/';
                    $scope.file_content = $gamiEvent.escape('/* Empty. Add your own CSS if you like */');
                    $scope.img_view = false;
                    break;
                case 'html':
                    $scope.file_type_url = '/templates/';
                    $scope.file_content = $gamiEvent.escape('<h1>hello world</h1>');
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
                $gamiEvent.gamer('/node_file_tree', function(node_file_tree) {
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
//                 $scope.file_content = $gamiEvent.escape('console.log(\'hello world!\');');
//                 $scope.img_view = false;
//                 break;
//             case 'css':
//                 $scope.file_type_url = '/css/';
//                 $scope.file_content = $gamiEvent.escape('/* Empty. Add your own CSS if you like */');
//                 $scope.img_view = false;
//                 break;
//             case 'html':
//                 $scope.file_type_url = '/templates/';
//                 $scope.file_content = $gamiEvent.escape('<h1>hello world</h1>');
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
