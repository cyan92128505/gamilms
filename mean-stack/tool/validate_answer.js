// Validate Answer
var traverse = require('traverse');
var clean_code = require(process.cwd() + '/tool/clean_code.js');
var difflib = require(process.cwd() + '/tool/difflib.js');
var events = require('events');
var fsx = require('fs-extra');
var eventEmitter = new events.EventEmitter();

module.exports = function(option){
    var base = difflib.stringAsLines(option.a);
    var newtxt = difflib.stringAsLines(option.b);
    var sm = new difflib.SequenceMatcher(base, newtxt);
    var opcodes = sm.get_opcodes();
};
