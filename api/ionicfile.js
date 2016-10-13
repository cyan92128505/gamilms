var create_file_tree = require(process.cwd() + '/tool/file_tree.js');
var clean_code = require(process.cwd() + '/tool/clean_code.js');
var escape = require(process.cwd() + '/tool/escape.js');
var difflib = require(process.cwd() + '/tool/difflib.js');
var final_ionic = require(process.cwd() + '/document/final_ionic.json');
var project_ionic = require(process.cwd() + '/document/project_ionic.json');
var phaser_tutorial = require(process.cwd() + '/document/phaser_tutorial.json');
var phaser_tutorial_md = require(process.cwd() + '/document/phaser_tutorial_md.json');
var default_phaser = require(process.cwd() + '/document/default_phaser.json');

var fsx = require('fs-extra');
var fs = require('fs');

function Inoicfile_add(updatequery, _result, _callback) {
    var add_file = {
        file_name: updatequery.file_name,
        file_content: updatequery.file_content,
        type: 'file'
    };
    _result.files.push(add_file);
    _callback(false, _result);
};


function Ionicfile_view(req, res, updatequery, Models, _callback) {
    Models['ionicfile'].findOne({
        uid: req.user.uid
    }, function(err, _result) {
        var remove = [];
        for (var i = 0; i < _result.files.length; i++) {
            if (_result.files[i].file_name === updatequery.file_name) {
                switch (updatequery.option) {
                    case 'save':
                        _result.files[i].file_content = updatequery.file_content;
                        break;
                    case 'edit':
                        if (updatequery.edit_file_name) {
                            _result.files[i].file_name = updatequery.edit_file_name;
                        }
                        break;
                    case 'destroy':
                        remove = _result.files.splice(i, 1);
                        break;
                    default:
                }
                return _callback(false, _result);
            }
            if ((i + 1 === _result.files.length) && (_result.files[i].file_name !== updatequery.file_name) && updatequery.option === 'save') {
                return Inoicfile_add(updatequery, _result, _callback);
            }
        }
    });
};

function ionicfile_file_tree(uid, Models, callback) {
    Models['ionicfile'].findOne({
        uid: uid
    }, function(err, ionicfile_result) {
        var file_list = [];
        if (ionicfile_result) {
            for (var i = 0; i < ionicfile_result.files.length; i++) {
                file_list[i] = {
                    'file_name': ionicfile_result.files[i].file_name,
                    'type': ionicfile_result.files[i].type
                };

                if ((i + 1) === ionicfile_result.files.length) {
                    create_file_tree(file_list, function(file_tree_object) {
                        callback(file_tree_object);
                    });
                }
            }
        } else {
            for (var i = 0; i < final_ionic.length; i++) {
                file_list[i] = {
                    'file_name': final_ionic[i].file_name,
                    'type': final_ionic[i].type
                };

                if ((i + 1) === final_ionic.length) {
                    create_file_tree(file_list, function(file_tree_object) {
                        callback(file_tree_object);
                    });
                }
            }
        }
    });
};


