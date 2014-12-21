var io,
    util = require('util'),
    db = require('./dbEngine');

function init() {
    io.on('connection', function (socket) {
        createEvents(socket);
    })
}
var comments = [];
function createEvents(socket) {


    socket.on('user:login', function (data) {
        db.user.login(data, function (message) {
            if (message === true) {
                socket.session.user = data.name;
                socket.session.save();
            }
            socket.emit('user:login', {message: message});
        })
    });
    socket.on('user:create', function (data) {
        db.user.create(data, function (message) {
            if (message === true) {
                socket.session.user = data.name;
                socket.session.save();
            }
            socket.emit('user:create', {message: message});
        })
    });
    socket.on('logout', function (data) {
        socket.session.destroy();
        socket.emit('logout');
    });

}


module.exports = function (server, cookieParser, session) {
    io = require('socket.io')(server);

    io.use(function (socket, next) {
        var req = socket.handshake;
        var res = {};
        cookieParser(req, res, function (err) {
            if (err) return next(err);
            session(req, res, next);
        });
    });
    io.use(function (socket, next) {
        socket.session = socket.handshake.session;
        next();
    });

    init();
};