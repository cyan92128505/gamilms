var base_score = require(process.cwd() + '/document/video_score.json').base_score;
var pass_score = require(process.cwd() + '/document/video_score.json').pass_score;
var set_survey_data = function(sid) {
    var survey_data = require(process.cwd() + '/document/survey.json');
    for (var i = 0; i < survey_data.length; i++) {
        if (survey_data[i].sid === sid) {
            return survey_data[i];
        }
    }
};
var is_corrent_answer = function(option) {
    option.answer.map(function(element, index, array) {
        var element_sum = 0;
        for (var i = 0; i < element.length; i++) {
            if (option.survey_data.quests[index].quest_answer[i] === element[i]) {
                element_sum++;
            }
            if ((i + 1) === element.length) {
                if (element_sum === element.length) {
                    option.corrent[index] = true;
                } else {
                    option.corrent[index] = false;
                }
            }
        }
    });
    count_score(option);
};
var count_score = function(option) {
    var weight_sum = 0;
    for (var i = 0; i < option.survey_data.quests.length; i++) {
        weight_sum = weight_sum + option.survey_data.quests[i].quest_weight;
    }
    for (var j = 0; j < option.corrent.length; j++) {
        option.score = option.score + (option.corrent[j] * option.survey_data.quests[j].quest_weight) / weight_sum;
        if ((j + 1) === option.corrent.length) {
            option.score = option.score * base_score;
            if (option.score > (base_score * pass_score)) {
                option.finish = true;
            } else {
                option.finish = false;
            }
            option.callback(option);
        }
    }
};
module.exports = {
    get_survey: function(Models) {
        // 從題庫中找到題目
        return function(req, res, next) {
            if (req.params.survey) {
                var survey_data = set_survey_data(req.params.survey);
                var send_survey = [];
                if (survey_data) {
                    send_survey = survey_data.quests.map(function(element, index, array) {
                        return {
                            "title": element.quest_title,
                            "terms": element.quest_terms.map(function(element, index, array){
                                return {
                                    "term_name": element,
                                    "term_corrent": 0,
                                    "term_css": {
                                        "color": "#bdbdbd"
                                    }
                                }
                            })
                        };
                    });
                    return res.send(send_survey);
                } else {
                    return res.status(404).send('Sorry cant find that!');
                }
            } else {
                return res.status(404).send('Sorry cant find that!');
            }
        }
    },
    store_survey: function(Models) {
        return function(req, res, next) {
            var survey = req.body;
            if (survey) {
                Models['video'].findOne({
                    uid: req.user.uid,
                    vid: survey.vid
                }, function(err, result) {
                    if (result) {
                        is_corrent_answer({
                            sid: survey.vid,
                            survey_data: set_survey_data(survey.vid),
                            answer: survey.answer,
                            corrent: [],
                            // [[true,false],[true,false]]
                            score: 0,
                            finish: false,
                            callback: function(option) {
                                Models['video'].update({
                                    uid: req.user.uid,
                                    vid: survey.vid
                                }, {
                                    answer: survey.answer,
                                    score: option.score,
                                    finish: option.finish,
                                    active_time: new Date()
                                }, function(err, result) {
                                    Models['video'].findOne({
                                        uid: req.user.uid,
                                        vid: survey.vid
                                    },function(err, result){
                                        return res.send(result);
                                    })
                                });
                            }
                        });

                    }
                });
            } else {
                return res.status(404).send('Sorry cant find that!');
            }
        }
    }
}
