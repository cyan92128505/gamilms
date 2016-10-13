var fsx = require('fs-extra');
var json_path = process.cwd() + '/document/chains-data-docs.json';
fsx.readJson(json_path, function(err, json_data) {
    fsx.outputJson(json_path, json_data, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('over');
        }
    });
});
