var jsondiffpatch = require('jsondiffpatch');
var deep = require('deep-diff');

// var default_ionic = require(process.cwd() + '/document/default_ionic_json_obj/js/app.js.json');
// var final_ionic = require(process.cwd() + '/document/final_ionic_json_obj/js/app.js.json');
// var fs = require('fs');
// fs.writeFile(
//     process.cwd() + '/document/jsdiff.json',
//     JSON.stringify(jsondiffpatch.diff(default_ionic, final_ionic), null, 2),
//     'utf8',
//     function(err) {
//         console.log(err);
//     });
// console.log(JSON.stringify(jsondiffpatch.diff(default_ionic, final_ionic), null, 2));


module.exports = function(diff_a, diff_b) {
    //return deep.diff(diff_a, diff_b);
    return jsondiffpatch.diff(diff_a, diff_b);
}

//　html and js are difference
