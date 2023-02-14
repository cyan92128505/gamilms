var events = require('events');
var eventEmitter = new events.EventEmitter();
var fsx = require('fs-extra');
var phaser_steps = require(process.cwd() + '/document/phaser_tutorial.json').trips[0].steps;
var phaser_md = require(process.cwd() + '/document/phaser_md.json');
var phaser_tutorial_md_raw = require(process.cwd() + '/document/phaser_tutorial_md.json');


// eventEmitter.on('steps', function(option) {
//     var phaser_md = option.phaser_md;
//     if (option.index < phaser_steps.length) {
//         var terms_queue = phaser_steps[option.index].step_info;
//         var temp_md_array = [];
//         for (var i = 0; i < terms_queue.length; i++) {
//             switch (terms_queue[i].type) {
//                 case 'text':
//                     temp_md_array.push('####' + terms_queue[i].content + '\n');
//                     break;
//                 case 'code':
//                     for (var j = 0; j < terms_queue[i].content.length; j++) {
//                         if (j === 0) {
//                             temp_md_array.push('```\n');
//                         }
//                         temp_md_array.push(terms_queue[i].content[j].replace(/[\s]{4}/gm, '\t') + '\n');
//                         if ((j + 1) === terms_queue[i].content.length) {
//                             temp_md_array.push('```\n');
//                         }
//                     }
//                     break;
//                 case 'img':
//                     temp_md_array.push('![' + /[a-zA-Z0-9]+\.(jpg|png|gif)/.exec(terms_queue[i].content)[0] + '](' + terms_queue[i].content + ')\n\n');
//                     break;
//                 default:
//             }
//             if ((i + 1) === terms_queue.length) {
//                 phaser_md.push({
//                     step_name: phaser_steps[option.index].step_name,
//                     md_content: temp_md_array
//                 });
//                 eventEmitter.emit('steps', {
//                     index: option.index + 1,
//                     phaser_md: phaser_md
//                 });
//             }
//         }
//     } else {
//         fsx.outputJson(process.cwd() + '/document/phaser_md.json', phaser_md, function(err) {
//             if (err) {
//                 console.log(err);
//             }
//             console.log('convert over!');
//         });
//     }
// });
eventEmitter.on('term_json_md', function(option) {
    var phaser_tutorial_md = option.phaser_tutorial_md;
    if (option.index < phaser_md.length) {
        var temp_md_queue = phaser_md[option.index].md_content;
        var temp_md_array = [];
        var temp_md_term = '';
        for (var i = 0; i < temp_md_queue.length; i++) {
            if (!/[\=]{80}/.test(temp_md_queue[i])) {
                temp_md_term = temp_md_term + temp_md_queue[i];
            } else {
                temp_md_array.push(temp_md_term);
                temp_md_term = '';
            }
            if ((i + 1) === temp_md_queue.length) {
                phaser_tutorial_md.push({
                    step_name: phaser_md[option.index].step_name,
                    md_array: temp_md_array,
                    md_title: phaser_tutorial_md_raw[option.index].md_title,
                    quest: phaser_md[option.index].quest
                });
                eventEmitter.emit('term_json_md', {
                    index: option.index + 1,
                    phaser_tutorial_md: phaser_tutorial_md
                });
            }
        }
    } else {
        fsx.outputJson(process.cwd() + '/document/phaser_tutorial_md.json', phaser_tutorial_md, function(err) {
            var md_length = [];
            var md_sum = 0;
            var quest_length = [];
            var quest_sum = 0;
            var fibonacci = [1, 2, 3, 4, 5, 20, 20, 30, 60];
            if (err) {
                console.log(err);
            }
            console.log('convert over!');
            for (var i = 0; i < phaser_tutorial_md.length; i++) {
                md_length.push(phaser_tutorial_md[i].md_array.length);
                md_sum = md_sum + phaser_tutorial_md[i].md_array.length;
                quest_length.push(phaser_tutorial_md[i].quest.length);
                quest_sum = quest_sum + phaser_tutorial_md[i].quest.length;
                if ((i + 1) === phaser_tutorial_md.length) {
                    console.log(fibonacci);
                    fibonacci = fibonacci.map(function(element, index) {
                        return ~~(md_length[index] * element);
                    });
                    console.log(fibonacci);
                    console.log(13 * 10);
                    console.log(fibonacci.reduce(function(a, b) {
                        return a + b;
                    }));
                    console.log(fibonacci.reduce(function(a, b) {
                        return a + b;
                    }) + 13 * 10);
                    console.log(md_length);
                    console.log('md:' + md_sum);
                    console.log(quest_length);
                    console.log('quest:' + quest_sum);
                }
            }
        });
    }
});
// eventEmitter.on('save_md', function(option) {});
// eventEmitter.emit('steps', {
//     index: 0,
//     phaser_md: []
// });
// eventEmitter.emit('term_json_md', {
//     index: 0,
//     phaser_tutorial_md: []
// });

for (var i = 0; i < phaser_tutorial_md_raw.length; i++) {
    console.log(i + ':');
    for (var j = 0; j < phaser_tutorial_md_raw[i].quest.length; i++) {
        console.log(phaser_tutorial_md_raw[i].quest[j].quest_title);
        console.log(phaser_tutorial_md_raw[i].quest[j].quest_terms);
    }
}
