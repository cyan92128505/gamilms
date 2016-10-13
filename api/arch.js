var badges_info_list = require(process.cwd() + '/document/badges_info_list.json');
module.exports = {
    get_arch_list: function(Models) {
        return function(req, res, next) {
            Models['arch'].find({
                uid: req.user.uid,
                provider: 'arch'
            }, function(err, result) {
                var temp_result = result;
                return res.send(temp_result);
            });
        };
    },
    create_arch: function(Models) {
        return function(req, res, next) {
            var _item = req.body;
            Models['arch'].find({
                uid: req.user.uid,
                provider: 'arch'
            }, function(err, result) {
                var temp_result = result;
                for (var i = 0; i < temp_result.length - 1; i++) {
                    if (temp_result[i].arch_name === _item.arch_name) {
                        return res.send({
                            error: true,
                            data: temp_result[i]
                        });
                    }
                    if ((i + 1) === temp_result.length) {
                        Models('arch').create({
                            aid: req.user.uid + (temp_result.length + 1),
                            uid: req.user.uid,
                            provider: 'arch',
                            arch_name: _item.arch_name,
                            information: _item.information,
                            content: _item.content,
                            frequency: 1,
                            finish: false,
                            create_time: new Date()
                        }, function(err, result) {
                            return res.send({
                                error: null,
                                data: result[i]
                            });
                        });
                    }
                }
            });
        };
    },
    create_badge: function(Models) {
        return function(req, res, next) {
            var _item = req.body;
            Models['arch'].find({
                uid: req.user.uid,
                provider: 'badge'
            }, function(err, result) {
                var temp_result = result;
                for (var i = 0; i < temp_result.length - 1; i++) {
                    if (temp_result[i].arch_name === _item.arch_name) {
                        return res.send({
                            error: true,
                            data: temp_result[i]
                        });
                    }
                    if ((i + 1) === temp_result.length) {
                        Models('arch').create({
                            aid: req.user.uid + (temp_result.length + 1),
                            uid: req.user.uid,
                            provider: 'arch',
                            arch_name: _item.arch_name,
                            information: _item.information,
                            content: _item.content,
                            frequency: 1,
                            finish: false,
                            create_time: new Date()
                        }, function(err, result) {
                            return res.send({
                                error: null,
                                data: result[i]
                            });
                        });
                    }
                }
            });
        };
    },
    get_badge: function(Models) {
        return function(req, res, next) {
            Models['arch'].findOne({
                uid: req.user.uid,
                provider: 'badge',
                content: req.params.aid
            }, function(err, result) {
                var temp_result = result;
                return res.send(temp_result);
            });
        };
    },
    get_badge_list: function(Models) {
        return function(req, res, next) {
            Models['arch'].find({
                uid: req.user.uid,
                provider: 'badge'
            }, function(err, result) {
                var temp_result = result;
                return res.send(temp_result);
            });
        };
    },
    update_badge: function(Modals) {
        return function(req, res, next) {
            if (!!req.user.uid && !!req.body.badge_name) {
                Modals['arch'].findOne({
                    uid: req.user.uid,
                    provider: 'badge',
                    content: req.body.badge_name
                }, function(err, badge_info) {
                    if (badge_info.finish) {
                        return res.send(badge_info);
                    } else {
                        Modals['arch'].update({
                            uid: req.user.uid,
                            provider: 'badge',
                            content: req.body.badge_name
                        }, {
                            finish: true
                        }, function(err, update_date) {
                            if (/step_/.test(req.body.badge_name)) {
                                Modals['user'].findOne({
                                    uid: req.user.uid
                                }, function(err, user_result) {
                                    var step_level = req.body.badge_name.replace('step_', '');
                                    console.log(step_level);
                                    if (user_result.step_level < step_level) {
                                        Modals['user'].update({
                                            uid: req.user.uid
                                        }, {
                                            step_level: step_level
                                        }, function(err, update_user) {});
                                    }
                                });
                            }
                            return res.send(badge_info);
                        });
                    }
                });
            } else {
                return next();
            }
        };
    }
}
