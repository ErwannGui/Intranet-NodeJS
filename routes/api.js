var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'node-intranet'
});

/* API insertion in database */
router.post('/insert', function(req, res) {
    // data = {"data": {"unit": 1, "mesures": [{"num_automate": 1, "type_automate": 47648, "temp_int": 3.942494943795294, "temp_ext": 12.856332346098561, "weight_milk": 3966.7580423792815, "weight_product": 362.0607895176888, "ph": 7.185620709355489, "potassium": 39.484511957030584, "nacl": 1.0586524532527484, "salmonelle": 36.689949374328386, "ecoli": 46.48941083074784, "listeria": 51.74738850776339, "time": "2019-05-17 01:08:45.154241"}, {"num_automate": 2, "type_automate": 47649, "temp_int": 3.570509746956046, "temp_ext": 9.240458674798937, "weight_milk": 3808.694162609363, "weight_product": 301.83696895458394, "ph": 7.0135248129450165, "potassium": 38.92186477349742, "nacl": 1.0582453424070353, "salmonelle": 18.02365883306543, "ecoli": 45.45270556008245, "listeria": 30.892774240478165, "time": "2019-05-17 01:08:45.154241"}, {"num_automate": 3, "type_automate": 47650, "temp_int": 3.928072673246922, "temp_ext": 9.739721491767751, "weight_milk": 4283.308181939415, "weight_product": 85.16323126362032, "ph": 7.068494291499315, "potassium": 37.83595944327393, "nacl": 1.6584535736059287, "salmonelle": 34.3447187222086, "ecoli": 43.064640894094666, "listeria": 47.08593257968739, "time": "2019-05-17 01:08:45.154241"}, {"num_automate": 4, "type_automate": 47651, "temp_int": 3.6081535910532554, "temp_ext": 9.559289229307456, "weight_milk": 4540.240554083904, "weight_product": 373.15574495216606, "ph": 6.896674026578034, "potassium": 41.94720181656876, "nacl": 1.4554164772331817, "salmonelle": 34.84049606822799, "ecoli": 41.55923747405688, "listeria": 28.30515431340892, "time": "2019-05-17 01:08:45.154241"}, {"num_automate": 5, "type_automate": 47652, "temp_int": 3.5981837674055654, "temp_ext": 11.442702228743785, "weight_milk": 4144.874162256117, "weight_product": 977.2409150305858, "ph": 7.191719372314652, "potassium": 36.88351478953037, "nacl": 1.3022124981891523, "salmonelle": 19.27664564797837, "ecoli": 41.56745733786861, "listeria": 37.442959843176254, "time": "2019-05-17 01:08:45.154241"}]}}
    var data = req.body.data;
    var jsonContent = JSON.parse(data);
    var jsonData = jsonContent.data;
    for (var i=0; i<5; i++) {
        var mesures = [null, jsonData.unit, i+1, jsonData.mesures[i].type_automate, jsonData.mesures[i].temp_int, jsonData.mesures[i].temp_ext, jsonData.mesures[i].weight_milk, jsonData.mesures[i].weight_product, jsonData.mesures[i].ph, jsonData.mesures[i].potassium, jsonData.mesures[i].nacl, jsonData.mesures[i].salmonelle, jsonData.mesures[i].ecoli, jsonData.mesures[i].listeria, jsonData.mesures[i].time, new Date()];
        console.log(mesures);
        connection.query('INSERT INTO mesures VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', mesures, function(error, results, fields) {
            if (error) {
                console.error(error.message);
                res.status(404).send(error);
            } else {
                console.log('Data recorded in database.');
                res.status(200);
            }
        });
    }

    res.send('Data recorded in database.');
    res.end();
});

module.exports = router;
