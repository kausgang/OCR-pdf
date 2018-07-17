var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fs = require('fs');


var bodyParser     =        require("body-parser");
const multer = require('multer') // file storing middleware

var upload_pdf = require('./routes/upload_pdf');
var process_pdf = require('./routes/process_pdf');
// var take_picture = require('./routes/take_picture');
// var upload_image = require('./routes/upload_image');




// CREATE UPLOAD FOLDER
var exists = fs.existsSync(path.join(__dirname,'public/UPLOAD'))
if(!exists)
  fs.mkdirSync(path.join(__dirname,'public/UPLOAD'))



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



// MULTER UPLOAD FILE
// https://medium.com/@Moonstrasse/how-to-make-a-basic-html-form-file-upload-using-multer-in-an-express-node-js-app-16dac2476610

const multerConfig = {
    
  storage: multer.diskStorage({
   //Setup where the user's file will go
   destination: function(req, file, next){
     next(null, './public/UPLOAD');
     },   
      
      //Then give the file a unique name
      filename: function(req, file, next){
          // console.log(file);
          // const ext = file.mimetype.split('/')[1];
          // next(null, file.fieldname + '-' + Date.now() + '.'+ext);
          next(null, file.originalname);
        }
      })   
    };
    
    // https://lollyrock.com/articles/express4-file-upload/
    // app.use(multer({ dest: './public/UPLOAD/'}));
    // FORWARD THE FILE HANDLING PART TO MULTER
    var file_handler = multer(multerConfig).single('pdf');

    app.post('/file-upload',file_handler, function(req,res){

      console.log(req.body) 
      console.log(req.file)
      // res.send('Complete!');
      
   });






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
