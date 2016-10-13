// var file_list = [
//     '/floder_1/floder_1_1/file_1.log',
//     '/floder_1/floder_1_1/file_2.log',
//     '/floder_2/floder_2_1/file_3.log',
// ];
// var pre_node_name = 'root';
// var pre_node_list = [
//     ['floder1', 'floder1_1', 'file1.log'],
//     ['floder1', 'floder1_1', 'file2.log'],
//     ['floder2', 'floder1_1', 'file1.log']
// ];
// var node_structure = {
//     node_name: 'root',
//     node_list: [{
//         node_name: 'floder1',
//         node_list: [{
//             node_name: 'floder1_1',
//             node_list: [{
//                 node_name: 'file1.log',
//                 node_list: [],
//             }, {
//                 node_name: 'file2.log',
//                 node_list: [],
//             }],
//         }],
//     }, {
//         node_name: 'floder2',
//         node_list: [{
//             node_name: 'floder2_1',
//             node_list: [{
//                 node_name: 'file3.log',
//                 node_list: [],
//             }],
//         }],
//     }]
// };
// 大家好，我遇到了有關資料結構的問題
// 該程式的目的是要將檔案網址轉變成樹狀結構
// 目前的演算法：
// 1.
// 先將檔案網址
// '/floder_1/floder_1_1/file_1.log'
// 轉變成
// ['floder1', 'floder1_1', 'file1.log']
// 檔案網址一維陣列變成二維陣列
// 2.
// 取出第二維陣列的首項元素，形成當層的元素陣列
// 3.
//
// 遍歷層元素陣列元素與第二維陣列的首項元素比較
//
//
// https://jsbin.com/hohifefine/1/edit?js,console

var create_files_array = function create_files_array(option, callback) {
    var layer_file_name = option.layer_file_name,
        files_array = option.files_array;
    var temp_files_array = [];
    // console.log('====create_files_array====');
    // console.log(layer_file_name);
    // console.log(files_array);
    // console.log('====create_files_array====');
    if (files_array !== []) {
        for (var i = 0; i < files_array.length; i++) {
            var node_name = files_array[i].shift();
            for (var j = 0; j < layer_file_name.length; j++) {
                if (layer_file_name[j] === node_name) {
                    if (Array.isArray(temp_files_array[j])) {
                        temp_files_array[j].push(files_array[i]);
                    } else {
                        temp_files_array[j] = [];
                        temp_files_array[j].push(files_array[i]);
                    }
                }
            }
            if (files_array.length === (i + 1)) {
                callback(temp_files_array);
            }
        }
    } else {
        callback(temp_files_array);
    }
};

var create_layer_file = function create_layer_file(files_array, send_array, callback) {
    var temp_layer_file = [];
    var process_files_array = files_array.map(function(element){return element});
    if (process_files_array !== []) {
        for (var i = 0; i < process_files_array.length; i++) {
            var files_array_term = process_files_array[i];
            if (files_array_term.length > 0) {
                var first_term = files_array_term.shift();
                if (temp_layer_file.length != 0) {
                    for (var j = 0; j < temp_layer_file.length; j++) {
                        if (temp_layer_file[j] !== first_term && temp_layer_file.length === (j + 1)) {
                            temp_layer_file.push(first_term);
                        }
                    }
                } else {
                    temp_layer_file.push(first_term);
                }
            } else {
                if (temp_layer_file.length != 0) {
                    for (var j = 0; j < temp_layer_file.length; j++) {
                        if (temp_layer_file[j] !== files_array_term && temp_layer_file.length === (j + 1)) {
                            temp_layer_file.push(files_array_term);
                        }
                    }
                } else {
                    temp_layer_file.push(files_array_term);
                }
            }

            if ((i + 1) === process_files_array.length) {
                console.log(send_array);
                callback(temp_layer_file, send_array);
            }
        }
    }
};




var create_structure = function create_structure(_option, oragan_files_array ,done) {
    var node_list = [];
    var parent_node = _option.parent_node;
    var node_name = _option.node_name;
    var layer_file = _option.layer_file;
    var files_array = _option.files_array;

    if (files_array.length !== 0) {
        create_layer_file(files_array, oragan_files_array, function(temp_layer_file, parnet_file_array){
            console.log(parnet_file_array);
            for (var i = 0; i < layer_file.length; i++) {
                var temp_node_name = layer_file[i];
                var child_files_option = {
                    layer_file_name: temp_layer_file,
                    files_array: parnet_file_array
                };
                create_files_array(child_files_option, function(temp_files_array) {
                    var next_option = {
                        parent_node: node_name,
                        node_name: temp_node_name,
                        layer_file: temp_layer_file,
                        files_array: temp_files_array
                    };
                    create_structure(next_option, temp_files_array ,function done_callback(child_node) {
                        node_list.push(child_node);
                        if (node_list.length === layer_file.length) {
                            done({
                                node_name: node_name,
                                node_list: node_list
                            });
                        }
                    });
                });
            }
        });

    } else {
        done({
            node_name: node_name,
            node_list: node_list
        });
    }

};

var create_pre_structure = function create_pre_structure(node_name, files_array) {
    var temp_node_list = [];
    var temp_layer_file = [];
    for (var i = 0; i < files_array.length; i++) {
        var temp_files_array = files_array[i].split('/');
        temp_files_array.shift();
        temp_node_list.push(temp_files_array);
        if (temp_layer_file.length != 0) {
            for (var j = 0; j < temp_layer_file.length; j++) {
                if (temp_layer_file[j] !== temp_files_array[0] && temp_layer_file.length === (j + 1)) {
                    temp_layer_file.push(temp_files_array[0]);
                }
            }
        } else {
            temp_layer_file.push(temp_files_array[0]);
        }
        if (files_array.length === i + 1) {
            var next_option = {
                parent_node: null,
                node_name: 'root',
                layer_file: temp_layer_file,
                files_array: temp_node_list,
                node_list: []
            };
            create_structure(next_option, temp_node_list, function root_done(child_node) {
                console.log('\n');
                console.log('last');
                console.log(child_node);
                console.log('\n');
            });
        }
    }
};

var structure = create_pre_structure('root', [
    '/floder_1/floder_1_1/file_1.log',
    '/floder_1/floder_1_1/file_2.log',
    '/floder_2/floder_2_1/file_3.log',
    '/floder_2/floder_2_1/floder2_1_1/floder2_1_1_1/file_4.log',
    '/floder_2/floder_2_2/file_5.log',
    '/floder_3/floder_3_1/floder_3_1_1/file_6.log',
    '/file_7.log'
]);
