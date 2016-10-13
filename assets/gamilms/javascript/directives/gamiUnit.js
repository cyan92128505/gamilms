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
                $scope.badge_info = function(index) {
                    $gamiEvent.CHALLENGE_INFO = {
                        challenge_title: $attr.badgeName,
                        challenge_content: $attr.badgeInfo,
                        challenge_img: $attr.badgeUrl
                    };
                    $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/challenge.html';
                    $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                };
                $scope.gamiEmit_badge = function(_badge) {
                    var temp_badge_info = '';
                    $gamiEvent.update_badge('first_see_badge', function() {});

                    $gamiEvent.CHALLENGE_INFO = {
                        challenge_title: _badge.name,
                        challenge_content: '獲得' + _badge.value + '次',
                        challenge_img: _badge.image
                    };
                    $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/challenge.html';
                    $gamiEvent.MODEL_CONFIG.controller = 'ChallengeCtrl';
                    $gamiEvent.open_modal($gamiEvent.MODEL_CONFIG);
                };
                $scope.gamiEmit_log = function(_log) {
                    $gamiEvent.update_badge('first_see_loglist', function() {});

                    $gamiEvent.CHALLENGE_INFO = {
                        challenge_title: _log.event_name,
                        challenge_content: _log.timestamp,
                        challenge_img: _log.image
                    };
                    $gamiEvent.MODEL_CONFIG.templateUrl = $gamiEvent.project_name + '/template/challenge.html';
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
    }]);
