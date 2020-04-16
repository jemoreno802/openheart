var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('express-session');
var querystring = require('querystring');
var bodyparser = require('body-parser');
var csurf = require('csurf');
//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cartRouter = require('./routes/cart');
var productsRouter = require('./routes/products');
var loginRouter = require('./routes/login')

var app = express();

//database connection
var db = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password: 'password',
  database: 'openheart_db'
});
db.connect((err) => {
  if(err) {
    throw err;
  }
  console.log('connected to database');
});
global.db = db;

global.sess;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}));

//csurf middleware
app.use(csurf());
//set csurf token for request
app.use(function(req, res, next) {
  console.log("CSURF token set");
  res.locals._csrf = req.csrfToken();
  next();
});

//setup routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/products', productsRouter);
app.use('/login', loginRouter);

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

// set cart for all GET requests
app.get('*', function(req,res,next) {
  res.locals.cart = req.session.cart;
  next();
});

//support JSON and URL encoded bodies
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

//https.createServer(options, app).listen(3000, function(){
  //console.log('server started: listening on port 3000');
//});

module.exports = app;
