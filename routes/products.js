var express = require('express');
var router = express.Router();

//This is the router for the products page. It queries the database for all available products
//and then renders the products template, passing the products in as a variable to the page
router.get('/', function(req, res, next) {
  let query = "SELECT * FROM openheart_db.products;";
  db.query(query, (err, result)=>{
    if(err) {
      res.redirect('/');
    }
    res.render('products', { 
      title: 'Home page',
      products: result,
      layout: 'layout'
    });
  });
});

module.exports = router;