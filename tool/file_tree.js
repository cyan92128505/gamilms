var traverse = require('traverse');

// var input_files_url = [
//     '/floder_1/floder_1_1/file_1.log',
//     '/floder_1/floder_1_1/file_2.log',
//     '/floder_2/floder_2_1/file_3.log',
//     '/floder_2/floder_2_1/floder2_1_1/floder2_1_1_1/file_4.log',
//     '/floder_2/floder_2_2/file_5.log',
//     '/floder_3/floder_3_1/floder_3_1_1/file_6.log',
//     '/file_7.log'
// ];
//
// var strand_node_structure = {
//     node_name: 'root',
//     parent_ref: null,
//     child_list: []
// };
//
// var option = {
//     files_url: input_files_url,
//     checK_file: [],
//     node_structure: {
//         'root': {
//             node_name: 'root',
//             parent_ref: null,
//             child_list: {}
//         }
//     },
//     current_file: [],
//     final_done: function(option) {
//
//         console.log(JSON.stringify(option.node_structure));
//     }
// };

function prepare_array(option) {
    for (var i = 0; i < option.files_url.length; i++) {
        option.files_url[i] = option.files_url[i].file_name.split('/');
        option.files_url[i][0] = 'root';

        if ((i + 1) === option.files_url.length) {
            create_parent_ref(option);
        }
    }
}

function create_parent_ref(option) {
    for (var i = 0; i < option.files_url.length; i++) {
        var parent_ref_array = {};
        parent_ref_array[option.files_url[i][0]] = {
            node_name: option.files_url[i][0],
            organ_url: '/',
            parent_ref: null,
            type: 'folder',
            child_list: {}
        };
        for (var j = 1; j < option.files_url[i].length; j++) {
            var tamp_organ_url = '';
            var file_type = 'folder';
            if ((j + 1) === option.files_url[i].length) {
                file_type = 'file';
            }
            for (var k = 1; k < j + 1; k++) {
                tamp_organ_url = tamp_organ_url + '/' + option.files_url[i][k];
            }
            parent_ref_array[option.files_url[i][j]] = {
                node_name: option.files_url[i][j],
                organ_url: tamp_organ_url,
                parent_ref: option.files_url[i][j - 1],
                type: file_type,
                child_list: {}
            };

            if ((j + 1) === option.files_url[i].length) {
                option.files_url[i] = parent_ref_array;
            }
        }

        if ((i + 1) === option.files_url.length) {
            through_files(option);
        }
    }
}

function through_files(option) {
    // 遍歷每一個檔案
    for (var i = 0; i < option.files_url.length; i++) {
        for (var file in option.files_url[i]) {
            find_and_push(option, i, file);
        }


        if ((i + 1) === option.files_url.length) {
            file_prepare(option);
        }
    }
}

function find_and_push(option, files_index, layer_index) {
    //尋找節點，沒有時在父節點將自己push進去
    if (!!option.files_url[files_index][layer_index]) {
        var parent_ref = option.files_url[files_index][layer_index].parent_ref;
        traverse(option.node_structure).forEach(function(node) {
            if (!!node && !!node[parent_ref]) {
                if (!node[parent_ref].child_list[layer_index]) {
                    node[parent_ref].child_list[layer_index] = option.files_url[files_index][layer_index];
                }
            }
        });
    }
}


function file_prepare(option) {
    // console.log(traverse(node_structure).paths());
    var html_array = [];
    traverse(option.node_structure).forEach(function(node) {
        if (!!node && !!node['node_name']) {
            if (Object.getOwnPropertyNames(node['child_list']).length === 0) {
                var sub_file_name = node.node_name.split('.').reverse()[0];
                node.html = '<a href="" ng-click="get_files(\'' + sub_file_name + '\',\'' + node.organ_url + '\')">' + node.node_name + '</a>';
            }
        }
    });
    node_push_li(option);
}

function node_push_li(option) {
    if (!option.node_structure.root['html']) {
        traverse(option.node_structure).forEach(function(node) {
            if (!!node && !!node['node_name']) {
                if (!node.html) {
                    var temp_html = '';
                    var child_num = 0;
                    var child_has_html = 0
                    for (child in node.child_list) {
                        child_num++;
                        if (!!node.child_list[child].html) {
                            child_has_html++;
                            temp_html = temp_html + '<li>' + node.child_list[child].html + '</li>';
                        }
                    }
                    if (child_num === child_has_html) {
                        node.html = '<a href="" ng-click="' + node.node_name + ' = !' + node.node_name +
                            '"><span ng-show="!' + node.node_name +
                            '" class="icon-minus-squared"></span><span ng-show="' + node.node_name +
                            '" class="icon-plus-squared"></span>' + node.node_name +
                            '</a><ul uib-collapse="' +
                            node.node_name + '">' + temp_html + '</ul>';
                        this.update(node);
                    };
                }
            }
        });
        node_push_li(option);
    } else {
        option.html = option.node_structure.root.html;
        option.final_done(option);
    }
}



module.exports = function(files_url, done) {
    var input_option = {
        organ_files_url: files_url,
        files_url: files_url,
        checK_file: [],
        node_structure: {
            'root': {
                node_name: 'root',
                type: 'folder',
                organ_url: '/',
                parent_ref: null,
                child_list: {}
            }
        },
        current_file: [],
        final_done: function(option) {
            done(option);
        }
    };
    prepare_array(input_option);
};
