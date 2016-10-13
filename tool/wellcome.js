var colors = require('colors/safe');
module.exports = function wellcome(port){
    var wellcome = [{
        type: 'logo',
        command: '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░'
    }, {
        type: 'logo',
        command: '░░██████░████████░██░░░██░███░███░░░░░██░░░██░░░░░████'
    }, {
        type: 'logo',
        command: '░███░░░░░░░░░░░██░███░███░███░███░░░░░███░███░░░░███░░'
    }, {
        type: 'logo',
        command: '░███░░██░░███████░███████░███░███░░░░░███████░░░░███░░'
    }, {
        type: 'logo',
        command: '░███░░██░░███░░██░██░█░██░███░███░░░░░██░█░██░░░░███░░'
    }, {
        type: 'logo',
        command: '░░██████░░███░░██░██░░░██░███░███████░██░░░██░█████░░░'
    }, {
        type: 'logo',
        command: '░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░'
    }, {
        type: 'info',
        command: 'Wellcome GamiLMS !!'
    }, {
        type: 'info',
        command: 'Server on: '+port
    }];
    for (var i = 0; i < wellcome.length; i++) {
        switch (true) {
            case (wellcome[i].type === 'logo'):
                console.log(colors.bgCyan(wellcome[i].command));
                break;
            case (wellcome[i].type === 'info'):
                console.log(colors.green(wellcome[i].command));
            default:

        }
    }
};
