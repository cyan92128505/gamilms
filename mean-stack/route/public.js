module.exports = function (app, passport) {
  var project_name =
    "/" + require(process.cwd() + "/config/server_config.js").project_name;
  var config = {
    public_root: function (req, res, next) {
      return res.send("server on " + project_name);
    },
    home: function (req, res, next) {
      if (req.isAuthenticated()) {
        return res.render("home/home", {
          uid: req.user.uid,
          project_name: project_name,
        });
      } else {
        return res.render("auth/index", {
          project_name: project_name,
        });
      }
    },
    login: function (req, res, next) {
      return res.render("auth/index", {
        project_name: project_name,
      });
    },
    login_facebook_return: function (req, res, next) {
      return res.redirect(project_name);
    },
    admin: function (req, res, next) {
      return res.render("admin/index", {
        project_name: project_name,
      });
    },
    fake_user: function (req, res, next) {
      return res.render("admin/fake_user", {
        project_name: project_name,
      });
    },
    logout: function (req, res, next) {
      req.logout();
      return res.redirect(project_name);
    },
  };

  app.get("/", config.public_root);
  app.get(project_name, config.home);
  app.get(project_name + "/login", config.login);
  app.get(project_name + "/login/facebook", passport.authenticate("facebook"));
  app.get(
    project_name + "/login/facebook/return",
    passport.authenticate("facebook", {
      successRedirect: project_name,
      failureRedirect: project_name + "/login",
    })
  );
  app.get(project_name + "/admin", config.admin);

  app.get(project_name + "/fake_user", config.fake_user);
  app.get(project_name + "/logout", config.logout);
};
