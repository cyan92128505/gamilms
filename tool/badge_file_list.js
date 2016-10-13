var fsx = require('fs-extra');

fsx.readJson(process.cwd() + '/document/badges_info.json', function(err, badges_info) {
    var temp_badges_info = [];
    for (var i = 0; i < badges_info.length; i++) {
        temp_badges_info.push({
            badge_index: i,
            provider: 'badge',
            arch_name: badges_info[i].arch_name,
            information: badges_info[i].information,
            content: badges_info[i].content,
            value: badges_info[i].value,
            frequency: 1,
            finish: false
        });
        if ((i + 1) === badges_info.length) {
            fsx.outputJson(process.cwd() + '/document/badges_info_list.json', temp_badges_info, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('all badge_name are added !');
                }
            });
        }
    }
});
