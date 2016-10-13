var fs = require('fs');
var video_score = require(process.cwd() + '/document/video_score.json').video_score;
var array = [];
for (var i = 0; i < 25; i++) {
    array[i] = {
        vid: i + 1,
        provider: 'video',
        title: 'ionic_' + (i + 1),
        information: '學習ionic第' + (i + 1) + '課',
        content: 'MN6vCWp4CdE',
        url: 'MN6vCWp4CdE',
        video_length: '1 mins 22 sec',
        icon: '',
        give_point: video_score[i],
        need_level: i + 1,
    };

    if (i == 24) {
        array = JSON.stringify(array);
        fs.writeFile(process.cwd() + '/document/create_video_list.json', array);
    }
}
