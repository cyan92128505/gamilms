angular.module('gamilms_directives')
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
    }]);
