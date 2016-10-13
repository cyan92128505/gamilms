var esprima = require('esprima');
var strip = require('strip-comments');
var fsx = require('fs-extra');
// var code = fsx.readJson(process.cwd() + '/document/final_ionic.json', function(err, obj) {
//     for (var i = 0; i < obj.length; i++) {
//         if (obj[i].file_name === '/js/services.js') {
//             console.log(JSON.stringify(parsejs.parse(strip(escape.unescape(obj[i].file_content))), null, 2));
//             //console.log(JSON.stringify(esprima.parse(strip(escape.unescape(obj[i].file_content))), null, 2));
//         }
//     }
// });
module.exports = function(option){
    option.callback(null, esprima.parse(strip(option.raw)));
}
