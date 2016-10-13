var request = require('request');
var traverse = require('traverse');
var clean_code = require(process.cwd() + '/tool/clean_code.js');
var escape = require(process.cwd() + '/tool/escape.js');
var difflib = require(process.cwd() + '/tool/difflib.js');
var code_array = require(process.cwd() + '/tool/code_array.js');
var phaser_tutorial = require(process.cwd() + '/document/phaser_tutorial.json');
var events = require('events');
var fs = require('fs');
var fsx = require('fs-extra');
var eventEmitter = new events.EventEmitter();
var files_sum = 9;

eventEmitter.on('init', function(option) {
    var url_queues = [];
    for (var i = 0; i < files_sum; i++) {
        url_queues.push(process.cwd() + '/phaser/1_' + (i + 1) + '.js');
        if ((i + 1) === files_sum) {
            console.log(url_queues);
            eventEmitter.emit('phaser_file', {
                index: 0,
                queue: url_queues,
                prefer: []
            });
        }
    }
});

eventEmitter.on('step', function(option) {
    if (option.index < files_sum) {
        fs.readFile(option.queue[option.index], 'utf8', function(err, data) {
            if (err) {
                console.log(err);
            }
            clean_code(data, function(err, data) {
                fs.writeFile(option.queue[option.index], data, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    eventEmitter.emit('step', {
                        index: option.index + 1,
                        queue: option.queue
                    });
                });
            });
        });
    }
    if (option.index === files_sum) {
        // eventEmitter.emit('diff_init', {
        //     queue: option.queue
        // });
        eventEmitter.emit('code_line_array', {
            index: 0,
            queue: option.queue
        });
    }
});

eventEmitter.on('code_line_array', function(option) {
    if (option.index < files_sum) {
        fs.readFile(option.queue[option.index], 'utf8', function(err, data) {
            if (err) {
                console.log(err);
            }
            clean_code(data, function(err, code_line_array_raw) {
                fsx.outputJson(
                    option.queue[option.index] + 'on',
                    difflib.stringAsLines(code_line_array_raw).map(function(element, index, array) {
                        return JSON.parse('{"index_' + index + '":"' + element + '"}');
                    }),
                    function(err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log('create ' + option.queue[option.index] + 'on');
                        eventEmitter.emit('code_line_array', {
                            index: option.index + 1,
                            queue: option.queue
                        });
                    });
            });
        });
    }
});

eventEmitter.on('diff_init', function(option) {
    var data_a = '';
    var diff = [];
    fs.readFile(option.queue[0], 'utf8', function(err, data_b) {
        var base = difflib.stringAsLines(data_a);
        var newtxt = difflib.stringAsLines(data_b);
        var sm = new difflib.SequenceMatcher(base, newtxt);
        var opcodes = sm.get_opcodes();
        diff.push(opcodes);
        eventEmitter.emit('diff', {
            index: 1,
            queue: option.queue,
            diff: diff
        });
    });

});

eventEmitter.on('diff', function(option) {
    var diff = option.diff;
    var diff_codes = option.diff_codes;
    if (option.index < files_sum) {
        fs.readFile(option.queue[option.index], 'utf8', function(err, data_b) {
            if (err) {
                console.log(err);
            }
            fs.readFile(option.queue[option.index - 1], 'utf8', function(err, data_a) {
                if (err) {
                    console.log(err);
                }
                var base = difflib.stringAsLines(data_a);
                var newtxt = difflib.stringAsLines(data_b);
                var sm = new difflib.SequenceMatcher(base, newtxt);
                var opcodes = sm.get_opcodes();
                diff.push(opcodes);
                eventEmitter.emit('diff', {
                    index: option.index + 1,
                    queue: option.queue,
                    diff: diff
                });
            });
        });
    }
    if (option.index === files_sum) {
        fsx.outputJson(process.cwd() + '/phaser/1_diff.json', diff, function(err) {
            console.log('create diff json file');
            eventEmitter.emit('prefer', {
                index: 0,
                queue: option.queue,
                diff: diff,
                prefer: [{
                    file_name: '/js/game_1_0.js',
                    file_content: ' ',
                    type: 'file'
                }]
            });
        });
    }
});

eventEmitter.on('prefer', function(option) {
    var prefer = option.prefer;
    if (option.index < files_sum) {
        fs.readFile(option.queue[option.index], 'utf8', function(err, code) {
            prefer.push({
                file_name: '/js/game_1_' + (option.index + 1) + '.js',
                file_content: escape.escape(code),
                type: 'file'
            });
            eventEmitter.emit('prefer', {
                index: option.index + 1,
                queue: option.queue,
                prefer: prefer,
                diff: option.diff
            });
        });
    }
    if (option.index === files_sum) {
        fsx.outputJson(process.cwd() + '/document/default_phaser.json', prefer, function(err) {
            var diff_code = [];
            if (err) console.log(err);
            console.log('create prefer json file');
            // for (var i = 0; i < files_sum; i++) {
            //     diff_code.push([]);
            //     if ((i + 1) === files_sum) {
            //         eventEmitter.emit('diff_code', {
            //             index: 0,
            //             queue: option.queue,
            //             prefer: prefer,
            //             diff: option.diff,
            //             diff_code: diff_code
            //         });
            //     }
            // }
        });
    }
});

