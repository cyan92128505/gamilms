// var file_tree = require(process.cwd() + '/tool/file_tree.js');
// var traverse = require('traverse');
//
//
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
// file_tree(input_files_url, file_prepare);
//
// function file_prepare(option) {
//     // console.log(traverse(node_structure).paths());
//     var html_array = [];
//     traverse(option.node_structure).forEach(function(node) {
//         if (!!node && !!node['node_name']) {
//             if (Object.getOwnPropertyNames(node['child_list']).length === 0) {
//                 var sub_file_name = node.node_name.split('.').reverse()[0];
//                 node.html = '<a href="" ng-click="get_files(\'' + sub_file_name + '\',\'' + node.organ_url + '\')"></a>' + node.node_name;
//             }
//         }
//     });
//     node_push_li(option);
// }
//
// function node_push_li(option) {
//     if (!option.node_structure.root['html']) {
//         traverse(option.node_structure).forEach(function(node) {
//             if (!!node && !!node['node_name']) {
//                 if (!node.html) {
//                     var temp_html = '';
//                     var child_num = 0;
//                     var child_has_html = 0
//                     for (child in node.child_list) {
//                         child_num++;
//                         if (!!node.child_list[child].html) {
//                             child_has_html++;
//                             temp_html = temp_html + '<li>' + node.child_list[child].html + '</li>';
//                         }
//                     }
//                     if (child_num === child_has_html) {
//                         node.html = '<a href="" ng-click="'+
//                         node.node_name+
//                         ' = !'+
//                         node.node_name+
//                         '"><span ng-show="!'+
//                         node.node_name+
//                         '" class="icon-minus-squared"></span><span ng-show="'+
//                         node.node_name+
//                         '" class="icon-plus-squared"></span>'+
//                         node.node_name+
//                         '</a><ul uib-collapse="'+
//                         node.node_name+'">'+temp_html+'</ul>';
//                         this.update(node);
//                     };
//                 }
//             }
//         });
//         node_push_li(option);
//     } else {
//         option.final_done(option);
//     }
// }
//
//
//
//
// // <!-- node -->
//     //
//     //
//     // <!-- file -->
//     // <li>
//     //     <a href="" ng-click="get_files('file_type',file_url)"> file_name </a>
//     // </li>
