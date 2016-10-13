var esprima = require('esprima');
var strip = require('strip-comments');
var escape = require(process.cwd() + '/tool/escape.js');
var fsx = require('fs-extra');
fsx.outputJson(
    process.cwd() + '/document/phaser_tutorial_2.json',
    esprima.parse(strip(escape.unescape(code))),
    function(err) {
        console.log('convert over');
    });
