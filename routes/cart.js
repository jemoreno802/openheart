var express = require('express');
var router = express.Router();

router.get('/add/:prod_id/images/:prod_img', function(req,res) {
    var prod = req.params.prod_id;
    var img = "/images/" + req.params.prod_img;

    console.log("adding:" + prod + " with image: " + img);
    if(typeof req.session.cart == "undefined") { //if there isn't a cart defined, create a new one and add first product
        console.log("cart undefined");
        req.session.cart = [];
        req.session.cart.push({
            id: prod,
            qty: 1, 
            image: img
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
                qty: 1,
                image: img
            });
        }
    }
    console.log(req.session.cart);
    res.redirect('back'); //change this to render a confirm page
});

router.get('/checkout', function(req,res) {
    res.render('cart', {pageText: 'Items in cart:', cart: req.session.cart} );
});

router.get('/checkoutpage', function(req,res) {
    res.render('checkoutpage', {cart: req.session.cart});
});

module.exports = router;