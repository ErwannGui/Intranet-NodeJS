var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'node-intranet'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.loggedin) {
        connection.query('SELECT * FROM mesures', function(error, results, fields) {
            if (error) {
                console.log(error.message);
                res.render('index', { title: 'Tableau de bord', username: req.session.username });
            } else {
                var mesures_data = JSON.stringify(results);
                res.render('index', { title: 'Tableau de bord', username: req.session.username, data: mesures_data });
            }
        });
    } else {
        res.redirect('/login');
    }
    // res.end();
    // res.render('index', { title: 'Tableau de bord', username: 'Anonymous' });
});

router.get('/login', function (req, res, next) {
    if (!req.session.loggedin) {
        res.render('login');
    }
});

router.get('/load-data/:automate', function (req, res) {
    connection.query('SELECT * FROM mesures WHERE unit = ? AND num_automate = ? limit 5', [1, req.params.automate], function(error, results) {
        if (error) {
            res.status(404).send(error.message);
        } else {
            var mesures_data = JSON.stringify(results);
            res.status(200).send(mesures_data);
        }
    });
});

module.exports = router;
