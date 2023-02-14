var fs = require('fs');
var final_ionic_file = require(process.cwd() + '/document/final_ionic.json');
var querystring = require('querystring');

module.exports = function(passport, Models) {

    var default_ionic = function(req, res, next) {
        var response = '';
        for (var i = 0; i < final_ionic_file.length; i++) {
            if (final_ionic_file[i].file_name === req.path) {
                response = querystring.unescape(final_ionic_file[i].file_content);
                return res.send(response);
            }
            if (final_ionic_file.length === (i + 1)) {
                return next();
            }
        }
    };

    return function default_ionic_return(req, res, next) {
        default_ionic(req, res, next);
    };
};
