var createError = require('http-errors');
var express = require('express');

//Google Auth
const {OAuth2Client} = require('google-auth-library');

const clients = new OAuth2Client(CLIENT_ID);

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb')
var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRegister = require('./routes/user/userRegister');
var userLogin = require('./routes/user/userSignin');
var otpVerify = require('./routes/user/otpVerification');
var emailVerify = require('./routes/user/emailVerify');
var profilePage = require('./routes/user/profilePage')

var dataBase = require('./config/connection');

var app = express();


app.use(session({secret:'key',cookie:{maxAge:60000}}))

app.use((req,res,next)=>{
  res.set('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

dataBase.connect((err)=>{
  if(err){
    console.log("***DATABASE CONNECTED***");
  }
  else{
    console.log(("***DATABASE NOT CONNECTED***"));
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', userRegister);
app.use('/signIn', userLogin);
app.use('/verify', otpVerify)
app.use('/emailVerify',emailVerify)
app.use('/profile', profilePage)

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
