var strip = require('strip-comments');
var beautify = require('js-beautify').js_beautify;
var regex_remove_empty_line = /(^[ \t]*[\r\n])/gm;
var regex_remove_empty_head = /^[\s]+/gm;
var clean_code = function(code, callback) {
    var raw = '';
    try {
        raw = beautify(strip(code).replace(regex_remove_empty_line, '').replace(regex_remove_empty_head, ''), {
            "indent_size": 4,
            "indent_char": " ",
            "eol": "\n",
            "indent_level": 0,
            "indent_with_tabs": false,
            "preserve_newlines": true,
            "max_preserve_newlines": 10,
            "jslint_happy": false,
            "space_after_anon_function": false,
            "brace_style": "collapse",
            "keep_array_indentation": false,
            "keep_function_indentation": false,
            "space_before_conditional": true,
            "break_chained_methods": false,
            "eval_code": false,
            "unescape_strings": false,
            "wrap_line_length": 0,
            "wrap_attributes": "auto",
            "wrap_attributes_indent_size": 4,
            "end_with_newline": false
        });
    } catch (err) {
        console.error(err);
        raw = code;
    }
    if (callback === false) {
        return raw;
    } else {
        callback(null, raw);
    }
};

module.exports = clean_code;
