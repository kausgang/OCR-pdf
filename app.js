var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var formidable = require('formidable');
var bodyParser     =        require("body-parser");

var upload_pdf = require('./routes/upload_pdf');
var process_pdf = require('./routes/process_pdf');
// var take_picture = require('./routes/take_picture');
// var upload_image = require('./routes/upload_image');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/upload_pdf', upload_pdf);

// app.post('/', function (req, res){
//   var form = new formidable.IncomingForm();

//   form.parse(req);

//   form.on('fileBegin', function (name, file){
//       file.path = path.join(__dirname , 'public/UPLOAD/' , file.name);
//   });

//   form.on('file', function (name, file){
//       console.log('Uploaded ' + file.name);
//   });

//   // res.sendFile(__dirname + '/index.html');
// });


app.use('/process_pdf', process_pdf);
// app.use('/take_picture', take_picture);
// app.use('/upload_image', upload_image);


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

module.exports = app;
