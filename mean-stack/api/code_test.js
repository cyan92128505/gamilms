// 目前需要能夠判斷程式的錯誤與否
// 轉換程式碼為json結構，再透過關係來判斷


var html2json = require(process.cwd() + '/tool/html2json.js');
var js2json = require(process.cwd() + '/tool/js2json.js');
var difflib = require(process.cwd() + '/tool/difflib.js');

module.exports = {
    next_step: function(Models) {
        return function(req, res, next) {
            Models['ionicfile'].findOne({
                uid: req.user.uid
            }, function(err, ionicfile) {
                for (var i = 0; i < ionicfile.files.length; i++) {

                }
            });
        };
    }
}
