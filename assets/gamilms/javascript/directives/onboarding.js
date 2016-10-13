angular.module('gamilms_directives')
    .directive('onboarding', ['$rootScope', '$compile', '$gamiEvent', '$uibPosition', function($rootScope, $compile, $gamiEvent, $uibPosition) {
        return function(scope, element, attrs) {
            $rootScope.$on('createOnboarding', function(event, received) {
                if ($gamiEvent.ONBOARDING_QUEUE.length > 0 && $gamiEvent.ONBOARDING_QUEUE[0].command === attrs.onboarding) {
                    $rootScope.$broadcast('open_onboarding', {
                        information: $gamiEvent.ONBOARDING_QUEUE[0].content,
                        position: $uibPosition.position(angular.element(element))
                    });
                }
            });
        };
    }]);
