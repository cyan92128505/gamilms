function convert(target_folder, output_json) {
    var _jsesc = require('jsesc');
    var _querystring = require(process.cwd()+'/tool/escape.js');
    var _fs = require('fs');
    var _fsx = require('fs-extra');
    var _fw = require('filewalker');
    var _path = process.cwd();
    var _events = require('events');
    var _event = new _events.EventEmitter();
    var base64 = require('node-base64-image');
    var base64_img_options = {
        localFile: true,
        string: true
    };
    var regex_js = /[\w]+\.js$/;
    var regex_html = /[\w]+\.html$/;
    var regex_css = /[\w]+\.css$/;
    var regex_img = /[\w]+\.(png|jpg|jpeg)$/;

    var files_name = [];
    var files_url = [];
    var files_content = [];

    var regex_code_func = function(file) {
        files_name.push('/' + file);
        files_url.push(file);
    };

    _event.on('readIonicFile', function(url_array) {
        var element = url_array.shift();

        if (!!regex_img.exec(element)) {
            base64.base64encoder(process.cwd() + target_folder + element, base64_img_options, function(err, image) {
                if (err) {
                    console.log(err);
                }
                var _temp = {
                    file_name: '/' + element,
                    file_content: image,
                    type: 'file'
                };
                files_content.push(_temp);
                if (url_array.length === 0) {
                    var img_name = regex_img.exec(element);
                    writeIonicFile(img_name[(img_name.length - 1)]);
                } else {
                    _event.emit('readIonicFile', url_array);
                }
            });
        } else {
            _fs.readFile(process.cwd() + target_folder + element, 'utf8', function(err, file_data) {
                var file_encode = _querystring.escape(file_data);
                var _temp = {
                    file_name: '/' + element,
                    file_content: file_encode,
                    type: 'file'
                };
                files_content.push(_temp);
                if (url_array.length === 0) {
                    writeIonicFile('file');
                } else {
                    _event.emit('readIonicFile', url_array);
                }
            });
        }

    });

    var writeIonicFile = function(_type) {
        var default_file_json = '';
        if (regex_img.exec(_type)) {
            default_file_json = files_content;
        } else {
            default_file_json = JSON.stringify(files_content, null, 4);
        }

        _fs.writeFile(process.cwd() + output_json, default_file_json, function(err) {
            console.log('target_folder: '+target_folder);
            console.log('output_json: '+output_json);
            console.log('Convert over!!');
        });
    };

    _fw(process.cwd() + target_folder)
        .on('file', function(file, detail) {
            regex_code_func(file);
        })
        .on('done', function() {
            _event.emit('readIonicFile', files_url);
        })
        .walk();
}
//====================================================================
//convert('/final/', '/document/final_ionic.json');
//convert('/ionic/simple_file_www/','/document/default_ionic.json');
convert('/phaser/init/','/document/default_ionic.json');
convert('/phaser/final/', '/document/final_ionic.json');

// var target_folder = '/final/';
// var output_json = '/document/final_ionic.json';
// var target_folder = '/ionic/simple_file_www/';
// var output_json = '/document/default_ionic.json';
