var required_dir = require('require-dir');
var colors = require('colors/safe');
var findOneOrCreate = require('mongoose-find-one-or-create');

module.exports = {
    collections: function() {
        return required_dir(process.cwd() + '/model');
    },
    setting: function(mongoose, mongoose_schema) {
        // arch, ionicfile, quest, survey, user, video, session
        var Types = required_dir(process.cwd() + '/model');
        var Schemas = {};
        var Models = {};
        for (var type_name in Types) {
            Schemas[type_name] = new mongoose_schema(Types[type_name]);
            Schemas[type_name].set('skipVersioning',{
                dontVersionMe: true
            });
            Schemas[type_name].set('timestamps',{
                createdAt: 'created_at'
            });
            Schemas[type_name].plugin(findOneOrCreate);
            Models[type_name] = mongoose.model(type_name, Schemas[type_name]);
            console.log(colors.blue('Connect to Database \"') + type_name + colors.blue('\"'));
        }
        console.log('\n');
        return Models;
    }
};
