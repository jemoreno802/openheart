var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req,res, next){
  var usr;
  if(typeof sess !== "undefined"){ //check if there is an active session, if so pass the username to be rendered along with the index page
    usr = sess.user;
  } else {
    usr = "";
  }
  res.render('index', {user: usr});
});

/* GET about page. */
router.get('/about', function(req, res, next){
  res.render('about', {pageTitle: 'About'} );
});

module.exports = router;