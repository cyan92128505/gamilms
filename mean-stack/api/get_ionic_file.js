var fs = require("fs");
var final_ionic_file = require(process.cwd() + "/document/final_ionic.json");
var default_phaser = require(process.cwd() + "/document/default_phaser.json");
var project_name =
  "/" + require(process.cwd() + "/config/server_config.js").project_name;
var querystring = require(process.cwd() + "/tool/escape.js");
var base64 = require("node-base64-image");
var regex_img = /\.(png|jpg|jpeg|gif)$/;
var regex_css = /\.css$/;
var regex_app_uid = /app_[0-9]+/;
var redex_index = /index.html/;

module.exports = function (passport, Models) {
  var user_ionic = function (req, res, Models, next) {
    var req_path = req.path
      .replace(project_name + "/app_", "")
      .replace(/[0-9]+\//, "/");
    var uid = regex_app_uid.exec(req.path)[0].replace("app_", "");
    if (!redex_index.test(req_path)) {
      Models["ionicfile"].findOne(
        {
          uid: uid,
        },
        function (err, result) {
          var response = "";
          if (result) {
            for (var i = 0; i < result.files.length; i++) {
              if (result.files[i].file_name === req_path) {
                switch (true) {
                  case !!regex_img.exec(result.files[i].file_name):
                    var imageData = new Buffer(
                      result.files[i].file_content,
                      "base64"
                    );
                    return res.send(imageData);
                    break;
                  case !!regex_css.exec(result.files[i].file_name):
                    response = querystring.unescape(
                      result.files[i].file_content
                    );
                    if (response === "") {
                      response = " ";
                    }
                    return res.type("text/css").send(response);
                    break;
                  default:
                    response = querystring.unescape(
                      result.files[i].file_content
                    );
                    if (response === "") {
                      response = " ";
                    }
                    return res.send(response);
                }
              }
              if (result.files.length === i + 1) {
                return next();
              }
            }
          } else {
            default_ionic(req, res, next);
          }
        }
      );
    } else {
      Models["user"].findOne(
        {
          uid: req.user.uid,
        },
        function (err, user_data) {
          if (!!req.query.point) {
            if (req.query.point === "dev") {
              return res.render("phaser_index", {
                // game_js: 'game_' + user_data.level + '_' + req.query.point + '.js'
                game_js: "game_1_dev.js",
              });
            } else {
              return res.render("phaser_index", {
                // game_js: 'game_' + user_data.level + '_' + req.query.point + '.js'
                game_js: "game_1_" + req.query.point + ".js",
              });
            }
          } else {
            return res.render("phaser_index", {
              // game_js: 'game_' + user_data.level + '_' + user_data.point + '.js'
              game_js: "game_1_" + user_data.point + ".js",
            });
          }
        }
      );
    }
  };

  var default_ionic = function (req, res, next) {
    var req_path = req.path.replace(project_name + "/app_0", "");
    var response = "";
    if (!redex_index.test(req_path)) {
      for (var i = 0; i < default_phaser.length; i++) {
        if (default_phaser[i].file_name === req_path) {
          response = querystring.unescape(default_phaser[i].file_content);
          return res.send(response);
        }
        if (default_phaser.length === i + 1) {
          return next();
        }
      }
    } else {
      return res.render("phaser_index", {
        // game_js: 'game_' + user_data.level + '_' + user_data.point + '.js'
        game_js: "game_1_8.js",
      });
    }
  };

  return function get_ionic_file(req, res, next) {
    if (req.user) {
      if (regex_app_uid.test(req.path)) {
        user_ionic(req, res, Models, next);
      } else {
        return next();
      }
    } else {
      default_ionic(req, res, next);
    }
  };
};
