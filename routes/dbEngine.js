var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var db, users;
var SHA256 = require("crypto-js/sha256");

function init() {
    var url = 'mongodb://localhost:27017/UploaderSN';
// Use connect method to connect to the Server
    MongoClient.connect(url, function (err, database) {
        assert.equal(null, err);
        console.log("Connected correctly to MongoDB server (DataBase)");
        db = database;
        users = db.collection('users');
    });
}
function logs(err) {
    if (err) {
        console.log(err);
        throw new Error(err);
    }
}
/*
 {username:'juan',follows:[]}
 */
module.exports = {

    user: {
        create: function (user, cb) {
            user.password = SHA256(user.password).toString();
            users.findOne({name: user.name}, function (err, res) {
                logs(err);
                var message = true;
                if (res === null) {
                    //create
                    users.save(user, function (err, nUser) {
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
            users.findOne(user, function (err, res) {
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
    }

}
;

init();