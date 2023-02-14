var term = require(process.cwd() + '/document/onboarding_term.json');
module.exports = {
    over: function(Models) {
        return function(req, res, next) {
            var uid = req.user.uid;
            var onboarding_over = req.body.onboarding_over;
            Models['user'].update({
                uid: uid
            }, {
                onboarding_over: onboarding_over
            }, function(err, result) {
                return res.send(result);
            });
        };
    },
    local_get: function(onboarding_type){
        return term[onboarding_type];
    },
    getterm: function(){
        return function(req, res, next){
            var target = term[req.params.onboarding];
            return res.send(target);
        }
    }

}
