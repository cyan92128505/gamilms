module.exports = {
    video: function(Models) {
        return function video(req, res, next) {
            var vid = 'all';
            var uid = req.user.uid;
            var video_list;
            if (req.params.vid) {
                vid = req.params.vid;
                Models['video'].findOne({
                    vid: vid,
                    uid: uid
                }, function(err, video_result) {
                    return res.send(video_result);
                });
            } else {
                Models['video'].find({
                    uid: uid
                }, function(err, video_result) {
                    return res.send(video_result);
                });
            }
        };
    },
    quest: function(Models) {
        return function(req, res, next) {
            var vid = 'all';
            var uid = req.user.uid;
            if (req.params.vid) {
                vid = req.params.vid;
                Models['quest'].findOne({
                    vid: vid,
                    uid: uid
                }, function(err, video_result) {
                    return res.send(video_result);
                });
            } else {
                return next();
            }
        }
    },
    videos_info: function(Models) {
        return function(req, res, next) {
            Models['video'].find({
                uid: req.user.uid
            }, function(err, result) {
                return res.send(result);
            });
        };
    },
    video_ended: function(Models) {
        return function(req, res, next) {
            if (req.user) {
                Models['video'].findOne({
                    uid: req.user.uid,
                    vid: req.body.vid
                }, function(err, result) {
                    Models['video'].findOneAndUpdate({
                        uid: req.user.uid,
                        vid: req.body.vid
                    }, {
                        frequency: result.frequency + 1
                    }, function(err, result) {
                        return res.send(result);
                    });
                });
            } else {
                return next();
            }
        };
    },
    video_score: function(Models) {
        return function(req, res, next) {
            if (req.user) {
                Models['video'].findOne({
                    uid: req.user.uid,
                    vid: req.body.vid
                }, function(err, result) {
                    Models['video'].findOneAndUpdate({
                        uid: req.user.uid,
                        vid: req.body.vid
                    }, {
                        score: 100
                    }, function(err, result) {
                        return res.send(result);
                    });
                });
            } else {
                return next();
            }
        };
    },
};
