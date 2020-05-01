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
defaultClient.basePath = 'https://connect.squareupsandbox.com';

//adds a product to the cart
router.get('/add/:prod_id/images/:prod_img', function(req,res) {
    var prod = req.params.prod_id;
    var img = "/images/" + req.params.prod_img;
    var pprice = getProductPrice(prod);
    console.log("adding:" + prod + " with image: " + img);
    if(typeof req.session.cart == "undefined") { //if there isn't a cart defined, create a new one and add first product
        console.log("cart undefined");
        req.session.cart = [];
        req.session.cart.push({
            id: prod,
            qty: 1, 
            image: img,
            price: pprice
        });
    } else { //if the session already has a cart, look to see if it already has the item. if so, increase quantity. if not, add new item
        var cart = req.session.cart;
        var newItem = true;
        for(var i=0; i<cart.length;i++) {
            if (cart[i].id == prod) {
                cart[i].qty++;
                newItem=false;
                //dont adjust price because we will multiply by qty at cart checkout
                break;
            }
        }
        if(newItem) {
            req.session.cart.push({
                id: prod,
                qty: 1,
                image: img,
                price: pprice
            });
        }
    }
    console.log(req.session.cart);
    res.redirect('back'); //change this to render a confirm page
});

//render page with cart contents
router.get('/mycart', function(req,res) {
    //calculate total price of cart
    req.session.cart.total = 0;
    for(var i=0; i<req.session.cart.length;i++) {
        req.session.cart.total += (req.session.cart[i].price * req.session.cart[i].qty);
    }
    res.render('cart', {pageText: 'Items in cart:', cart: req.session.cart, total: req.session.cart.total} );
});

//render page with form for shipping info
router.get('/checkoutinfo', function(req, res) {
    res.render('checkoutinfo', {cart: req.session.carts});
});

//processes the checkout information and then renders page with credit card payment 
router.post('/checkoutpayment', function(req, res) {
    //TODO:insert the stuff into the database, generate order ID, THEN re

    req.session.paymentinfo = [];
    req.session.paymentinfo.push({
        orderno: 12345,
        email: req.body.email,
        phonenum: req.body.phonenum, 
        addr: req.body.addr
    });
    //console.log("PAYMENT INFOS" + JSON.stringify(req.session.paymentinfo));
    res.render('checkoutpayment', {cart: req.session.cart});
});

//processes square payment
router.post('/process-payment', async (req, res) => {
    const request_params = req.body;
    const idempotency_key = crypto.randomBytes(22).toString('hex');
    const paymentinfos = req.session.paymentinfo;
    console.log("PAYMENT INFOSquare" + JSON.stringify(paymentinfos));
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
      //here do the stuff

      let query = "INSERT INTO order_details(email,shipping_addr) VALUES ('" + paymentinfos[0].email + "','" + paymentinfos[0].addr + "');";
      console.log(query);
      var orderID;
      db.query(query, (err, result)=> {
        if(err){
            res.redirect('/');
        }
        orderID = result.insertId;//this wont always work since javascript wont wait for this value to be set before sending the response
        //BUT, it will always update the database so the info is not lost
      });

      res.status(200).json({
        'title': 'Payment Successful',
        'result': response, 
        'order' : orderID
      });
      
    } catch(error) {
      res.status(500).json({
        'title': 'Payment Failure',
        'result': error.response.text
      });
    }
  });

function getProductPrice(id) {
    prods = JSON.parse(globalproducts);
    for(var i = 0; i<prods.length; i++){
        if(prods[i].p_id == id) {
            return prods[i].p_price;
        }
    }
}

module.exports = router;