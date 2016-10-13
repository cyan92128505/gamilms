angular.module('gamilms_controller')
    .controller('TutorCtrl', ['$scope', '$uibModalInstance', '$gamiEvent', function($scope, $uibModalInstance, $gamiEvent) {
        var tutor_data = [{
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_profile_btn.png",
            "tutor_info": "點擊個人資訊頁面按鈕，能連結到個人頁面"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_profile_avatar.png",
            "tutor_info": "個人資訊頁面裡的基本資訊欄"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_profile_badge.png",
            "tutor_info": "在獎章欄中能知道，能知道目前所獲得的獎章"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_profile_progress.png",
            "tutor_info": "在進度欄中，能知道目前獲得的點數"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_profile_log.png",
            "tutor_info": "在紀錄欄中，能知道看過了哪些頁面"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_profile_start.png",
            "tutor_info": "點擊這裡開始您的學習"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_code_btn.png",
            "tutor_info": "點擊學習環境頁面按鈕，能連結到學習環境頁面"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_code_progress.png",
            "tutor_info": "在課程等級欄中，能夠知道目前的課程進度"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_code_jump.png",
            "tutor_info": "點擊已通過之課程，能夠進行複習"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_code_title.png",
            "tutor_info": "這是課程名稱"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_code_subject.png",
            "tutor_info": "在課程內容欄中，進行學習"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_code_editor.png",
            "tutor_info": "在程式編輯區，能修改程式碼，來測試遊戲"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_code_game.png",
            "tutor_info": "在遊戲測試區，點擊後能夠測試課程中的遊戲"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_leaderboard_btn.png",
            "tutor_info": "點擊排行榜頁面按鈕，能連結到排行榜頁面"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_leaderboard.png",
            "tutor_info": "在排行榜頁面中，能知道自己與他人的學習狀況，點擊人物項目後能夠連結到其他人的個人資訊頁面"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_badge_btn.png",
            "tutor_info": "點擊獎章成就頁面按鈕，能連結到獎章成就頁面"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_badge.png",
            "tutor_info": "在獎章成就頁面，能夠知道自己還有多少成就還沒有獲得"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_about_btn.png",
            "tutor_info": "點擊關於頁面按鈕，能連結到關於頁面"
        }, {
            "tutor_img": $gamiEvent.project_name + "/images/tutor/tutor_gamilms_logout_btn.png",
            "tutor_info": "這是登出按鈕"
        }];
        $scope.tutor_index = 0;
        $scope.tutor_img = tutor_data[$scope.tutor_index].tutor_img;
        $scope.tutor_info = tutor_data[$scope.tutor_index].tutor_info;
        $scope.ok = function() {
            console.log($scope.tutor_index);
            switch (true) {
                case ($scope.tutor_index === 0):
                    $scope.tutor_index = $scope.tutor_index + 1;
                    break;
                case ($scope.tutor_index > 0 && $scope.tutor_index < tutor_data.length - 1):
                    $scope.tutor_index = $scope.tutor_index + 1;
                    break;
                case (($scope.tutor_index + 1) === tutor_data.length):
                    $gamiEvent.update_badge('tutorial_finish', function() {});
                    $uibModalInstance.close({
                        state: 'ok'
                    });
                    break;
                default:
            }
            $scope.tutor_img = tutor_data[$scope.tutor_index].tutor_img;
            $scope.tutor_info = tutor_data[$scope.tutor_index].tutor_info;
        };
        $scope.close = function() {
            console.log($scope.tutor_index);
            switch (true) {
                case ($scope.tutor_index === 0):
                    $scope.tutor_index = $scope.tutor_index;
                    break;
                case ($scope.tutor_index > 0 && $scope.tutor_index < tutor_data.length):
                    $scope.tutor_index = $scope.tutor_index - 1;
                    break;
                case (($scope.tutor_index + 1) === tutor_data.length):
                    $scope.tutor_index = $scope.tutor_index - 1;
                    break;
                default:
            }
            $scope.tutor_img = tutor_data[$scope.tutor_index].tutor_img;
            $scope.tutor_info = tutor_data[$scope.tutor_index].tutor_info;
        };
    }]);
