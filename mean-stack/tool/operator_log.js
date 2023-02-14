module.exports = function(Models, option) {
    Models['arch'].count(function(err, count) {
        Models['arch'].findOne({
            uid: option.uid,
            arch_name: option.path
        }, function(err, result) {
            if (result) {
                Models['arch'].findOneAndUpdate({
                    uid: option.uid,
                    arch_name: option.path
                }, {
                    frequency: result.frequency + 1,
                    update_time: new Date()
                }, function(err, result) {
                    //console.log(result);
                });
            } else {
                Models['arch'].create({
                    uid: option.uid,
                    provider: 'operator',
                    arch_name: option.path,
                    information: option.path,
                    content: option.path,
                    frequency: 1,
                    finish: true,
                    create_time: new Date(),
                    update_time: new Date()
                }, function(err, result) {
                    //console.log(result);
                });
            }
        });
    });
};
