var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var squareConnect = require('square-connect');

//square integration
const accessToken = "EAAAEAeatq9G4g_cBlQGgGnOEHXwko09IHmE6sykwZ1xLuR2PqgLRqkglGwDplwp";
const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = accessToken;

// Set 'basePath' to switch between sandbox env and production env
// sandbox: https://connect.squareupsandbox.com
// production: https://connect.squareup.com
defaultClient.basePath = 'https://connect.squareupsandbox.com';


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

router.post('/process-payment', async (req, res) => {
    const request_params = req.body;
  
    // length of idempotency_key should be less than 45
    const idempotency_key = crypto.randomBytes(22).toString('hex');
  
    // Charge the customer's card
    const payments_api = new squareConnect.PaymentsApi();
    const request_body = {
      source_id: request_params.nonce,
      amount_money: {
        amount: 100, // $1.00 charge
        currency: 'USD'
      },
      idempotency_key: idempotency_key
    };
  
    try {
      const response = await payments_api.createPayment(request_body);
      res.status(200).json({
        'title': 'Payment Successful',
        'result': response
      });
    } catch(error) {
      res.status(500).json({
        'title': 'Payment Failure',
        'result': error.response.text
      });
    }
  });

module.exports = router;