eventEmitter.on('diff_code', function(option) {
    var diff = option.diff[option.index];
    var diff_code = option.diff_code;
    if (option.index < files_sum) {
        fs.readFile(option.queue[option.index], 'utf8', function(err, file_raw) {
            var file = difflib.stringAsLines(file_raw);
            var diff_code_temp = [];
            var diff_term_index = 0;
            for (var i = 0; i < diff.length; i++) {
                if (/(insert|replace)/.test(diff[i][0])) {
                    diff_code[option.index].push({
                        diff_type: diff[i][0],
                        old_init_index: diff[i][1],
                        old_final_index: diff[i][2],
                        new_init_index: diff[i][3],
                        new_final_index: diff[i][4],
                        diff_code_array: []
                    });
                    for (var j = diff[i][3]; j < (diff[i][4] + 1); j++) {
                        if (file[j]) {
                            diff_code[option.index][diff_term_index].diff_code_array.push(file[j]);
                        }
                        if (j === diff[i][4]) {
                            diff_term_index = diff_term_index + 1;
                        }
                    }
                }
                if ((i + 1) === diff.length) {
                    eventEmitter.emit('diff_code', {
                        index: option.index + 1,
                        queue: option.queue,
                        prefer: option.prefer,
                        diff: option.diff,
                        diff_code: diff_code
                    });
                }
            }
        });
    }
    if ((option.index) === files_sum) {
        fsx.outputJson(process.cwd() + '/document/diff_code_form_phaser.json', option.diff_code, function(err) {
            if (err) console.log(err);
            console.log('create code diff array!');
            eventEmitter.emit('collect_phaser_code', {
                index: 0,
                diff_code: diff_code,
                collect_phaser_code: []
            });
        });
    }
});

eventEmitter.on('collect_phaser_code', function(option) {
    var collect_phaser_code = option.collect_phaser_code;
    var collect_temp_array = [];
    if (option.index < files_sum) {
        for (var i = 0; i < option.diff_code[option.index].length; i++) {
            for (var j = 0; j < option.diff_code[option.index][i].diff_code_array.length; j++) {
                collect_temp_array.push(option.diff_code[option.index][i].diff_code_array[j]);
            }
            if ((i + 1) === option.diff_code[option.index].length) {
                option.collect_phaser_code.push(collect_temp_array);
                eventEmitter.emit('collect_phaser_code', {
                    index: option.index + 1,
                    diff_code: option.diff_code,
                    collect_phaser_code: collect_phaser_code
                });
            }
        }
    } else {

        fsx.outputJson(process.cwd() + '/document/collect_phaser_code.json', option.collect_phaser_code, function(err) {
            if (err) console.log(err);
            console.log('create collect_phaser_code!');
            // eventEmitter.emit('create_subject', {
            //     collect_phaser_code: option.collect_phaser_code
            // });
        })
    }
});

// eventEmitter.on('create_subject', function(option) {
//     var collect_phaser_code = option.collect_phaser_code;
//     for (var i = 0; i < phaser_tutorial.trips[0].steps.length; i++) {
//         phaser_tutorial.trips[0].steps[i].step_info = [{
//             type: 'text',
//             content: phaser_tutorial.trips[0].steps[i].step_info
//         }, {
//             type: 'code',
//             content: collect_phaser_code[i]
//         }];
//         if ((i + 1) === phaser_tutorial.trips[0].steps.length) {
//             fsx.outputJson(process.cwd() + '/document/phaser_tutorial.json', phaser_tutorial, function(err) {
//                 if (err) console.log(err);
//                 console.log('create phaser_tutorial!');
//             });
//         }
//     }
// });
eventEmitter.on('phaser_file', function(option) {
    var prefer = option.prefer;
    var _index = option.index;
    if (_index < files_sum) {
        fs.readFile(option.queue[_index], 'utf8', function(err, code) {
            prefer.push({
                file_name: '/js/game_1_' + _index + '.js',
                file_content: escape.escape(code),
                type: 'file'
            });
            console.log(_index);
            return eventEmitter.emit('phaser_file', {
                index: _index + 1,
                queue: option.queue,
                prefer: prefer
            });
        });
    }
    if (option.index === files_sum) {
        fsx.outputJson(process.cwd() + '/document/default_phaser.json', prefer, function(err) {
            if (err) console.log(err);
            console.log('create prefer json file');
            // for (var i = 0; i < files_sum; i++) {
            //     diff_code.push([]);
            //     if ((i + 1) === files_sum) {
            //         eventEmitter.emit('diff_code', {
            //             index: 0,
            //             queue: option.queue,
            //             prefer: prefer,
            //             diff: option.diff,
            //             diff_code: diff_code
            //         });
            //     }
            // }
        });
    }
});

eventEmitter.emit('init');
