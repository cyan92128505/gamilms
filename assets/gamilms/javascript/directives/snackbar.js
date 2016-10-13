angular.module('gamilms_directives')
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
    }]);
