var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.loggedin) {
        res.render('index', { title: 'Express', username: req.session.username });
    } else {
        res.render('login');
    }
    res.end();

});

module.exports = router;
