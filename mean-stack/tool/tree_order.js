var monkey = require('tree-monkey');
var fsx = require('fs-extra');
fsx.readJson(process.cwd()+'/document/final_ionic_json_obj/js/controllers.js.json',function(err, obj){
    monkey.preOrder(tree, function(node, path, callback) {

        callback();
    },function(){});
});
