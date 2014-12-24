var mongoose = require('mongoose'),
    assert = require('assert'),
    path = require('path'),
    fs = require('fs');
var db, User, Album, Photo;
var SHA256 = require("crypto-js/sha256");

function init() {
    var url = 'mongodb://localhost:27017/UploaderSN';
// Use connect method to connect to the Server
    mongoose.connect(url);
    db = mongoose.connection;
    db.on('error', logs);
    db.once('open', function (err, database) {
        assert.equal(null, err);
        console.log("Connected correctly to MongoDB server (DataBase)");
    });
    var UserSchema = mongoose.Schema({
        name: {type: String, required: true},
        password: {type: String, required: true}
    });
    User = mongoose.model('User', UserSchema);
    var AlbumSchema = mongoose.Schema({
        name: {type: String, required: true},
        owner: {type: String, required: true},
        description: {type: String, required: true}
    });
    Album = mongoose.model('Album', AlbumSchema);
    var PhotoSchema = mongoose.Schema({
        album: String,
        url: String,
        thumbnail: String,
        medium: String,
        proprietor: {type: String, required: true},
        meta: {type: mongoose.Schema.Types.Mixed},
        description: {type: String}
    });
    Photo = mongoose.model('Photo', PhotoSchema);


}
function logs(err) {
    if (err) {
        console.log(err);
        throw new Error(err);
    }
}

module.exports = {

    user: {
        create: function (user, cb) {
            user.password = SHA256(user.password).toString();
            User.findOne({name: user.name}, function (err, res) {
                logs(err);
                var message = true;
                if (res === null) {
                    //create
                    new User(user).save(function (err, nUser) {
                        logs(err);
                        cb(message);
                    })
                }
                else {
                    message = 'Username repeated';
                    cb(message);
                }
            })

        },
        login: function (user, cb) {
            user.password = SHA256(user.password).toString();
            User.findOne(user, function (err, res) {
                logs(err);
                var message = true;
                if (res === null) {
                    //incorrect
                    message = "Incorrect username/password";
                    cb(message);
                }
                else {
                    cb(message);
                }
            });
        }
    },

    album: {
        get: function (userName, cb) {
            Album.find({owner: userName})
                .exec(function (err, albums) {
                    logs(err);
                    cb(albums);
                });
        },
        create: function (album, cb) {
            new Album(album).save(function (err, resp) {
                logs(err);
                cb(resp);
            })
        },
        remove: function (album, cb) {
            Album.remove(album, function (err, resp) {
                logs(err);
                cb(resp ? album : false);
            })
        }
    },

    photo: {
        get: function (userName, data, cb) {
            var q = {proprietor: userName};
            if (data.album != 'all') {
                q.album = data.album;
            }
            Photo.find(q)
                .sort({_id: 1})
                .exec(function (err, albums) {
                    logs(err);
                    cb(albums);
                });
        },
        edit: function (photo, cb) {
            if (photo._id)
                Photo.update({_id: photo._id}, photo, function (err, resp) {
                    logs(err);
                    cb(resp);
                });
            else
                new Photo(photo).save(function (err, resp) {
                    logs(err);
                    cb(resp);
                });
        },
        save: function (photoInstance, cb) {
            photoInstance.save(function (err, resp) {
                logs(err);
                cb(resp);
            });
        },
        remove: function (photo, cb) {
            Photo.findOneAndRemove(photo, function (err, doc) {
                logs(err);
                cb(doc);

                fs.unlink(path.join(__dirname + '/../public/', doc.thumbnail));
                fs.unlink(path.join(__dirname + '/../public/', doc.url));
                fs.unlink(path.join(__dirname + '/../public/', doc.medium));

            });
        }
    }

};

init();