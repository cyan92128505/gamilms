var _fs = require('fs');
var _fsx = require('fs-extra');
var _fw = require('filewalker');

_fw(process.cwd() + '/views')
    .on('file', function(file, detail) {
        var _temp = file.split('/');
        var file_name = _temp.pop();
        file_name = file_name.replace('.ejs','.html');
        _temp.push(file_name);
        var result = _temp.join('/');
        _fsx.copy(process.cwd()+'/views/'+file,process.cwd()+'/html/'+result,function(err){
            if(err) {console.log(err);return;}
            console.log(file);
            console.log(result);
        });
    })
    .on('done', function() {
        console.log('OK');
    })
    .walk();
