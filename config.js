var env = 'dev'; //(dev|prod)

var engineScripts = [
    '/js/socket.io.js',
    '/js/fraction.js',
    '/js/app.js',
    '/js/modules/imgviewer.js',
    '/js/directives/photoWall.js',
    '/js/controllers/main.js',
    '/js/controllers/nav.js',
    '/js/controllers/albums.js',
    '/js/controllers/logout.js',
    '/js/controllers/login.js'
];
var developScripts = [
    '/js/livereload.io.js'
];

var scripts = {
    dev: [
        '/bower_components/hammerjs/hammer.js',
        '/bower_components/angular/angular.js',
        '/bower_components/angular-animate/angular-animate.js',
        '/bower_components/angular-aria/angular-aria.js',
        '/bower_components/angular-route/angular-route.js',
        '/bower_components/angular-touch/angular-touch.js',
        '/bower_components/angular-material/angular-material.js',
        '/js/angular-file-upload.js'
    ],
    prod: ['/js/allScripts.js'], //al scripts inside here.
    minified: [ //minified scripts
        '/bower_components/hammerjs/hammer.min.js',
        '/bower_components/angular/angular.min.js',
        '/bower_components/angular-animate/angular-animate.min.js',
        '/bower_components/angular-aria/angular-aria.min.js',
        '/bower_components/angular-route/angular-route.min.js',
        '/bower_components/angular-touch/angular-touch.min.js',
        '/bower_components/angular-material/angular-material.min.js',
        '/public/js/angular-file-upload.min.js'
        //automatically minified all scripts in js public directory.
    ]
};
for (var i = 0; i < engineScripts.length; i++) {
    var s = engineScripts[i];
    scripts.dev.push(s);
}
for (var i = 0; i < developScripts.length; i++) {
    var s = developScripts[i];
    scripts.dev.push(s);
}

module.exports.setEnv = function (enviroment) {
    env = enviroment;
};

module.exports.getScripts = function () {
    return scripts[env];
};
module.exports.getMinified = function () {
    return scripts['minified'];
};
module.exports.getProdPath = function () {
    return scripts['prod'][0]
};
module.exports.getEngineScripts = function () {
    return engineScripts;
};
module.exports.redisOptions = {
    //add your redis options here (to session)
    /**
     * Example:
     *   host: 'localhost',
     *   port: 8543,
     *   prefix: 'tobi',
     *   ttl: 1000,
     *   disableTTL: true,
     *   db: 1,
     *   unref: true,
     *   pass: 'secret'
     */

};