var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req,res, next){
  sess = req.session;
  console.log("sessionID: " + req.sessionID);
  res.render('index');
});

/* GET about page. */
router.get('/about', function(req, res, next){
  res.render('about', {pageTitle: 'About'} );
});

module.exports = router;