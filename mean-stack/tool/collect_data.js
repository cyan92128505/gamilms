var mongoose = require("mongoose");
var mongoose_schema = mongoose.Schema;
var Models_config = require(process.cwd() + '/config/model_config.js');

var events = require('events');
var fs = require('fs');
var fsx = require('fs-extra');
var eventEmitter = new events.EventEmitter();

mongoose.connect('mongodb://localhost/gamilms_express');
var Models = Models_config.setting(mongoose, mongoose_schema);

eventEmitter.on('model_collection', function(option) {
    var list = option.list;
    if (list.length != 0) {
        var current_model = list.shift();
        console.log('collection ' + current_model);
        var now_time = ~~(new Date());
        Models[current_model].find({}, function(err, collection_data) {
            fsx.outputJson(process.cwd() + '/analysis/' + current_model + '_' + now_time + '.json', collection_data, function(err) {
                if (err) console.error(err);
                eventEmitter.emit('model_collection', {
                    list: list
                });
            });
        });
    } else {
        console.log('collection is over!!');
        eventEmitter.emit('close_db', {});
    }
});

eventEmitter.on('close_db', function(option) {
    mongoose.connection.close(function() {
        console.log('\nMongoose connection disconnected\n');
        (function countDown(counter) {
            if (counter > 0) {
                console.log('距伺服器關閉還有' + counter + '秒！');
                return setTimeout(countDown, 500, counter - 1);
            } else {
                console.log('Server closed!');
                process.exit();
            }
        })(1);
    });
});

eventEmitter.emit('model_collection', {
    list: Object.keys(Models)
});
