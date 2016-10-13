angular.module('gamilms_factory', [])
    // .factory("snackbar", ['$rootScope', function($rootScope) {
    //     /*
    //     	@license Angular Snackbar version 1.0.1
    //     	ⓒ 2015 AHN JAE-HA http://github.com/eu81273/angular.snackbar
    //     	License: MIT
    //     	<div class="snackbar-container" data-snackbar="true" data-snackbar-duration="3000" data-snackbar-remove-delay="200"></div>
    //     */
    //     return {
    //         create: function(content, duration) {
    //             $rootScope.$broadcast('createSnackbar', {
    //                 'content': content,
    //                 'duration': duration
    //             });
    //         }
    //     }
    // }])
    // .factory('onboarding',['$rootScope',function($rootScope){
    //     return {
    //         create: function(content, duration){
    //             $rootScope.$broadcast('createOnboarding', {
    //                 'content': content,
    //                 'duration': duration
    //             });
    //         }
    //     }
    // }])
    .factory('$gamiEvent', ['$rootScope', '$http', '$uibModal', function($rootScope, $http, $uibModal) {
        var MODEL_CONFIG = {
            animation: true,
            controller: 'InstanceCtrl',
            templateUrl: '/template/challenge.html',
            size: 'lg',
            backdrop: 'static'
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
        var GAMIEVENT = {
            test: function() {
                $http.get('/getleaderboard').then(function(_response) {
                    console.log(_response);
                });
            },
            icons_path: function(callback) {
                $http.get('/get_icons_path').then(function(response) {
                    console.log(response);
                    return callback(null, response.data);
                });
            },
            add_one: function() {
                gaminum++;
                console.log(gaminum);
            },
            look_at_where: function(_url, _callback) {
                var gamer_uid = _url;
                if (!gamer_uid) {
                    this.gamer('/getGamer', function(_err, _result) {
                        _callback(false, _result);
                    });
                }
                $http.post('/look_at_where', {
                    look_at: _url
                }).then(function(look_at_where_response) {
                    USER_DATA = look_at_where_response.data;
                    console.log('look_at_where response data:');
                    console.log(USER_DATA);
                    _callback(false, look_at_where_response.data);
                }, function(error_response) {
                    console.log(error_response);
                });
            },
            gaminum: function() {
                return gaminum;
            },
            build_app: function(_callback) {
                $http.get('/build_app').then(_callback);
            },
            gamer: function(_url, _callback) {
                $http.get(_url).then(function(_response) {
                    _callback(false, _response.data);
                })
            },
            gamipost: function(option, callback) {
                $http.post(option.url, option.data).then(function(result) {
                    callback(null, result);
                }, function(err) {
                    callback(true, err);
                });
            },
            createOnboarding: function(){
                $rootScope.$broadcast('createOnboarding');
            },
            createSnackbar: function(content, duration) {
                $rootScope.$broadcast('createSnackbar', {
                    'content': content,
                    'duration': duration
                });
            },
            open_modal: $uibModal.open,
            LOOK_AT: LOOK_AT,
            USER_DATA: USER_DATA,
            TERMINAL_OUTPUT_CACHE: TERMINAL_OUTPUT_CACHE,
            MODEL_CONFIG: MODEL_CONFIG,
            ONBOARDING_QUEUE: ONBOARDING_QUEUE
        };
        return GAMIEVENT;
    }])
    .factory("fileReader", ["$q", "$log", function($q, $log) {
        var onLoad = function(reader, deferred, scope) {
            return function() {
                scope.$apply(function() {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function(reader, deferred, scope) {
            return function() {
                scope.$apply(function() {
                    deferred.reject(reader.result);
                });
            };
        };

        var onProgress = function(reader, scope) {
            return function(event) {
                scope.$broadcast("fileProgress", {
                    total: event.total,
                    loaded: event.loaded
                });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsDataURL = function(file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    }]);
