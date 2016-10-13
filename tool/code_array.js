var diff_ref = require(process.cwd() + '/document/diff_code_form_phaser.json');

var clean_code = require(process.cwd() + '/tool/clean_code.js');
var escape = require(process.cwd() + '/tool/escape.js');
var difflib = require(process.cwd() + '/tool/difflib.js');

var traverse = require('traverse');
var events = require('events');
var fs = require('fs');
var fsx = require('fs-extra');

var eventEmitter = new events.EventEmitter();


module.exports = function(option) {

};
