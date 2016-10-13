angular.module('gamilms', [
        'ui.bootstrap',
        'ui.router',
        'angular-loading-bar',
        'gamilms_profile',
        'gamilms_video',
        'gamilms_code',
        'gamilms_subject',
        'gamilms_leaderboard',
        'gamilms_badge',
        'gamilms_about',
        'gamilms_factory',
        'gamilms_directives',
        'gamilms_controller',
        'gamilms_terminal'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        //http://www.funnyant.com/angularjs-ui-router/
        //Angular路由深入淺出 http://div.io/topic/1096
        $urlRouterProvider.otherwise('/profile');
        $stateProvider
            .state('gamilms', {
                url: '/profile',
                views: {
                    'content_left': {
                        templateUrl: '/profile',
                        controller: 'ProfileCtrl'
                    },
                    'content_right': {
                        templateUrl: '/hide'
                    }
                }
            })
            .state('profile', {
                url: '/profile/:uid',
                views: {
                    'content_left': {
                        templateUrl: '/profile',
                        controller: 'ProfileCtrl'
                    },
                    'content_right': {
                        templateUrl: '/hide'
                    }
                }
            })
            .state('leaderboard', {
                url: '/leaderboard',
                views: {
                    'content_left': {
                        templateUrl: '/leaderboard',
                        controller: 'LeaderboardCtrl'
                    },
                    'content_right': {
                        templateUrl: '/hide'
                    }
                }
            })
            .state('badge', {
                url: '/badge',
                views: {
                    'content_left': {
                        templateUrl: '/badge',
                        controller: 'BadgeCtrl'
                    },
                    'content_right': {
                        templateUrl: '/hide'
                    }
                }
            })
            .state('about', {
                url: '/about',
                views: {
                    'content_left': {
                        templateUrl: '/about',
                        controller: 'AboutCtrl'
                    },
                    'content_right': {
                        templateUrl: '/hide'
                    }
                }
            })
            .state('subject', {
                url: '/subject',
                views: {
                    'content_left': {
                        templateUrl: '/subject',
                        controller: 'SubjectCtrl'
                    },
                    'content_right': {
                        templateUrl: '/hide'
                    }
                }
            })
            .state('video', {
                url: '/video/:vid',
                views: {
                    'content_left': {
                        templateUrl: '/video',
                        controller: 'VideoCtrl'
                    },
                    'content_right': {
                        templateUrl: '/hide'
                    }
                }
            })
            .state('code', {
                url: '/code/',
                views: {
                    'content_left': {
                        templateUrl: '/code',
                        controller: 'CodeCtrl'
                    },
                    'content_right': {
                        templateUrl: '/hide'
                    }
                }
            });
    }])
    .run(['$rootScope', '$state', '$stateParams', '$gamiEvent', function($rootScope, $state, $stateParams, $gamiEvent) {
        $gamiEvent.gamer('/getGamer',function(err, result){
            console.log(result);
            if(!result.onboarding_over){
                $gamiEvent.ONBOARDING_QUEUE = result.term;
            }
            $stateParams.uid = result.uid;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        });

    }])
    .controller('userCtrl',['$scope','$gamiEvent',function($scope, $gamiEvent){
        $gamiEvent.gamer('/getGamer',function(err, result){
            $gamiEvent.createOnboarding();
            $scope.focus_subject = true;
            $scope.app_loader = false;
            $scope.username = result.username;
            $scope.profile_img = 'http://graph.facebook.com/'+result.uid+'/picture?type=large&width=32&height=32'
        });
    }]);
