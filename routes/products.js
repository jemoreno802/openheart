var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  
  //DB query to pass along products
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