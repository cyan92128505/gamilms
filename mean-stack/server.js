var express = require("express");
var colors = require("colors/safe");
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs-extra");
var morgan = require("morgan-debug");
var passport = require("passport");
var Strategy = require("passport-facebook").Strategy;
var mongoose = require("mongoose");
var session = require("express-session");
var expressSessionPassportCleanup = require("express-session-passport-cleanup");
var MongoStore = require("connect-mongo")(session);
var mongoose_schema = mongoose.Schema;
var Models_config = require("./config/model_config.js");
var ON_DEATH = require("death");

var server_config = require("./config/server_config.js");
var HOST = server_config.host;
var PORT = server_config.port;
// var project_name = require(process.cwd()+'/config/server_config.js').project_name;
var facebook_return =
  "http://" +
  HOST +
  "/" +
  server_config.project_name +
  "/login/facebook/return";

// for parsing multipart/form-data
var upload = multer();

// 連接字符串格式為mongodb://主機/資料庫名
mongoose.createConnection("mongodb://localhost/gamilms_express", {
  useMongoClient: true,
});
var Models = Models_config.setting(mongoose, mongoose_schema);
var config_passport = require("./config/passport.js");
config_passport(passport, Strategy, Models, facebook_return);

// Create a new Express application.
var app = express();
app.disable("x-powered-by");

// Configure view engine to render EJS templates.
app.set("views", process.cwd() + "/views");
app.set("view engine", "ejs");

// 紀錄器
fs.ensureFile(process.cwd() + "/log/access.log", function (err, stat) {
  if (err) {
    console.log(err);
    console.log(stat);
    return;
  }

  var access_time = new Date() - 1;
  fs.rename(
    process.cwd() + "/log/access.log",
    process.cwd() + "/log/" + access_time + "_access.log",
    function () {
      var accessLogStream = fs.createWriteStream(
        process.cwd() + "/log/access.log",
        {
          flags: "a",
        }
      );
      app.use(
        morgan("gamilms", "combined", {
          stream: accessLogStream,
        })
      );
      app.use(function keyword_filter(req, res, next) {
        next();
        // if (
        //   /^(\/gamilms|\/assets|\/favicon\.ico|\/robots\.txt)/.test(req.path)
        // ) {
        //   next();
        // } else {
        //   console.log("unknow_request:" + req.originalUrl);
        //   console.log("unknow_ip:" + req.ip);
        //   return res.redirect("https://www.fbi.gov/");
        // }
      });

      // 靜態檔案路由
      app.use(express.static(process.cwd() + "/assets"));
      var regex_app_path = new RegExp(
        "/" + server_config.project_name + "\\/app_[0-9]+/(lib/|cordova.js)"
      );
      app.get(regex_app_path, function get_ionic_lib(req, res, next) {
        var req_path = req.path
          .replace("/" + server_config.project_name + "/app_", "")
          .replace(/[0-9]+\//, "/");
        var regex_app_path = new RegExp(
          "/" + server_config.project_name + "\\/app_[0-9]+/(lib/|cordova.js)"
        );
        if (regex_app_path.test(req.path)) {
          return res.sendfile(req_path, {
            root: process.cwd() + "/ionic/default_lib",
          });
        } else {
          return next();
        }
      });
      app.use(bodyParser.json()); // for parsing application/json
      app.use(
        bodyParser.urlencoded({
          extended: true,
        })
      ); // for parsing application/x-www-form-urlencoded

      // Use application-level middleware for common functionality, including
      // logging, parsing, and session handling.
      app.use(require("cookie-parser")());
      app.use(
        session({
          cookie: {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            maxAge: 14 * 24 * 60 * 60 * 1000,
            secure: false,
          },
          secret: "gamilmsCat",
          resave: false,
          saveUninitialized: true,
          store: new MongoStore({
            url: "mongodb://localhost/gamilms_express",
            ttl: 14 * 24 * 60 * 60 * 1000, // = 14 days. Default
          }),
        })
      );
      app.use(expressSessionPassportCleanup);

      // Initialize Passport and restore authentication state, if any, from the
      // session.
      app.use(passport.initialize());
      app.use(passport.session());

      app.use(function log_user_route(req, res, next) {
        if (!!req.user) {
          Models["log"].create(
            {
              uid: req.user.uid,
              log_name: req.originalUrl,
              create_time: new Date(),
            },
            function (err, log_date) {
              return next();
            }
          );
        } else {
          return next();
        }
      });
      //
      // var get_final_ionic = require('./api/get_final_ionic.js');
      // app.use(get_final_ionic(passport, Models));

      // 公共路由
      var public_routes = require("./route/public.js");
      public_routes(app, passport);

      // ionic 檔案路由
      var get_ionic_file = require("./api/get_ionic_file.js");
      app.use(get_ionic_file(passport, Models));

      //遮蔽私有與公共路由
      app.use(function gamilms_secure(req, res, next) {
        if (req.isAuthenticated()) {
          next();
        } else {
          console.log(req.path);
          res.status(404);
          res.send(" ");
        }
      });

      // 應用編譯佇列
      var build_app = require(process.cwd() + "/api/build_app.js")(Models);

      // 私有API
      var private_routes = require("./route/private.js");
      private_routes(app, passport, Models, build_app);

      // Handle 404
      app.use(function gamilms_404(req, res) {
        res.status(404);
        res.render("404", {
          layout: false,
          project_name: "/" + server_config.project_name,
        });
      });

      // Handle 500
      app.use(function gamilms_505(error, req, res, next) {
        console.log(error);
        res.status(500);
        res.render("500", {
          layout: false,
          error: error,
          project_name: "/" + server_config.project_name,
        });
      });

      var server = app.listen(PORT);
      require(process.cwd() + "/tool/wellcome.js")(HOST + ":" + PORT);
      // 伺服起關閉時，關閉資料庫連線
      ON_DEATH(function (signal, err) {
        mongoose.connection.close(function () {
          console.log(colors.red("\nMongoose connection disconnected\n"));
          (function countDown(counter) {
            if (counter > 0) {
              console.log(colors.red("距伺服器關閉還有" + counter + "秒！"));
              return setTimeout(countDown, 500, counter - 1);
            } else {
              console.log(colors.red("Server closed!"));
              server.close();
              process.exit();
            }
          })(1);
        });
      });
    }
  );
});
