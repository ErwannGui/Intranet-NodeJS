global.__root = __dirname + '/';

var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'www.ghloel.fr',
    user     : 'erwann',
    password : 'Guillevic-44',
    database : 'DevOPS_eG-aW'
});
/**
 *  JWT
 */
var jwt = require('jsonwebtoken');
// var public_key = fs.readFileSync(__root + 'jwt-key.pub', 'utf8');  // get private key
// var verifyOptions = {
//     issuer:  i,
//     subject:  s,
//     audience:  a,
//     expiresIn:  "1h",
//     algorithm:  ["RS256"]
// };

var app = express();

// var socket_io = require('socket.io');
//
// // Socket.io
// var io = socket_io();
// app.io = io;

var http = require('http').Server(app);
var io = require('socket.io')(http);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'super-secret-code',
    resave: true,
    saveUninitialized: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function (socket) {

    socket.on('file-ready', function (unit) {
        console.log('Unit ' + unit + ' ready !');
    });

    socket.on('send-data', function (data) {
        var jsonContent = JSON.parse(data);
        var jsonData = jsonContent.data;
        // jwt.verify(jsonData.token, public_key, verifyOptions, function(err, decoded) {
        //     if (!err) {
        //         console.log(JSON.stringify(decoded));
                // console.log(data);
                // Exemple : data = {"data": {"unit": 1, "mesures": [{"num_automate": 1, "type_automate": 47648, "temp_int": 3.942494943795294, "temp_ext": 12.856332346098561, "weight_milk": 3966.7580423792815, "weight_product": 362.0607895176888, "ph": 7.185620709355489, "potassium": 39.484511957030584, "nacl": 1.0586524532527484, "salmonelle": 36.689949374328386, "ecoli": 46.48941083074784, "listeria": 51.74738850776339, "time": "2019-05-17 01:08:45.154241"}, {"num_automate": 2, "type_automate": 47649, "temp_int": 3.570509746956046, "temp_ext": 9.240458674798937, "weight_milk": 3808.694162609363, "weight_product": 301.83696895458394, "ph": 7.0135248129450165, "potassium": 38.92186477349742, "nacl": 1.0582453424070353, "salmonelle": 18.02365883306543, "ecoli": 45.45270556008245, "listeria": 30.892774240478165, "time": "2019-05-17 01:08:45.154241"}, {"num_automate": 3, "type_automate": 47650, "temp_int": 3.928072673246922, "temp_ext": 9.739721491767751, "weight_milk": 4283.308181939415, "weight_product": 85.16323126362032, "ph": 7.068494291499315, "potassium": 37.83595944327393, "nacl": 1.6584535736059287, "salmonelle": 34.3447187222086, "ecoli": 43.064640894094666, "listeria": 47.08593257968739, "time": "2019-05-17 01:08:45.154241"}, {"num_automate": 4, "type_automate": 47651, "temp_int": 3.6081535910532554, "temp_ext": 9.559289229307456, "weight_milk": 4540.240554083904, "weight_product": 373.15574495216606, "ph": 6.896674026578034, "potassium": 41.94720181656876, "nacl": 1.4554164772331817, "salmonelle": 34.84049606822799, "ecoli": 41.55923747405688, "listeria": 28.30515431340892, "time": "2019-05-17 01:08:45.154241"}, {"num_automate": 5, "type_automate": 47652, "temp_int": 3.5981837674055654, "temp_ext": 11.442702228743785, "weight_milk": 4144.874162256117, "weight_product": 977.2409150305858, "ph": 7.191719372314652, "potassium": 36.88351478953037, "nacl": 1.3022124981891523, "salmonelle": 19.27664564797837, "ecoli": 41.56745733786861, "listeria": 37.442959843176254, "time": "2019-05-17 01:08:45.154241"}]}}
                for (var i=0; i<5; i++) {
                    var mesures = [null, jsonData.unit, i+1, jsonData.mesures[i].type_automate, jsonData.mesures[i].temp_int, jsonData.mesures[i].temp_ext, jsonData.mesures[i].weight_milk, jsonData.mesures[i].weight_product, jsonData.mesures[i].ph, jsonData.mesures[i].potassium, jsonData.mesures[i].nacl, jsonData.mesures[i].salmonelle, jsonData.mesures[i].ecoli, jsonData.mesures[i].listeria, jsonData.mesures[i].time, new Date()];
                    console.log(mesures);
                    connection.query('INSERT INTO mesures VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', mesures, function(error, results, fields) {
                        if (error) {
                            console.error(error.message);
                        } else {
                            console.log('Data recorded in database.');
                        }
                    });
                }
            // } else {
            //     console.log(err);
            // }

            connection.end();
        // });
    });
});

var logFile = fs.createWriteStream('./api.log', {flags: 'a'});
app.use(logger('combined', { stream: logFile }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// http.listen(3000);

console.log('Listening on port '+3000);

module.exports = app;
