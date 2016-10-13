module.exports = function(target_object, link_object, callback) {
    var _target_object = JSON.stringify(target_object).split('');
    var _link_object = JSON.stringify(link_object).split('');
    var result = '';
    _target_object.pop();
    _target_object.push(',');
    _link_object.shift();
    result = _target_object.join('') + _link_object.join('');
    result = JSON.parse(result);
    callback(result);
};
