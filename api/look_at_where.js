var final_ionic = require(process.cwd() + '/document/final_ionic.json');
var phaser_tutorial = require(process.cwd() + '/document/phaser_tutorial.json');
var phaser_tutorial_md = require(process.cwd() + '/document/phaser_tutorial_md.json');
var clean_object = require(process.cwd() + '/tool/clean_object.js');
var file_tree = require(process.cwd() + '/tool/file_tree.js');
var operator_log = require(process.cwd() + '/tool/operator_log.js');
var badges_info_list = require(process.cwd() + '/document/badges_info_list.json');




var get_web_state_list = function(look_at, look_at_result, Models, _callback) {
    Models['user'].find({
        web_state: look_at
    }, function(_err, _result) {
        var web_state_result = _result.map(function(element, index, list) {
            var img = 'http://graph.facebook.com/' + element.uid + '/picture?type=large&width=32&height=32';
            return {
                "uid": element.uid,
                "img": img
            };
        });
        look_at_result.web_state_list = web_state_result;
        _callback(false, look_at_result);
    });
};


module.exports = function(Models) {
    return function look_at_where(req, res, next) {
        var look_at = req.body.look_at;
        operator_log(Models, {
            uid: req.user.uid,
            path: look_at
        });
        Models['user'].findOneAndUpdate({
            uid: req.user.uid
        }, {
            web_state: look_at
        }, function(err, result) {
            var regex_video = /^video_[0-9]+/;
            var regex_profile = /^profile_[0-9]+/;
            var regex_number = /[0-9]+/;
            result.web_state = look_at;
            var pref = {
                'file_list': [],
                'video': {},
                'subjects': [],
                'web_state_list': '',
                'leaderboard': [],
                'icons_path': [],
                'trip': {}
            };
            clean_object(result, pref, function(look_at_result) {
                switch (true) {
                    case (regex_profile.test(look_at)):
                        Models['arch'].find({
                            'uid': req.user.uid,
                            'provider': 'badge'
                        }, function(err, result) {
                            for (var i = 0; i < result.length; i++) {
                                look_at_result.icons_path.push(result[i]);
                                if ((i + 1) === result.length) {
                                    return res.send(look_at_result);
                                }
                            }
                        });
                        break;
                    case (regex_video.test(look_at)):
                        get_web_state_list(look_at, look_at_result, Models, function(err, list_result) {
                            var video_id = regex_number.exec(look_at)[0];
                            Models['video'].findOne({
                                vid: video_id,
                                uid: req.user.uid
                            }, function(err, video_result) {
                                look_at_result.video = video_result;
                                return res.send(look_at_result);
                            });
                        });
                        break;
                    case (look_at === 'Code'):
                        Models['ionicfile'].findOne({
                            uid: req.user.uid
                        }, function(err, ionicfile_result) {
                            if (ionicfile_result) {
                                for (var i = 0; i < ionicfile_result.files.length; i++) {
                                    look_at_result.file_list[i] = {
                                        'file_name': ionicfile_result.files[i].file_name,
                                        'type': ionicfile_result.files[i].type
                                    };
                                    if ((i + 1) === ionicfile_result.files.length) {
                                        file_tree(look_at_result.file_list, function(file_tree_object) {
                                            look_at_result.html = file_tree_object.html;
                                            look_at_result.file_tree = file_tree_object.node_structure;
                                            look_at_result.trip = {
                                                trip_length: phaser_tutorial_md.length,
                                                step: phaser_tutorial_md
                                            };
                                            return res.send(look_at_result);
                                        });
                                    }
                                }
                            } else {
                                for (var i = 0; i < final_ionic.length; i++) {
                                    look_at_result.file_list[i] = {
                                        'file_name': final_ionic[i].file_name,
                                        'type': final_ionic[i].type
                                    };

                                    if ((i + 1) === final_ionic.length) {
                                        file_tree(look_at_result.file_list, function(file_tree_object) {
                                            look_at_result.html = file_tree_object.html;
                                            look_at_result.file_tree = file_tree_object.node_structure;
                                            return res.send(look_at_result);
                                        });
                                    }
                                }
                            }
                        });
                        break;
                    case (look_at === 'Leaderboard'):
                        Models['arch'].find({
                            provider: "badge",
                            finish: true
                        }, function(err, badge_list) {
                            Models['user'].find({}, function(err, user_data) {
                                for (var i = 0; i < user_data.length; i++) {
                                    look_at_result.leaderboard.push({
                                        user_id: user_data[i].uid,
                                        user_name: user_data[i].username,
                                        engage_point: 0
                                    });
                                    for (var j = 0; j < badge_list.length; j++) {
                                        if (badge_list[j].uid === user_data[i].uid) {
                                            look_at_result.leaderboard[i].engage_point = look_at_result.leaderboard[i].engage_point + badge_list[j].value;
                                        }
                                        if ((j + 1) === badge_list.length) {
                                            if ((i + 1) === user_data.length) {
                                                return res.send(look_at_result);
                                            }
                                        }
                                    }
                                }
                            });
                        });
                        break;
                    case (look_at === 'Badge'):
                        // var icons_path = require(process.cwd() + '/document/badges.json');
                        Models['arch'].find({
                            'uid': req.user.uid,
                            'provider': 'badge'
                        }, function(err, result) {
                            for (var i = 0; i < badges_info_list.length; i++) {
                                for (var j = 0; j < result.length; j++) {
                                    if (result[j].content === badges_info_list[i].content) {
                                        look_at_result.icons_path.push(result[j]);
                                    }
                                }
                                if ((i + 1) === badges_info_list.length) {
                                    return res.send(look_at_result);
                                }
                            }
                            // var response = [];
                            // for (var i = 0; i < icons_path.length; i++) {
                            //     result.find(function(element, index, array) {
                            //         if (element.information === icons_path[i]) {
                            //             look_at_result.icons_path.push(result[index]);
                            //         }
                            //     });
                            //     if (!look_at_result.icons_path[i]) {
                            //         look_at_result.icons_path.push({
                            //             "arch_name": '未取得',
                            //             "information": icons_path[i],
                            //             "content": icons_path[i],
                            //             "frequency": '0',
                            //             "finish": false
                            //         });
                            //     }
                            //
                            //     if ((i + 1) === icons_path.length) {
                            //         return res.send(look_at_result);
                            //     }
                            // }
                        });
                        break;
                    default:
                        return res.send(look_at_result);
                }
            });

        });
    };
};
