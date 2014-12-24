var io,
    util = require('util'),
    db = require('./dbEngine');

function init() {
    io.on('connection', function (socket) {
        createEvents(socket);
    })
}
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
    socket.on('album:get', function (data) {
        db.album.get(socket.session.user, function (albums) {
            socket.emit('album:get', albums);
        })
    });
    socket.on('album:create', function (album) {
        album.owner = socket.session.user;
        db.album.create(album, function (resp) {
            io.to(socket.session.user).emit('album:create', resp);
        })
    });
    socket.on('album:remove', function (data) {
        db.album.remove(
            {_id: data, owner: socket.session.user},
            function (resp) {
                io.to(socket.session.user).emit('album:remove', resp);
            }
        );
    });
    socket.on('photo:get', function (data) {
        db.photo.get(socket.session.user, data, function (photos) {
            db.album.get(socket.session.user, function (albums) {
                socket.emit('photo:get:' + data.album, {albums: albums, photos: photos});
            });

        })
    });
    socket.on('photo:save', function (data) {
        db.photo.edit(data, function (resp) {
            io.to(socket.session.user).emit('photo:save', resp ? data : resp);
        })
    });
    socket.on('photo:remove', function (data) {
        db.photo.remove({
            _id: data._id,
            proprietor: socket.session.user
        }, function (resp) {
            io.to(socket.session.user).emit('photo:remove', resp ? data._id : resp);
        })
    })

}


module.exports = {
    init: function (server, cookieParser, session) {
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
        io.use(function (socket, next) {
            if (socket.session && socket.session.user) {
                socket.join(socket.session.user);
            }
            next();
        });

        init();
    },
    photo: {
        send: function (photo) {
            debugger;
            io.to(photo.proprietor).emit('photo:added', photo);
        }
    }
};