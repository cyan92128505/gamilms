angular.module('gamilms_directives')
    .directive('countTo', ['$rootScope','$timeout', function($rootScope, $timeout) {
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

                    console.log(countTo);

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

                $rootScope.$on('start_to_count',function(){
                    // start();
                });

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

    }]);
