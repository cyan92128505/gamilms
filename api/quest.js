var clean_code = require(process.cwd() + '/tool/clean_code.js');
var diff = require(process.cwd() + '/tool/difflib.js');
module.exports = {
    quest_step: function(Models) {
        return function(req, res, next) {
            if(req.user.uid){

            }else{
                return next();
            }
        };
    },
    quest_over: function(Models) {
        return function(req, res, next) {
            if(req.user.uid){

            }else{
                return next();
            }
        };
    }
};
