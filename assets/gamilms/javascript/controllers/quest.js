angular.module('gamilms_controller')
    .controller('QuestCtrl', ['$scope', '$location', '$anchorScroll', '$uibModalInstance', '$gamiEvent', function($scope, $location, $anchorScroll, $uibModalInstance, $gamiEvent) {
        $scope.quests = $gamiEvent.MODEL_CONFIG.quest;

        $scope.quest_answer = [];
        for (var i = 0; i < $scope.quests.length; i++) {
            $scope.quest_answer.push([]);
            for (var j = 0; j < $scope.quests[i].quest_terms.length; j++) {
                $scope.quest_answer[i].push(false);
            }
        }

        var check_answer = function check_answer() {
            var current = [];
            for (var i = 0; i < $scope.quests.length; i++) {
                current.push([]);
                for (var j = 0; j < $scope.quests[i].quest_terms.length; j++) {
                    current[i].push(0);
                    if ($scope.quest_answer[i][j] === $scope.quests[i].quest_answer[j]) {
                        current[i][j] = 1;
                    } else {
                        current[i][j] = 0;
                    }
                }
            }
            for (var i = 0; i < $scope.quest_answer.length; i++) {
                current[i] = current[i].reduce(function(previousValue, currentValue, index, array) {
                    return previousValue * currentValue;
                });
            }
            current = current.reduce(function(previousValue, currentValue, index, array) {
                return previousValue * currentValue;
            });
            return current;
        }

        $scope.answer = function() {
            $uibModalInstance.close({
                current_value: check_answer(),
                is_answer: true
            });
        };
        $scope.close = function() {
            $uibModalInstance.close({
                current_value: check_answer(),
                is_answer: false
            });
        };
    }]);
