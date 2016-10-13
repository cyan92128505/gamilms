var file_tree = require(process.cwd() + '/tool/file_tree.js');
var project_name = '/' + require(process.cwd() + '/config/server_config.json').project_name;
module.exports = function(app, passport, Models, build_app) {
    var config = {
        getGamer: require(process.cwd() + '/api/getGamer.js'),
        look_at_where: require(process.cwd() + '/api/look_at_where.js'),
        onboarding_over: require(process.cwd() + '/api/onboarding.js').over,
        onboarding_getterm: require(process.cwd() + '/api/onboarding.js').getterm,

        savefile: require(process.cwd() + '/api/ionicfile.js').savefile,
        editfile: require(process.cwd() + '/api/ionicfile.js').editfile,
        destroyfile: require(process.cwd() + '/api/ionicfile.js').destroyfile,
        create_project: require(process.cwd() + '/api/ionicfile.js').create_project,
        create_file_tree: require(process.cwd() + '/api/ionicfile.js').create_file_tree,
        node_file_tree: require(process.cwd() + '/api/ionicfile.js').node_file_tree,
        final_project: require(process.cwd() + '/api/ionicfile.js').final_project,
        step_info: require(process.cwd() + '/api/ionicfile.js').step_info,
        switch_step_code: require(process.cwd() + '/api/ionicfile.js').switch_step_code,
        save_step: require(process.cwd() + '/api/ionicfile.js').save_step,
        next_step: require(process.cwd() + '/api/ionicfile.js').next_step,
        clean_code_raw: require(process.cwd() + '/api/ionicfile.js').clean_code_raw,

        getleaderboard: require(process.cwd() + '/api/getleaderboard.js'),

        video: require(process.cwd() + '/api/video.js').video,
        get_quest: require(process.cwd() + '/api/video.js').quest,
        video_info: require(process.cwd() + '/api/video.js').video,
        video_ended: require(process.cwd() + '/api/video.js').video_ended,

        admin_ctrl: require(process.cwd() + '/api/admin_ctrl.js'),

        get_icons_path: require(process.cwd() + '/api/get_icons_path.js'),

        get_survey: require(process.cwd() + '/api/survey.js').get_survey,
        store_survey: require(process.cwd() + '/api/survey.js').store_survey,

        save_survey: require(process.cwd() + '/api/pubilc_survey.js').save_survey,

        get_arch_list: require(process.cwd() + '/api/arch.js').get_arch_list,
        create_arch: require(process.cwd() + '/api/arch.js').create_arch,
        create_badge: require(process.cwd() + '/api/arch.js').create_badge,
        get_badge: require(process.cwd() + '/api/arch.js').get_badge,
        get_badge_list: require(process.cwd() + '/api/arch.js').get_badge_list,
        update_badge:  require(process.cwd() + '/api/arch.js').update_badge
    };

    var static_template = {
        profile: function(req, res, next) {
            return res.render('home/profile');
        },
        code: function(req, res, next) {
            return res.render('home/code');
        },
        video: function(req, res, next) {
            return res.render('home/video');
        },
        leaderboard: function(req, res, next) {
            return res.render('home/leaderboard');
        },
        badge: function(req, res, next) {
            return res.render('home/badge');
        },
        about: function(req, res, next) {
            return res.render('home/about');
        },
        subject: function(req, res, next) {
            return res.render('home/subject');
        },
        hide: function(req, res, next) {
            return res.send('');
        }
    };




    //admin
    app.get(project_name + '/admin/:custom_query', config.admin_ctrl.findALL(Models));
    app.post(project_name + '/admin_create', config.admin_ctrl.create(Models));
    app.post(project_name + '/admin_jsdiff', config.admin_ctrl.jsdiff());
    app.post(project_name + '/admin_js2json', config.admin_ctrl.js2json());
    app.post(project_name + '/gender', config.admin_ctrl.gender());

    //application
    app.post(project_name + '/look_at_where', config.look_at_where(Models));
    app.post(project_name + '/onboarding_over', config.onboarding_over(Models));
    app.get(project_name + '/onboarding_getterm', config.onboarding_getterm());

    //api/code
    app.get(project_name + '/node_file_tree', config.node_file_tree(Models));
    app.get(project_name + '/create_file_tree', config.create_file_tree(Models));
    app.post(project_name + '/savefile', config.savefile(Models));
    app.get(project_name + '/step_info/:trip_step', config.step_info(Models));
    app.get(project_name + '/switch_step_code/:trip_step', config.switch_step_code(Models));
    app.post(project_name + '/save_step', config.save_step(Models));
    app.post(project_name + '/next_step', config.next_step(Models));
    app.post(project_name + '/clean_code', config.clean_code_raw());
    app.post(project_name + '/editfilename', config.editfile(Models));
    app.post(project_name + '/destroyfile', config.destroyfile(Models));
    app.get(project_name + '/build_app', build_app.add_queue);
    app.get(project_name + '/check_apk_state', build_app.check_apk_state);
    app.get(project_name + '/create_project', config.create_project(Models));
    app.get(project_name + '/final_project', config.final_project(Models));

    //api/profile
    app.get(project_name + '/getGamer', config.getGamer(Models));
    app.get(project_name + '/getGamer/:uid', config.getGamer(Models));

    //api/leaderboard
    app.get(project_name + '/getleaderboard', config.getleaderboard(Models));

    //api/video|subject
    app.get(project_name + '/get_video/:vid', config.video(Models));
    app.get(project_name + '/get_video', config.video(Models));
    app.get(project_name + '/get_video_info', config.video_info(Models));
    app.post(project_name + '/video_ended', config.video_ended(Models));
    app.post(project_name + '/video_quest', config.video_ended(Models));

    //api/survey
    app.get(project_name + '/get_survey/:survey', config.get_survey(Models));
    app.post(project_name + '/store_survey/:survey', config.store_survey(Models));

    app.post(project_name + '/save_survey/', config.save_survey(Models));

    //api/arch|quest|badge
    app.get(project_name + '/get_quest/:vid', config.get_quest(Models));
    app.get(project_name + '/get_arch_list', config.get_arch_list(Models));
    app.post(project_name + '/create_arch', config.create_arch(Models));
    app.post(project_name + '/create_badge', config.create_badge(Models));
    app.get(project_name + '/get_badge/:aid', config.get_badge(Models));
    app.get(project_name + '/get_badge_list', config.get_badge_list(Models));
    app.post(project_name + '/update_badge', config.update_badge(Models));


    app.get(project_name + '/get_icons_path', config.get_icons_path());

    //page route
    app.get(project_name + '/profile', static_template.profile)
    app.get(project_name + '/code', static_template.code);
    app.get(project_name + '/video', static_template.video);
    app.get(project_name + '/leaderboard', static_template.leaderboard);
    app.get(project_name + '/badge', static_template.badge);
    app.get(project_name + '/about', static_template.about);
    app.get(project_name + '/subject', static_template.subject);
    app.get(project_name + '/hide', static_template.hide)
};
