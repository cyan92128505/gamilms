module.exports = {
    create: function(Models){
        return function create_model_operator(req, res, next){
            var model_name = req.body.model_name;
            var model_content = req.body.model_name;
            Models[model_name].create(model_content,function(err, result){
                return res.send(result);
            });
        };
    }
};
