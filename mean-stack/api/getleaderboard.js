module.exports = function(Models) {
    var res_send = function(_result, res) {
        var _temp = JSON.stringify(_result);
        if (_temp) {
            Content_Length = '' + _temp.length;
            res.set({
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Content_Length,
            });
            return res.send(_temp);
        } else {
            return res.send(false);
        }
    };

    return function getleaderboard(req, res, next) {
        Modals['arch'].find({
            provider: "badge",
            finish: true
        }, function(err, badge_list) {
            Models['user'].find({}, function(err, user_data) {
                var leaderboard_data = [];
                var user_temp_point = 0;
                for (var i = 0; i < user_data.length; i++) {
                    leaderboard_data.push({
                        user_id: user_data[i].uid,
                        user_name: user_data[i].username,
                        engage_point: 0
                    });
                    for (var j = 0; j < badge_list.length; j++) {
                        if (badge_list[j].uid === user_data[i].uid) {
                            leaderboard_data[i].engage_point = leaderboard_data[i].engage_point + badge_list[j].value;
                        }
                        if ((j + 1) === badge_list.length) {
                            if ((i + 1) === user_data.length) {
                                res_send(leaderboard_data, res);
                            }
                        }
                    }
                }
                // var leaderboard_data = user_data.map(function(_user) {
                //     return {
                //         user_id: _user.uid,
                //         user_name: _user.username,
                //         engage_point: _user.point
                //     };
                // });
            });
        });
    };
};