module.exports = {
    savefile: function savefile(Models) {
        return function(req, res, next) {
            if (!!req.user.uid && !!req.body.file_name) {
                var updatequery = {
                    option: 'save',
                    edit_file_name: null,
                    file_name: req.body.file_name,
                    file_content: req.body.content,
                    file_type: 'file'
                };
                if (updatequery.file_content === '') {
                    updatequery.file_content = ' ';
                }
                Ionicfile_view(req, res, updatequery, Models, function(_err, _result) {
                    Models['ionicfile'].update({
                        uid: req.user.uid
                    }, {
                        files: _result.files
                    }, function(_err, Ionicfile_result) {
                        return res.send(Ionicfile_result);
                    });
                });
            } else {
                next();
            }
        }
    },
    clean_code_raw: function clean_code_raw() {
        return function(req, res, next) {
            if (!!req.body.code) {
                clean_code(escape.unescape(req.body.code), function(err, code) {
                    return res.send(code);
                });
            }
        }
    },
    step_info: function step_info(Models) {
        return function(req, res, next) {
            Models['user'].findOne({
                uid: req.user.uid
            }, function(err, user_data) {
                if (req.params.trip_step.split('_')[1] < phaser_tutorial.trips[req.params.trip_step.split('_')[0]].steps.length) {
                    return res.send(phaser_tutorial.trips[req.params.trip_step.split('_')[0]].steps[req.params.trip_step.split('_')[1]]);
                } else {
                    return res.send({
                        "step_name": "課程結束",
                        "step_info": [{
                            type: 'text',
                            content: "恭喜" + req.user.username + "，你已經通過全部的課程！"
                        }],
                        "finish": true
                    });
                }
            });
        };
    },
    save_step: function save_step(Models) {
        return function(req, res, next) {
            if (!!req.user.uid && !!req.body.file_name) {
                var updatequery = {
                    option: 'save',
                    edit_file_name: null,
                    file_name: req.body.file_name,
                    file_content: req.body.content,
                    file_type: 'file'
                }
                Ionicfile_view(req, res, updatequery, Models, function(_err, _result) {
                    Models['ionicfile'].update({
                        uid: req.user.uid
                    }, {
                        files: _result.files
                    }, function(_err, Ionicfile_result) {
                        return res.send(Ionicfile_result);
                    });
                });
            } else {
                next();
            }
        }
    },
    switch_step_code: function switch_step_code(Models) {
        return function(req, res, next) {
            if (!!req.user.uid) {
                Models['user'].findOne({
                    uid: req.user.uid
                }, function(err, prep_user_data) {

                });
            }
        };
    },
    next_step: function next_step(Models) {
        return function(req, res, next) {
            if (!!req.user.uid) {
                Models['user'].update({
                    uid: req.user.uid
                },{
                    point: req.body.point
                }, function(err, user_data) {
                    var switch_ionic = false
                    // if (switch_ionic && user_data.point < phaser_tutorial.trips[user_data.level - 1].steps.length) {
                    //     clean_code(escape.unescape(req.body.content), function(err, code) {
                    //         var updatequery = {
                    //             option: 'save',
                    //             edit_file_name: null,
                    //             file_name: req.body.file_name,
                    //             file_content: code,
                    //             file_type: 'file'
                    //         };
                    //         Ionicfile_view(req, res, updatequery, Models, function(_err, _result) {
                    //             Models['ionicfile'].update({
                    //                 uid: req.user.uid
                    //             }, {
                    //                 files: _result.files
                    //             }, function(_err, Ionicfile_result) {
                    //                 var student_file = difflib.stringAsLines(code);
                    //                 var ref_file = difflib.stringAsLines(clean_code(escape.unescape(default_phaser[user_data.point + 1].file_content), false));
                    //                 var sm = new difflib.SequenceMatcher(ref_file, student_file);
                    //                 var opcodes = sm.get_opcodes();
                    //                 var error_term_sum = 0;
                    //                 var error_term = []
                    //                 for (var i = 0; i < opcodes.length; i++) {
                    //                     if (!(/(equal)/.test(opcodes[i][0]))) {
                    //                         error_term_sum = error_term_sum + 1;
                    //                         for (var j = opcodes[i][3]; j < (opcodes[i][4] + 1); j++) {
                    //                             error_term.push((j + 1) + '：' + student_file[j]);
                    //                         }
                    //                     }
                    //                     if ((i + 1) === opcodes.length) {
                    //                         if (error_term_sum === 0) {
                    //                             if (user_data.point < phaser_tutorial.trips[user_data.level - 1].steps.length) {
                    //                                 Models['user'].update({
                    //                                     uid: req.user.uid
                    //                                 }, {
                    //                                     point: user_data.point + 1
                    //                                 }, function(err, update_data) {
                    //                                     Models['user'].findOne({
                    //                                         uid: req.user.uid
                    //                                     }, function(err, sec_user_data) {
                    //                                         if (sec_user_data.point < phaser_tutorial.trips[sec_user_data.level - 1].steps.length - 1) {
                    //                                             var step_data = phaser_tutorial.trips[sec_user_data.level - 1].steps[sec_user_data.point];
                    //                                             step_data['finish'] = true;
                    //                                             return res.send(step_data);
                    //                                         } else {
                    //                                             return res.send({
                    //                                                 "step_name": "課程結束",
                    //                                                 "step_info": [{
                    //                                                     type: 'text',
                    //                                                     content: "恭喜" + req.user.username + "，你已經通過全部的課程！"
                    //                                                 }],
                    //                                                 "finish": true
                    //                                             });
                    //                                         }
                    //                                     });
                    //                                 });
                    //                             } else {
                    //                                 // Models['user'].update({
                    //                                 //     uid: req.user.uid
                    //                                 // }, {
                    //                                 //     point: 0,
                    //                                 //     level: user_data.level + 1
                    //                                 // }, function(err, update_data) {
                    //                                 //     Models['user'].findOne({
                    //                                 //         uid: req.user.uid
                    //                                 //     }, function(err, sec_user_data) {
                    //                                 //         console.log(sec_user_data);
                    //                                 //         var step_data = phaser_tutorial.trips[sec_user_data.level - 1].steps[sec_user_data.point];
                    //                                 //         step_data['finish'] = true;
                    //                                 //         return res.send(step_data);
                    //                                 //     });
                    //                                 // });
                    //                                 return res.send({
                    //                                     "step_name": "課程結束",
                    //                                     "step_info": [{
                    //                                         type: 'text',
                    //                                         content: "恭喜" + req.user.username + "，你已經通過全部的課程！"
                    //                                     }],
                    //                                     "finish": true
                    //                                 });
                    //                             }
                    //                         } else {
                    //                             return res.send({
                    //                                 "step_name": "程式錯誤",
                    //                                 "step_info": [{
                    //                                     type: 'text',
                    //                                     content: "包含以下錯誤"
                    //                                 }, {
                    //                                     type: 'code',
                    //                                     content: error_term
                    //                                 }],
                    //                                 "finish": false
                    //                             });
                    //                         }
                    //                     }
                    //                 }
                    //             });
                    //         });
                    //     });
                    // } else {
                        return res.send('');
                        // return res.send({
                        //     "step_name": "課程結束",
                        //     "step_info": [{
                        //         type: 'text',
                        //         content: "恭喜" + req.user.username + "，你已經通過全部的課程！"
                        //     }],
                        //     "finish": true
                        // });
                    // }
                });
            } else {
                next();
            }
        }
    },
    editfile: function editfile(Models) {
        return function(req, res, next) {
            if (!!req.user.uid && !!req.body.file_name) {
                var updatequery = {
                    option: 'edit',
                    edit_file_name: req.body.edit_file_name,
                    file_name: req.body.file_name,
                    file_content: null,
                    file_type: 'file'
                };
                Ionicfile_view(req, res, updatequery, Models, function(_err, _result) {
                    Models['ionicfile'].update({
                        uid: req.user.uid
                    }, {
                        files: _result.files
                    }, function(_err, Ionicfile_result) {
                        return res.send(Ionicfile_result);
                    });
                });
            } else {
                next();
            }
        };
    },
    destroyfile: function destroyfile(Models) {
        return function(req, res, next) {
            if (!!req.user.uid && !!req.body.file_name) {
                var updatequery = {
                    option: 'destroy',
                    edit_file_name: null,
                    file_name: req.body.file_name,
                    file_content: null,
                    file_type: 'file'
                };
                Ionicfile_view(req, res, updatequery, Models, function(_err, _result) {
                    Models['ionicfile'].update({
                        uid: req.user.uid
                    }, {
                        files: _result.files
                    }, function(_err, Ionicfile_result) {
                        return res.send(Ionicfile_result);
                    });
                });
            } else {
                next();
            }
        };
    },
    node_file_tree: function(Models) {
        return function(req, res, next) {
            ionicfile_file_tree(req.user.uid, Models, function(file_tree_object) {
                var file_tree = file_tree_object.node_structure;
                return res.send(file_tree);
            });
        };
    },
    create_file_tree: function(Models) {
        return function(req, res, next) {
            ionicfile_file_tree(req.user.uid, Models, function(file_tree_object) {
                var file_tree = file_tree_object.html;
                return res.send(file_tree);
            });
        };
    },
    create_project: function(Models) {
        return function(req, res, next) {
            Models['ionicfile'].update({
                uid: req.user.uid
            }, {
                files: project_ionic
            }, function(_err, Ionicfile_result) {
                return res.send({
                    state: 'create project success!'
                });
            });
        };
    },
    final_project: function(Models) {
        return function(req, res, next) {
            Models['ionicfile'].update({
                uid: req.user.uid
            }, {
                files: final_ionic
            }, function(_err, Ionicfile_result) {
                return res.send({
                    state: 'create final success!'
                });
            });
        };
    }
};
