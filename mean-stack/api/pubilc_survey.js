module.exports = {
    save_survey: function(Models) {
        return function(req, res, next) {
            if (req.user.uid) {
                Models['survey'].findOneOrCreate({
                    'uid': req.user.uid
                }, {
                    uid: req.user.uid,
                    type: 'pubile',
                    answer: req.body.answer,
                    finish: true,
                    create_time: new Date()
                }, function(err, survey_data) {
                    if (!!survey_data.finish) {
                        return res.send('survey over');
                    } else {
                        Models['survey'].update({
                            'uid': req.user.uid
                        }, {
                            answer: req.body.answer,
                            finish: true
                        }, function(err, update_data) {
                            return res.send('survey over');
                        });
                    }
                });
            }
        };
    },
    save_quest: function(Models) {
        return function(req, res, next) {
            if (req.user.uid) {
                Models['user']
            } else {
                return next();
            }
        };
    }
};
