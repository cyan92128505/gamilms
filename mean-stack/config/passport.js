//http://www.kancloud.cn/kancloud/oauth_2_0/63337
//http://www.kancloud.cn/digest/passport-js-note/64048
var config = require(process.cwd() + "/config/server_config.js");
var icons_path = require(process.cwd() + "/document/badges.json");
var default_phaser = require(process.cwd() + "/document/default_phaser.json");
var video_array = require(process.cwd() + "/document/create_video_list.json");
var badges_info_list = require(process.cwd() +
  "/document/badges_info_list.json");

module.exports = function (passport, Strategy, Models, facebook_return) {
  var model_events = require("events");
  var model_event = new model_events.EventEmitter();

  model_event.on("create_user", function (profile, done) {
    Models["user"].create(
      {
        uid: profile.id,
        username: profile.displayName,
        web_state: "new login",
        active_time: new Date(),
        create_time: new Date(),
        onboarding_over: false,
        level: 1,
        point: 0,
        step_level: 1,
        step_point: 0,
      },
      function (err, create_user_result) {
        model_event.emit("create_video", create_user_result, done);
      }
    );
  });

  model_event.on("create_video", function (create_user_result, done) {
    var query_video_array = video_array.map(function (element, index, list) {
      return {
        uid: create_user_result.uid,
        vid: element.vid,
        provider: element.provider,
        title: element.title,
        information: element.information,
        content: element.content,
        url: element.url,
        video_length: element.video_length,
        icon: element.icon,
        give_point: element.give_point,
        need_level: element.need_level,
        answer: [],
        score: 0,
        frequency: 0,
        finish: 1,
        create_time: new Date(),
        active_time: new Date(),
      };
    });

    Models["video"].create(
      query_video_array,
      function (err, create_video_result) {
        model_event.emit("create_first_badge", create_user_result, done);
      }
    );
  });
  model_event.on("create_first_badge", function (create_user_result, done) {
    var badge_list = badges_info_list.map(function (element, index, array) {
      return {
        uid: create_user_result.uid,
        provider: "badge",
        arch_name: element.arch_name,
        information: element.information,
        content: element.content,
        value: element.value,
        frequency: 1,
        finish: false,
        create_time: new Date(),
        update_time: new Date(),
      };
    });
    Models["arch"].create(badge_list, function (err, result) {
      model_event.emit("create_ionicfile", create_user_result, done);
    });
  });
  model_event.on("create_ionicfile", function (create_user_result, done) {
    Models["ionicfile"].create(
      {
        uid: create_user_result.uid,
        files: default_phaser,
        file_state: false,
      },
      function (err, create_ionicfile_result) {
        return done(null, create_user_result);
      }
    );
  });
  //passport facebook驗證機制
  passport.use(
    new Strategy(
      {
        clientID: config.passport.clientID,
        clientSecret: config.passport.clientSecret,
        callbackURL: facebook_return,
      },
      function (accessToken, refreshToken, profile, done) {
        Models["user"].findOneAndUpdate(
          {
            uid: profile.id,
          },
          {
            web_state: "login",
            active_time: new Date(),
          },
          function (err, find_user) {
            if (!find_user) {
              model_event.emit("create_user", profile, done);
            } else {
              return done(null, find_user);
            }
          }
        );
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (object, done) {
    done(null, object);
  });
};
