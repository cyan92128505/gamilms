angular.module('gamilms_directives')
    .directive("phaserTutorial", ["$rootScope", "$compile", "$timeout", "$gamiEvent", function($rootScope, $compile, $timeout, $gamiEvent) {
        return {
            restrict: 'E',
            link: function(tScope, tAttr, tElement) {
                var htmlText = '';
                var steps = [];
                for (var i = 0; i < steps.length; i++) {
                    switch (steps[i].type) {
                        case 'text':
                            htmlText = htmlText + '<h3>' + steps[i].content + '</h3>';
                            break;
                        case 'code':
                            htmlText = htmlText + steps[i].content.map(function(element) {
                                return '<code>' + element + '</code><br/>';
                            }).join('');
                            break;
                        default:
                            htmlText = htmlText + '';
                    }
                    if ((i + 1) === steps.length) {
                        tElement.replaceWith(htmlText);
                    }
                }
            }
        };
    }]);
