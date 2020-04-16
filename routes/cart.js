var express = require('express');
var router = express.Router();

router.get('/add/:prod_id', function(req,res) {
    var prod = req.params.prod_id;
    console.log("adding:" + prod);
    if(typeof req.session.cart == "undefined") { //if there isn't a cart defined, create a new one and add first product
        console.log("cart undefined");
        req.session.cart = [];
        req.session.cart.push({
            id: prod,
            qty: 1
        });
    } else { //if the session already has a cart, look to see if it already has the item. if so, increase quantity. if not, add new item
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
    res.render('cart', {pageText: 'Items in cart:', cart: req.session.cart} );
});

module.exports = router;