var createError = require('http-errors');
var express = require('express');

//Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "266453374438-a1lkh4ckmaqsv88vgbbrf28ijh0tp8li.apps.googleusercontent.com"
const clients = new OAuth2Client(CLIENT_ID);

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb')
var session = require('express-session')
var fileUpload = require('express-fileupload')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRegister = require('./routes/user/userRegister');
var userLogin = require('./routes/user/userSignin');
var otpVerify = require('./routes/user/otpVerification');
var emailVerify = require('./routes/user/emailVerify');
var profilePage = require('./routes/user/profilePage');
var admin = require('./routes/admin/dashboard');
var userManagement = require('./routes/admin/userManagement');
var addProduct = require('./routes/admin/addProduct');
var categoryManagement = require('./routes/admin/categoryManagement');
var showProducts = require('./routes/admin/showProducts');
var cart = require('./routes/user/cart')

var dataBase = require('./config/connection');

var app = express();


app.use(session({secret:'key',cookie:{maxAge:600000}}))

app.use((req,res,next)=>{
  res.set('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

dataBase.connect((err)=>{
  if(err){
    console.log(("***DATABASE NOT CONNECTED***"));
  }
  else{
    console.log("***DATABASE CONNECTED***");
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(fileUpload())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', userRegister);
app.use('/signIn', userLogin);
app.use('/verify', otpVerify);
app.use('/emailVerify',emailVerify);
app.use('/profile', profilePage);
app.use('/admin', admin);
app.use('/userManagement', userManagement);
app.use('/addProduct', addProduct);
app.use('/categoryManagement', categoryManagement);
app.use('/showProducts', showProducts);
app.use('/cart', cart);



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
