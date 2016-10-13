/**
 * svg directive
 * replace img tag with its svg content
 * adaptation from https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
 * by https://gist.github.com/luxcem/e44810ea40568025e77b
 */
angular.module('gamilms_directives')
    .directive('svg', function($http) {
        return {
            link: function(scope, element, attrs) {
                var imgId = attrs.id;
                var imgClass = attrs.class;
                var imgUrl = attrs.src;

                // Load svg content
                $http.get(imgUrl).success(function(data, status) {
                    var svg = angular.element(data);
                    for (var i = svg.length - 1; i >= 0; i--) {
                        if (svg[i].constructor.name == 'SVGSVGElement') {
                            svg = angular.element(svg[i]);
                            break;
                        }
                    }

                    if (typeof imgId !== 'undefined') {
                        svg.attr('id', imgId);
                    }

                    if (typeof imgClass !== 'undefined') {
                        svg.attr('class', imgClass);
                    }
                    // Remove invalid attributes
                    svg = svg.removeAttr('xmlns:a');
                    element.replaceWith(svg);
                });

            }
        };
    })
