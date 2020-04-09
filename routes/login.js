var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if(typeof sess !== "undefined"){
        if(typeof sess.user !== "undefined"){
            sess.user = undefined; //Logout
            res.render('index', {user: ""});
        }  
    }else{
        res.render('login');
    }
    
});

router.get('/loginClick', function(req,res){
    sess = req.session;
    console.log("sessionID: " + req.sessionID);
    sess.user = 'Jackie'
    res.render('index', {user: 'JACKIE'});
});

module.exports = router;