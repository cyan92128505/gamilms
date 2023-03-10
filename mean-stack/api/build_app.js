// Build App Message Queue

module.exports = function (Models) {
  var fs = require("fs");
  var fs_extra = require("fs-extra");
  var build_process = require("child_process");
  var build_events = require("events");
  var build_querystring = require(process.cwd() + "/tool/escape.js");
  var base64 = require("node-base64-image");
  var fakeCompilerInfo = require(process.cwd() + "/tool/fakeCompilerInfo.js");

  var regex_img = /\.(png|jpg|jpeg|gif)$/;
  var project_name =
    "/" + require(process.cwd() + "/config/server_config.js").project_name;
  var defaultsTo = require(process.cwd() + "/document/final_ionic.json");
  var build_path = process.cwd() + "/ionic";
  var www_path = build_path + "/www";
  var default_lib = build_path + "/default_lib";
  var store_path = process.cwd() + "/assets" + project_name + "/apk";

  var build_event = new build_events.EventEmitter();
  var build_queue_path = process.cwd() + "/document/build_queue.json";
  var busy_state = false;

  build_event.on("start", function (option) {
    console.log("start an new build circle");
    busy_state = true;
    Models["ionicfile"].findOneAndUpdate(
      {
        file_state: true,
      },
      {
        file_state: false,
      },
      function (err, result) {
        Models["ionicfile"].find(
          {
            file_state: true,
          },
          function (err, all) {
            var build_queue = all.map(function (element, index, array) {
              return element.uid;
            });
            fs_extra.outputJson(build_queue_path, build_queue, function (err) {
              if (result) {
                return build_event.emit("remove_www", {
                  uid: result.uid,
                  files: result.files,
                });
              }
            });
          }
        );
      }
    );
  });

  build_event.on("remove_www", function (option) {
    console.log("remove folder www");
    fs_extra.remove(www_path, function (err) {
      if (err) return console.error(err);
      fs_extra.mkdirs(www_path, function (err) {
        console.log("create folder www");
        if (err) return console.error(err);
        return build_event.emit("create_lib", option);
      });
    });
  });

  build_event.on("create_lib", function (option) {
    console.log("create library");
    fs_extra.copy(default_lib + "/lib", www_path + "/lib", function (err) {
      if (err) return console.error(err);
      // return build_event.emit('set_app_file', option);
      fs_extra.outputJson(
        build_path + "/ionic.project",
        {
          name: "Ionic Book Store",
          app_id: option.uid,
        },
        function (err) {
          return build_event.emit("create_app_file", option);
        }
      );
    });
  });

  // build_event.on('set_app_file', function(option) {
  //     return fs_extra.readJson(build_queue_path, function(err, build_queue) {
  //         var now_uid = build_queue.shift();
  //         return fs_extra.outputJson(build_queue_path, build_queue, function(err) {
  //             console.log('set_app_file form' + now_uid);
  //             return Models['ionicfile'].findOne({
  //                 uid: now_uid
  //             }, function(err, now_file) {
  //                 return fs_extra.outputJson(
  //                     build_path + '/ionic.project', {
  //                         "name": "Ionic Book Store",
  //                         "app_id": now_uid
  //                     },
  //                     function(err) {
  //                         var option = {
  //                             uid: now_uid,
  //                             files: now_file.files
  //                         };
  //                         return build_event.emit('create_app_file', option);
  //                     }
  //                 );
  //             });
  //         });
  //     });
  // });

  build_event.on("create_app_file", function (option) {
    var file = option.files.shift();
    console.log("create app file " + file.file_name);
    var file_data = "";
    if (regex_img.exec(file.file_name)) {
      file_data = new Buffer(file.file_content, "base64");
    } else {
      file_data = build_querystring.unescape(file.file_content);
    }
    fs_extra.outputFile(www_path + file.file_name, file_data, function (err) {
      if (err) return console.error(err);
      if (option.files.length === 0) {
        return build_event.emit("build", option);
      } else {
        return build_event.emit("create_app_file", option);
      }
    });
  });

  build_event.on("build", function (option) {
    build_process.exec(
      "ionic build android",
      {
        cwd: build_path,
      },
      function (err, stdout, stderr) {
        if (err) {
          console.log(err);
          return console.log("build query error!!");
        }
        console.log(stdout.split("\n"));
        return build_event.emit("remove_old_app", option);
      }
    );
  });

  build_event.on("remove_old_app", function (option) {
    console.log("remove old app " + option.uid);
    fs_extra.remove(store_path + "/" + option.uid + ".apk", function (err) {
      if (err) return console.error(err);
      return build_event.emit("store_user_app", option);
    });
  });

  build_event.on("store_user_app", function (option) {
    console.log("store user app " + option.uid);
    fs_extra.move(
      build_path + "/platforms/android/build/outputs/apk/android-debug.apk",
      store_path + "/" + option.uid + ".apk",
      function (err) {
        if (err) return console.error(err);
        Models["ionicfile"].findOne(
          {
            file_state: true,
          },
          function (err, result) {
            if (result) {
              build_option = {
                current_uid: parseInt("0", 10),
                files: [],
              };
              return build_event.emit("start", build_option);
            } else {
              return (busy_state = false);
            }
          }
        );
        // fs_extra.readJson(build_queue_path, function(err, build_queue) {
        //     if (build_queue.length !== 0) {
        //         build_option = {
        //             current_uid: parseInt('0', 10),
        //             files: []
        //         };
        //         return build_event.emit('start', build_option);
        //     } else {
        //         return busy_state = false;
        //     }
        // });
      }
    );
  });

  fs_extra.readJson(build_queue_path, function (err, build_queue) {
    if (build_queue.length !== 0 && !busy_state) {
      build_event.emit("start");
      console.log("complie_log");
    }
  });

  return {
    gamilms_node_version: function gamilms_node_version(req, res, next) {
      return res.send(process.version);
    },
    gamilms_java_version: function gamilms_java_version(req, res, next) {
      var java_process = require("child_process");
      java_process.exec(
        "java -version",
        {
          cwd: build_path,
        },
        function (err, stdout, stderr) {
          if (err) {
            console.log("java version error!!");
          }
          return res.send(stdout);
        }
      );
    },
    gamilms_ionic_version: function gamilms_ionic_version(req, res, next) {
      var ionic_process = require("child_process");
      ionic_process.exec(
        "ionic -v",
        {
          cwd: build_path,
        },
        function (err, stdout, stderr) {
          if (err) {
            console.log("ionic version error!!");
          }
          return res.send(stdout);
        }
      );
    },
    check_apk_state: function check_apk_state(req, res, next) {
      var check_apk_name = req.user.uid;
      Models["ionicfile"].findOne(
        {
          uid: check_apk_name,
        },
        function (err, result) {
          if (result) {
            return res.send({
              state: result.file_state,
              apk_name: result.uid + ".apk",
            });
          } else {
            return res.send({
              state: false,
              apk_name: check_apk_name + ".apk",
            });
          }
        }
      );
      // fs_extra.readJson(build_queue_path, function(err, build_queue) {
      //     if (build_queue.length === 0) {
      //         return res.send({
      //             'state': true,
      //             'apk_name': check_apk_name + '.apk'
      //         });
      //     } else {
      //         for (var i = 0; i < build_queue.length; i++) {
      //             if (build_queue[i] === check_apk_name) {
      //                 return res.send({
      //                     'state': false,
      //                     'apk_name': check_apk_name + '.apk'
      //                 });
      //             }
      //             if ((i + 1) === list.length) {
      //                 return res.send({
      //                     'state': true,
      //                     'apk_name': check_apk_name + '.apk'
      //                 });
      //             }
      //         }
      //     }
      // });
    },

    add_queue: function add_queue(req, res, next) {
      var complie_log = fakeCompilerInfo({
        uid: req.user.uid,
        store_path: store_path,
      });
      Models["ionicfile"].update(
        {
          uid: req.user.uid,
        },
        {
          file_state: true,
        },
        function (err, result) {
          if (!busy_state) {
            build_event.emit("start", {
              current_uid: "",
              files: [],
            });
          }
          console.log("complie_log");
          return res.send(complie_log);
        }
      );
      // fs_extra.readJson(build_queue_path, function(err, build_queue) {
      //     if (build_queue.length === 0) {
      //         if (!busy_state) {
      //             build_queue.push(req.user.uid);
      //             fs_extra.outputJson(build_queue_path, build_queue, function(err) {
      //                 build_event.emit('start');
      //                 console.log('complie_log');
      //                 return res.send(complie_log);
      //             });
      //         } else {
      //             build_queue.push(req.user.uid);
      //             fs_extra.outputJson(build_queue_path, build_queue, function() {
      //                 console.log('complie_log');
      //                 return res.send(complie_log);
      //             });
      //         }
      //     } else {
      //         for (var i = 0; i < build_queue.length; i++) {
      //             if (build_queue[i] === req.user.uid) {
      //                 console.log('已加入編譯佇列！');
      //                 return res.send(['已加入編譯佇列！']);
      //             }
      //             if ((i + 1) === build_queue.length) {
      //                 if (!busy_state) {
      //                     build_queue.push(req.user.uid);
      //                     fs_extra.outputJson(build_queue_path, build_queue, function(err) {
      //                         build_event.emit('start');
      //                         console.log('complie_log');
      //                         return res.send(complie_log);
      //                     });
      //                 } else {
      //                     build_queue.push(req.user.uid);
      //                     fs_extra.outputJson(build_queue_path, build_queue, function() {
      //                         console.log('complie_log');
      //                         return res.send(complie_log);
      //                     });
      //                 }
      //             }
      //         }
      //     }
      // });
    },
  };
};
