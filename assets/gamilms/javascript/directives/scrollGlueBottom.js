angular.module('gamilms_directives')
    .directive('scrollGlueBottom', ['$parse', '$window', '$timeout', function($parse, $window, $timeout) {
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
    }]);
