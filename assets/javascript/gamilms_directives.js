angular.module('gamilms_directives', [])
    .directive('gamiUnit', ['$gamiEvent', function($gamiEvent) {
        return {
            restrict: 'AE',
            // scope:{
            //     $uibModalInstance: '&'
            // },
            link: function($scope, $element, $attr) {

                //$element.context.textContent = $gamiEvent.gaminum();
                $scope.gamiEmit = function() {
                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                };
                $scope.badge_info = function(index){
                    console.log($attr);
                    $gamiEvent.CHALLENGE_INFO = {
                        challenge_title: $attr.badgeName,
                        challenge_content: $attr.badgeName,
                        challenge_img: $attr.badgeUrl
                    };
                    $gamiEvent.MODEL_CONFIG.templateUrl = '/template/challenge.html';
                    $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                };
                $scope.gamiEmit_badge = function(_badge) {
                    var temp_badge_info = '';

                    $gamiEvent.CHALLENGE_INFO = {
                        challenge_title: _badge.name,
                        challenge_content: _badge.value + '次' + _badge.name,
                        challenge_img: _badge.image
                    };
                    $gamiEvent.MODEL_CONFIG.templateUrl = '/template/challenge.html';
                    $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                };
                $scope.gamiEmit_log = function(_log) {
                    $gamiEvent.CHALLENGE_INFO = {
                        challenge_title: _log.event_name,
                        challenge_content: _log.timestamp + '時取得！',
                        challenge_img: _log.image
                    };
                    $gamiEvent.MODEL_CONFIG.templateUrl = '/template/challenge.html';
                    $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                };
                // console.log($gamiEvent);
                // console.log('gami-unit');
                // console.log($scope);
                // console.log($element);
                // console.log($attr);
            }
        };
    }])
    .directive('countTo', ['$timeout', function($timeout) {
        return {
            replace: false,
            scope: true,
            link: function(scope, element, attrs) {

                var e = element[0];
                var num, refreshInterval, duration, steps, step, countTo, value, increment;

                var calculate = function() {
                    refreshInterval = 30;
                    step = 0;
                    scope.timoutId = null;
                    content_before = attrs.contentBefore || '';
                    content_after = attrs.contentAfter || '';
                    content_finish = attrs.contentFinish || false;
                    countTo = parseInt(attrs.countTo) || 0;
                    scope.value = parseInt(attrs.value, 10) || 0;
                    duration = (parseFloat(attrs.duration) * 1000) || 0;

                    steps = Math.ceil(duration / refreshInterval);
                    increment = ((countTo - scope.value) / steps);
                    num = scope.value;
                }

                var tick = function() {
                    scope.timoutId = $timeout(function() {
                        num += increment;
                        step++;
                        if (step === steps) {
                            num = countTo;
                            e.textContent = content_before + countTo + content_after;
                            tick();
                        } else {
                            e.textContent = content_before + Math.round(num) + content_after;
                            tick();
                        }
                        if (step === (steps + 1)) {
                            $timeout.cancel(scope.timoutId);
                            num = countTo;
                            if (!content_finish) {
                                e.textContent = countTo;
                            } else {
                                e.textContent = content_finish;
                            }
                        }
                    }, refreshInterval);

                }

                var start = function() {
                    if (scope.timoutId) {
                        $timeout.cancel(scope.timoutId);
                    }
                    calculate();
                    tick();
                }

                attrs.$observe('countTo', function(val) {
                    if (val) {
                        start();
                    }
                });
                attrs.$observe('value', function(val) {
                    start();
                });
                return true;
            }
        }

    }])
    .directive("snackbar", ["$rootScope", "$compile", "$timeout", function($rootScope, $compile, $timeout) {
        return function(scope, element, attrs) {
            var snackbarContainer = angular.element(element);
            var snackbarDuration = attrs.snackbarDuration || 3000;
            var snackbarRemoveDelay = attrs.snackbarRemoveDelay || 200;

            $rootScope.$on('createSnackbar', function(event, received) {
                var template = '<div class=\"snackbar snackbar-opened\"><span class=\"snackbar-content\">' +
                    received.content +
                    '</span></div>';
                // var template =
                //     '<div class=\"notif notif--success notif_open\"> <div class=\"notif__content\"><i class=\"material-icons notif__icon\">check</i> <div> <h1 class=\"notif__title\">'+
                //     received.content +
                //     '</h1><span class=\"notif__subtitle\">Woohoo!</span> </div> </div> <div class=\"notif__actions\"> <a href=\"#\" data-tooltip=\"Get link\" class=\"notif__action\"><i class=\"material-icons\">link</i></a> </div> </div>';
                var snackbar_element = angular.element($compile(template)(scope));
                snackbarContainer.append(snackbar_element);
                $timeout(function() {
                    snackbar_element.removeClass('snackbar-opened');
                    // snackbar.removeClass("notif_open");
                    $timeout(function() {
                        snackbar_element.remove();
                    }, snackbarRemoveDelay, false);
                }, received.duration || snackbarDuration, false);
            });
        };
    }])
    .directive('onboarding', ['$rootScope', '$compile', '$gamiEvent', function($rootScope, $compile, $gamiEvent) {
        return function(scope, element, attrs) {
            var onboardingContainer = angular.element(element);
            $rootScope.$on('createOnboarding', function(event, received) {
                if ($gamiEvent.ONBOARDING_QUEUE.length > 0 && $gamiEvent.ONBOARDING_QUEUE[0].command === attrs.onboarding) {
                    var template = '<div class="" ng-click="close()">' + $gamiEvent.ONBOARDING_QUEUE[0].content + '</div>';
                    var onboarding = angular.element($compile(template)(scope));
                    onboardingContainer.append(onboarding);
                    onboardingContainer.addClass('onboarding_item');
                    scope.close = function() {
                        $gamiEvent.ONBOARDING_QUEUE.shift();
                        if ($gamiEvent.ONBOARDING_QUEUE.length === 0) {
                            // $gamiEvent.gamipost({
                            //     url: '/onboarding_over',
                            //     data: {
                            //         onboarding_over: true
                            //     }
                            // }, function(err, result) {
                            //     console.log(result);
                            // });
                            onboardingContainer.removeClass('onboarding_item');
                            onboarding.remove();
                        } else {
                            $gamiEvent.createOnboarding();
                            onboardingContainer.removeClass('onboarding_item');
                            onboarding.remove();
                        }
                    };
                }
            });
        };
    }])
    .directive('focusMe', ['$timeout', '$parse', function($timeout, $parse) {
        //terminal input focus
        return {
            link: function(scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function(value) {
                    if (value === true) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
                element.bind('blur', function() {
                    scope.$apply(model.assign(scope, false));
                })
            }
        };
    }]).directive('scrollGlueBottom', ['$parse', '$window', '$timeout', function($parse, $window, $timeout) {
        //alert call
        return {
            priority: 1,
            restrict: 'A',
            link: function(scope, $el, attrs) {
                var direction = {
                    isAttached: function(el) {
                        // + 1 catches off by one errors in chrome
                        return el.scrollTop + el.clientHeight + 1 >= el.scrollHeight;
                    },
                    scroll: function(el) {
                        el.scrollTop = el.scrollHeight;
                    }
                }

                function createActivationState($parse, attr, scope) {
                    function unboundState(initValue) {
                        var activated = initValue;
                        return {
                            getValue: function() {
                                return activated;
                            },
                            setValue: function(value) {
                                activated = value;
                            }
                        };
                    }

                    function oneWayBindingState(getter, scope) {
                        return {
                            getValue: function() {
                                return getter(scope);
                            },
                            setValue: function() {}
                        }
                    }

                    function twoWayBindingState(getter, setter, scope) {
                        return {
                            getValue: function() {
                                return getter(scope);
                            },
                            setValue: function(value) {
                                if (value !== getter(scope)) {
                                    scope.$apply(function() {
                                        setter(scope, value);
                                    });
                                }
                            }
                        };
                    }

                    if (attr !== "") {
                        var getter = $parse(attr);
                        if (getter.assign !== undefined) {
                            return twoWayBindingState(getter, getter.assign, scope);
                        } else {
                            return oneWayBindingState(getter, scope);
                        }
                    } else {
                        return unboundState(true);
                    }
                }

                var el = $el[0],
                    activationState = createActivationState($parse, attrs['scrollGlueBottom'], scope);

                function scrollIfGlued() {
                    if (activationState.getValue() && !direction.isAttached(el)) {
                        direction.scroll(el);
                    }
                }

                function onScroll() {
                    activationState.setValue(direction.isAttached(el));
                }

                scope.$watch(scrollIfGlued);
                $timeout(scrollIfGlued, 0, false);
                $window.addEventListener('resize', scrollIfGlued, false);
                $el.bind('scroll', onScroll);


                // Remove listeners on directive destroy
                $el.on('$destroy', function() {
                    $el.unbind('scroll', onScroll);
                });
                scope.$on('$destroy', function() {
                    $window.removeEventListener('resize', scrollIfGlued, false);
                });
            }
        };
    }])
    .directive("ngFileSelect", function() {
        return {
            link: function($scope, el) {
                el.bind("change", function(e) {
                    $scope.file = (e.srcElement || e.target).files[0];
                    $scope.getFile();
                })
            }
        }
    });
