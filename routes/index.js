var express = require('express');
var router = express.Router();
const products = require('../products.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home page',
    products: products.profiles
  });
});

/* GET about page. */
router.get('/about', function(req, res, next){
  res.render('about', {pageTitle: 'About'} );
});

/* GET products page. */
router.get('/products', function(req, res, next){
  res.render('products', {pageText: 'Products available:'} );
});

module.exports = router;