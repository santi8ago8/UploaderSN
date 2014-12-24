var express = require('express');
var router = express.Router();
var config = require('../config');
var db = require('./dbEngine');
var path = require('path');
var ExifImage = require('exif').ExifImage;
var gm = require('gm');
var fs = require('fs-extra');
var sockets = require('./sockets');

/* GET home page. */
router.get('/', function (req, res) {
    req.session.count = req.session.count ? req.session.count + 1 : 1;
    res.render('index', { title: 'Express', scripts: config.getScripts(), user: req.session.user});
});
router.post('/file/upload', function (req, res) {
    //crear el file en la db,
    //guardar en disco.

    db.photo.edit({proprietor: req.session.user}, function (photo) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {


            var url = __dirname + '/../public/img/photos/' + photo._id + path.extname(filename);
            var urlPublic = '/img/photos/' + photo._id + path.extname(filename);
            var urlMediumMachine = __dirname + '/../public/img/photos/' + photo._id + '_m' + path.extname(filename);
            var urlMedium = '/img/photos/' + photo._id + '_m' + path.extname(filename);
            var urlThumbnailMachine = __dirname + '/../public/img/photos/' + photo._id + '_t' + path.extname(filename);
            var urlThumbnail = '/img/photos/' + photo._id + '_t' + path.extname(filename);
            //Path where image will be uploaded
            fstream = fs.createWriteStream(url);
            file.pipe(fstream);
            fstream.on('close', function () {
                new ExifImage({ image: url }, function (error, exifData) {
                    if (error)
                        console.log('Error: ' + error.message);
                    else {
                        //console.log(exifData); // Do something with your data!
                        //debugger;
                        photo.meta = exifData;
                        //remove buffers from object.
                        try {
                            photo.meta.exif.ExifVersion = photo.meta.exif.ExifVersion.toString();
                            photo.meta.exif.FileSource = photo.meta.exif.FileSource.toString();
                            photo.meta.exif.SceneType = photo.meta.exif.SceneType.toString();
                            photo.meta.exif.CFAPattern = photo.meta.exif.CFAPattern.toString();
                        }
                        catch (e) {
                            console.log(e);
                        }
                        photo.url = urlPublic;
                        photo.thumbnail = urlThumbnail;
                        photo.medium = urlMedium;
                        gm(url)
                            //-resize 580^x384 -gravity center -extent 580x384 -gravity center
                            .resize(580 + '^', 384)//ancho de 580 px.
                            .gravity('Center')
                            .extent(580, 384)
                            .gravity('Center')
                            .write(urlThumbnailMachine, function (err) {
                                if (err)
                                    console.log(err);
                                else {
                                    gm(url)
                                        .resize(50 + '%')
                                        .quality(80)
                                        .write(urlMediumMachine, function (err) {
                                            if (err)
                                                console.log(err);
                                            else {
                                                db.photo.save(photo, function (photoWithMeta) {
                                                    res.send({ok: true});
                                                    //send event to socket.
                                                    sockets.photo.send(photo.toObject());
                                                });
                                            }
                                        });


                                }
                            });


                    }
                });
            });
        });

    });
});

module.exports = router;
