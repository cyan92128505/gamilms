var htmlparser = require("htmlparser");
module.exports = function(option) {
    var handler = new htmlparser.DefaultHandler(option.callback, {
        verbose: false,
        ignoreWhitespace: true
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(option.raw);
};
