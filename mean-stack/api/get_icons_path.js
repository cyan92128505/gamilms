module.exports = function(){
    return function icons_path(req, res, next){
        var icons_path = require(process.cwd()+'/document/badges_info_list.json');
        return res.send(icons_path);
    };
};
