angular.module('gamilms_factory')
    .factory('terminal_command', ['$http', function($http) {
        return function(command) {
            switch (command) {
                case 'wellcome':
                    return [{
                        type: 'info',
                        command: '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░'
                    }, {
                        type: 'info',
                        command: '░░██████░████████░██░░░██░███░███░░░░░██░░░██░░░░░████'
                    }, {
                        type: 'info',
                        command: '░███░░░░░░░░░░░██░███░███░███░███░░░░░███░███░░░░███░░'
                    }, {
                        type: 'info',
                        command: '░███░░██░░███████░███████░███░███░░░░░███████░░░░███░░'
                    }, {
                        type: 'info',
                        command: '░███░░██░░███░░██░██░█░██░███░███░░░░░██░█░██░░░░███░░'
                    }, {
                        type: 'info',
                        command: '░░██████░░███░░██░██░░░██░███░███████░██░░░██░█████░░░'
                    }, {
                        type: 'info',
                        command: '░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░'
                    }, {
                        type: 'info',
                        command: 'Wellcome GamiLMS Terminal !!'
                    }, {
                        type: 'info',
                        command: 'For Helps type "help"!'
                    }]
                    break;
                case 'help':
                    return [{
                        type: 'info',
                        command: '建立樣板專案 \'ionic start -a "Ionic Book Store" -i app.bookstore.ionic book-store sidemenu\''
                    }, {
                        type: 'info',
                        command: '開啟預覽 \'ionic serve\''
                    }, {
                        type: 'info',
                        command: '設定平台 \'ionic platform [option]<platform>\''
                    }, {
                        type: 'info',
                        command: '編譯應用程式 \'ionic build [option]<platform>\''
                    }];
                    break;
                case 'create_project':
                    return [{
                        type: 'info',
                        command: 'Creating Ionic app in folder /' + gamilms_uid + '/ionic/book-store based on sidemenu project'
                    }, {
                        type: 'info',
                        command: 'Downloading: https://github.com/driftyco/ionic-app-base/archive/master.zip'
                    }, {
                        type: 'info',
                        command: '[=============================]  100%  0.0s'
                    }, {
                        type: 'info',
                        command: 'Downloading: https://github.com/driftyco/ionic-starter-sidemenu/archive/master.zip'
                    }, {
                        type: 'info',
                        command: '[=============================]  100%  0.0s'
                    }, {
                        type: 'info',
                        command: 'Updated the hooks directory to have execute permissions'
                    }, {
                        type: 'info',
                        command: 'Update Config.xml'
                    }, {
                        type: 'info',
                        command: 'Initializing cordova project'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: 'Your Ionic project is ready to go! Some quick tips:'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: ' * cd into your project: $ cd book-store'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: ' * Setup this project to use Sass: ionic setup sass'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: ' * Develop in the browser with live reload: ionic serve'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: ' * Add a platform (ios or Android): ionic platform add ios [android]'
                    }, {
                        type: 'info',
                        command: '   Note: iOS development requires OS X currently'
                    }, {
                        type: 'info',
                        command: '   See the Android Platform Guide for full Android installation instructions:'
                    }, {
                        type: 'info',
                        command: '   https://cordova.apache.org/docs/en/edge/guide_platforms_android_index.md.html'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: ' * Build your app: ionic build <PLATFORM>'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: ' * Simulate your app: ionic emulate <PLATFORM>'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: ' * Run your app on a device: ionic run <PLATFORM>'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: ' * Package an app using Ionic package service: ionic package <MODE> <PLATFORM>'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: 'For more help use ionic --help or ionic docs'
                    }, {
                        type: 'info',
                        command: ''
                    }, {
                        type: 'info',
                        command: 'Visit the Ionic docs: http://ionicframework.com/docs'
                    }];
                    break;
            }
        }
    }]);
