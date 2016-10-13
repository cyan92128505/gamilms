angular.module('application', [
        'ngSanitize',
        'ngMaterial',
        'ui.bootstrap',
        'ui.router',
        'angular-loading-bar',
        'ivoMarkdown',
        'gamilms_factory',
        'gamilms_directives',
        'gamilms_profile',
        'gamilms_video',
        'gamilms_code',
        'gamilms_subject',
        'gamilms_leaderboard',
        'gamilms_badge',
        'gamilms_about',
        'gamilms_controller'
    ])
    .config(['$stateProvider', '$urlRouterProvider', 'ivoMarkdownConfigProvider', function($stateProvider, $urlRouterProvider, ivoMarkdownConfigProvider) {
        //http://www.funnyant.com/angularjs-ui-router/
        //Angular路由深入淺出 http://div.io/topic/1096
        $urlRouterProvider.otherwise(project_name + '/profile/' + gamilms_uid);
        $stateProvider
            .state('profile', {
                url: project_name + '/profile/:uid',
                views: {
                    'content_left': {
                        templateUrl: project_name + '/profile',
                        controller: 'ProfileCtrl'
                    },
                    'content_right': {
                        templateUrl: project_name + '/hide'
                    }
                }
            })
            .state('leaderboard', {
                url: project_name + '/leaderboard',
                views: {
                    'content_left': {
                        templateUrl: project_name + '/leaderboard',
                        controller: 'LeaderboardCtrl'
                    },
                    'content_right': {
                        templateUrl: project_name + '/hide'
                    }
                }
            })
            .state('badge', {
                url: project_name + '/badge',
                views: {
                    'content_left': {
                        templateUrl: project_name + '/badge',
                        controller: 'BadgeCtrl'
                    },
                    'content_right': {
                        templateUrl: project_name + '/hide'
                    }
                }
            })
            .state('about', {
                url: project_name + '/about',
                views: {
                    'content_left': {
                        templateUrl: project_name + '/about',
                        controller: 'AboutCtrl'
                    },
                    'content_right': {
                        templateUrl: project_name + '/hide'
                    }
                }
            })
            .state('subject', {
                url: project_name + '/subject',
                views: {
                    'content_left': {
                        templateUrl: project_name + '/subject',
                        controller: 'SubjectCtrl'
                    },
                    'content_right': {
                        templateUrl: project_name + '/hide'
                    }
                }
            })
            .state('video', {
                url: project_name + '/video/:vid',
                views: {
                    'content_left': {
                        templateUrl: project_name + '/video',
                        controller: 'VideoCtrl'
                    },
                    'content_right': {
                        templateUrl: project_name + '/hide'
                    }
                }
            })
            .state('code', {
                url: project_name + '/code/',
                views: {
                    'content_left': {
                        templateUrl: project_name + '/code',
                        controller: 'CodeCtrl'
                    },
                    'content_right': {
                        templateUrl: project_name + '/hide'
                    }
                }
            });
        ivoMarkdownConfigProvider.config({
            tables: true,
            parseImgDimensions: true,
            tasklists: true,
            smoothLivePreview: true,
            strikethrough: true,
            omitExtraWLInCodeBlocks: true
        });
        ivoMarkdownConfigProvider.hljsOptions({
            tabreplace: '    ',
            languages: ['javascript']
        });

    }])
    .run(['$rootScope', '$state', '$stateParams', '$gamiEvent', function($rootScope, $state, $stateParams, $gamiEvent) {
        $gamiEvent.gamer('/getGamer', function(err, result) {
            if (!result.onboarding_over) {
                $gamiEvent.ONBOARDING_QUEUE = result.term;
            }
            $stateParams.uid = result.uid;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        });

    }])
    .controller('userCtrl', ['$scope', '$rootScope', '$state', '$window', '$location', '$gamiEvent', '$uibPosition', '$timeout', function($scope, $rootScope, $state, $window, $location, $gamiEvent, $uibPosition, $timeout) {
        $scope.onboarding_info = false;
        $scope.onboarding_info_text = 'test!';
        $scope.onboarding_style = {
            "position": "fixed",
            "z-index": "9999",
            "cursor": "pointer",
            "color": "#fff",
            "background-color": "#000",
            "box-shadow": "0 0 0 100vmax rgba(0, 0, 0, 0.5)",
            "font-size": "12em"
        };
        $scope.trigger_tooltip_step = false;
        $rootScope.$on('trigger_tooltip', function(event, received) {
            $scope.trigger_tooltip_step = true;
        });
        $gamiEvent.gamer('/getGamer', function(err, result) {
            // $gamiEvent.createOnboarding();
            $scope.focus_subject = true;
            $scope.app_loader = false;
            $scope.username = result.username;
            $scope.profile_img = 'http://graph.facebook.com/' + result.uid + '/picture?type=large&width=32&height=32';
            $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/logo.html';
            $gamiEvent.MODEL_CONFIG.controller = 'LogoCtrl';
            $rootScope.$broadcast('set_step_trigger_false');
            $gamiEvent.open_logo_modal($gamiEvent.MODEL_CONFIG).result.then(function(newChangeReturn) {
                if (newChangeReturn.state === 'close') {
                    $scope.trigger_tooltip_step = true;
                    $rootScope.$broadcast('set_step_trigger_true');
                } else {
                    $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/tutor.html';
                    $gamiEvent.MODEL_CONFIG.controller = 'TutorCtrl';
                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG).result.then(function(Return) {
                        $scope.trigger_tooltip_step = true;
                        $rootScope.$broadcast('set_step_trigger_true');
                        $scope.ui_sref({
                            url: 'profile',
                            params: {
                                uid: gamilms_uid
                            }
                        });
                    });
                }
            });
        });
        $scope.project_name = /[a-zA-Z]+/.exec(project_name)[0];
        $scope.ui_sref = function(option) {
            if ($gamiEvent.ONBOARDING_QUEUE.length === parseInt('0', 10)) {
                switch (true) {
                    case (!!option.params && (option.params.uid === gamilms_uid)):
                        $gamiEvent.update_badge('view_profile', function() {});
                    break;
                    case (/leaderboard/.test(option.url)):
                        $gamiEvent.update_badge('leaderboard', function() {});
                    break;
                    case (/badge/.test(option.url)):
                        $gamiEvent.update_badge('check_badge_info', function() {});
                    break;
                    case (/about/.test(option.url)):
                        $gamiEvent.update_badge('view_about', function() {});
                    break;
                    default:

                }
                $state.go(option.url, option.params);
            }
        };
        $scope.get_link = function(url) {
            if ($gamiEvent.ONBOARDING_QUEUE.length === parseInt('0', 10)) {
                if (/logout/.test(url)) {
                    $gamiEvent.update_badge('first_logout', function() {});
                }
                window.location.replace($location.protocol() + '://' + $location.host() + url);
            }
        };
        $scope.close_onboarding = function() {
            $scope.onboarding_info = false;
            $gamiEvent.ONBOARDING_QUEUE.shift();
            if ($gamiEvent.ONBOARDING_QUEUE.length === 0) {
                $rootScope.$broadcast('trigger_tooltip');
                $rootScope.$broadcast('set_step_trigger_true');
            } else {
                $gamiEvent.createOnboarding();
            }
        };
        $rootScope.$on('open_onboarding', function(event, received) {
            $scope.onboarding_info = true;
            $scope.onboarding_info_text = received.information;
            $scope.onboarding_style = {
                "position": "fixed",
                "z-index": "9999",
                "cursor": "pointer",
                "color": "#92a8d1",
                "background-color": "rgba(0, 0, 0, 0)",
                "box-shadow": "0 0 0 100vmax rgba(0, 0, 0, 0.5)",
                "font-size": "1em",
                "width": received.position.width,
                "height": received.position.height,
                "top": received.position.top,
                "left": received.position.left
            };
            console.log(received);
        });
    }]);
