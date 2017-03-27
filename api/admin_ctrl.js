var fsx = require('fs-extra');
module.exports = {
    create: function(Models) {
        return function create(req, res, next) {
            var model_name = req.body.model_name;
            var model_content = req.body.model_content;
            Models[model_name].create(model_content, function(create_err, create_result) {
                Models[model_name].find({}, function(find_err, find_result) {
                    return res.send(find_result);
                });
            });
        };
    },
    findALL: function(Models) {
        return function findALL(req, res, next) {
            if (req.params.custom_query) {
                Models[req.params.custom_query].find({}, function(err, result) {
                    return res.send(result);
                });
            }
        };
    },
    jsdiff: function() {
        return function jsdiff(req, res, next) {
            var jsondiffpatch = require(process.cwd() + '/tool/jsondiffpatch.js');
            var result = jsondiffpatch(JSON.parse(req.body.a), JSON.parse(req.body.b));
            console.log(JSON.stringify(result, null, 2));
            return res.send(result);
        }
    },
    js2json: function() {
        return function jstojson(req, res, next) {
            var js2json = require(process.cwd() + '/tool/js2json.js');
            return js2json({
                raw: req.body.raw,
                callback: function(err, result) {
                    res.send(result);
                }
            });

        };
    }
};
