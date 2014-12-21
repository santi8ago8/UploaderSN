var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET home page. */
router.get('/', function (req, res) {
    req.session.count = req.session.count ? req.session.count + 1 : 1;
    res.render('index', { title: 'Express', scripts: config.getScripts(),user:req.session.user});
});

module.exports = router;
