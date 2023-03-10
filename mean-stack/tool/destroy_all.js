const server_config = require("../config/server_config.js");

var _events = require("events");
var _event = new _events.EventEmitter();
var mongoose = require("mongoose");
var mongoose_schema = mongoose.Schema;
var Models_config = require(process.cwd() + "/config/model_config.js");
var Models = Models_config.setting(mongoose, mongoose_schema);
var commands = [];
mongoose.connect(server_config.mongodb_url);

_event.on("destory", function (query_command_array) {
  var command = query_command_array.shift();
  Models[command].remove({}, function (err) {
    if (err) {
      console.log(err);
      if (query_command_array.length > 0) {
        _event.emit("destory", query_command_array);
      } else {
        process.exit();
      }
    } else {
      console.log("Database-" + command + " removes all data.");
      if (query_command_array.length > 0) {
        _event.emit("destory", query_command_array);
      } else {
        process.exit();
      }
    }
  });
});
for (command in Models_config.collections()) {
  commands.push(command);
}
_event.emit("destory", commands);
