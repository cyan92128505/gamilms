module.exports = function(uid) {
    var video_list = [];
    for (var i = 0; i < 25; i++) {
        video_list.push({
            uid: uid,
            vid: i,
            provider: 'video',
            title: 'ionic_'+i,
            information: 'ionic_'+i,
            content: 'MN6vCWp4CdE',
            url: 'MN6vCWp4CdE',
            icon: String,
            give_point: 1,
            need_level: 1,
            score: 0,
            finish: false,
            create_time: new Date(),
            active_time: new Date()
        });
    }
    return video_list;
};
