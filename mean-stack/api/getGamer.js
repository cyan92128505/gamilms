module.exports = function(Models) {
    var onboarding_term = require(process.cwd() + '/api/onboarding.js').local_get('application');
    var badges_info_list = require(process.cwd() + '/document/badges_info_list.json');

    var res_send = function(res) {
        return function(_result) {
            delete _result['callback'];
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
        }
    };
    var findOne_user = function(option) {
        Models['user'].findOne({
            uid: option.uid
        }, function(err, result) {
            option.point = result.point;
            option.level = result.level;
            option.onboarding_over = result.onboarding_over;
            option.create_time = result.create_time;
            option.active_time = result.active_time;
            option.web_state = result.web_state;
            option.username = result.username;
            find_video(option);
        });
    };
    var find_video = function(option) {
        // Models['video'].find({
        //     uid: option.uid
        // }, function(err, result) {
        //     option.subjects = result;
        //     find_badge(option);
        // });
        Models['arch'].find({
            uid: option.uid
        }, function(err, result) {
            for (var i; i < result.length; i++) {
                if (/step\_[0-9]/.test(result[i].content)) {
                    option.subjects.push({
                        "uid": option.uid,
                        "vid": /[0-9]/.exec(result[i].content)[0],
                        "provider": "step",
                        "title": result[i].content,
                        "information": result[i].arch_name,
                        "content": result[i].content,
                        "url": result[i].content,
                        "video_length": "1 mins 22 sec",
                        "icon": result[i].information,
                        "give_point": 1,
                        "need_level": 1,
                        "score": result[i].value * (~~result[i].finish),
                        "frequency": result[i].frequency,
                        "finish": result[i].finish,
                        "create_time": new Date(),
                        "active_time": new Date(),
                        "answer": []
                    });
                }
            }
            find_badge(option);
        });
    };

    var find_badge = function(option) {
        Models['arch'].find({
            uid: option.uid,
            provider: 'badge'
        }, function(err, result) {
            for (var i = 0; i < badges_info_list.length; i++) {
                for (var j = 0; j < result.length; j++) {
                    if (result[j].content === badges_info_list[i].content) {
                        option.badges.push(result[j]);
                    }
                }
            }
            find_logs(option);
        });
    };
    var find_logs = function(option) {
        Models['arch'].find({
            uid: option.uid,
            provider: 'operator'
        }, function(err, result) {
            option.logs = result;
            option.callback(option);
        });
    };
    return function getGamer(req, res, next) {
        var regex_number = /[0-9]+$/;
        var uid = req.user.uid
        if (req.params.uid) {
            uid = regex_number.exec(req.params.uid)[0];
        }
        var option = {
            point: 1,
            level: 1,
            onboarding_over: true,
            create_time: new Date(),
            active_time: new Date(),
            web_state: null,
            username: 'Anonymous',
            uid: uid,
            subjects: [],
            term: onboarding_term,
            badges: [],
            logs: [],
            callback: res_send(res)
        }
        findOne_user(option);
    };
};
