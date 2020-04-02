var express = require('express');
var router = express.Router();

router.get('/add/:prod_id', function(req,res) {
    var prod = req.params.prod_id;
    console.log("adding:" + prod);
    if(typeof req.session.cart == "undefined") {
        console.log("undefined");
        req.session.cart = [];
        req.session.cart.push({
            id: prod,
            qty: 1
        });
    } else {
        var cart = req.session.cart;
        var newItem = true;
        for(var i=0; i<cart.length;i++) {
            if (cart[i].id == prod) {
                cart[i].qty++;
                newItem=false;
                break;
            }
        }
        if(newItem) {
            req.session.cart.push({
                id: prod,
                qty: 1
            });
        }
    }
    console.log(req.session.cart);
    res.redirect('back'); //change this to render a confirm page
});

router.get('/checkout', function(req,res) {
    res.render('cart', {pageText: 'Items in cart:'} );
});

module.exports = router;