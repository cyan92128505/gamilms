var escape = require(process.cwd() + '/tool/escape.js');
var html2json = require(process.cwd() + '/tool/html2json.js');
var js2json = require(process.cwd() + '/tool/js2json.js');
var traverse = require('traverse');
var fsx = require('fs-extra');
var fs = require('fs');
var regex_js = /[\w]+\.js$/;
var regex_html = /[\w]+\.html$/;
var Events = require('events');
var EventEmitter = new Events.EventEmitter();

function build_json_obj(_path, _save, next) {
    var collection = function(option) {
        var types = option.types;
        traverse(option.data).forEach(function(x) {
            var result_ok = true;
            if (!!x && x.type) {
                for (var i = 0; i < types.length; i++) {
                    if(types[i] === x.type){
                        result_ok = false;
                    }
                }
                if (result_ok) {
                    types.push(x.type);
                }
            }
        });
        EventEmitter.emit('save', {
            paths: option.paths,
            types: types
        });
    };

    var non_collection = function(option) {
        EventEmitter.emit('save', {
            paths: option.paths,
            types: option.types
        });
    };

    var save_json = function(option) {
        fsx.outputJson(option.file, option.data, function(err, data) {
            if (!err) {
                console.log('create ' + option.file);
                option.callback({
                    file: option.file,
                    data: option.data,
                    paths: option.paths,
                    types: option.types
                });
            }
        });
    };

    var readFile = function(option) {
        var paths = option.paths;
        var types = option.types;
        if (paths.length > 0) {
            var path = paths.shift();
            fs.readFile(_path + path, 'utf8', function(err, rawdata) {
                switch (true) {
                    case regex_js.test(path):
                        js2json({
                            raw: rawdata,
                            callback: function(err, data) {
                                save_json({
                                    file: _save + path + '.json',
                                    data: data,
                                    paths: paths,
                                    types: types,
                                    callback: collection
                                });
                            }
                        });
                        break;
                    case regex_html.test(path):
                        html2json({
                            raw: escape.unescape(rawdata),
                            callback: function(err, data) {
                                save_json({
                                    file: _save + path + '.json',
                                    data: data,
                                    paths: paths,
                                    types: types,
                                    callback: non_collection
                                });
                            }
                        });
                        break;
                    default:
                        break;
                }
            });
        } else {
            EventEmitter.emit('over', {
                types: types
            });
        }
    };

    var items = [];

    EventEmitter.on('save', readFile);
    EventEmitter.on('over', next);

    fsx.walk(_path)
        .on('data', function(item) {
            var temp_path = item.path.replace(_path, '');
            if (regex_js.test(temp_path) || regex_html.test(temp_path)) {
                items.push(temp_path);
            }
        })
        .on('end', function() {
            console.log(items);
            EventEmitter.emit('save', {
                paths: items,
                types: []
            });
        });
}

//==================================
// build_json_obj(process.cwd() + '/ionic/simple_file_www', process.cwd() + '/document/default_ionic_json_obj', function() {
//
// });
build_json_obj(process.cwd() + '/final', process.cwd() + '/document/final_ionic_json_obj', function(option) {
    console.log(JSON.stringify(option.types, null, 2));
    fsx.outputFile(process.cwd() + '/document/js_type.json', JSON.stringify(option.types, null, 2), function(err) {
        if (!err) {
            console.log('convert over');
        } else {
            console.log(err);
        }
    })
});
