var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if(typeof sess !== "undefined"){
        if(typeof sess.user !== "undefined"){
            sess = undefined; //logout
            res.render('index', {user: ""});
        }  
    }else{
        res.render('login', {message: ""});
    }
    
});

router.post('/', function(req,res) {
    let query = "SELECT * FROM openheart_db.users WHERE username = '" + req.body.username + "' AND pass = '" + req.body.password + "';";

    db.query(query, (err, result) =>{
        if(err){
            console.log("DB ERROR");
            res.redirect('/');
        } else{
            if(result.length){
                console.log("authenticated");
                sess = req.session;
                sess.user = req.body.username;
                console.log("username: " + req.body.username + " password: " + req.body.password);
                res.render('index', {user: req.body.username});
            } else{
                console.log("incorrect credentials");
                res.render('login', {message: "incorrect credentials"})
            }
            
        }
    });
});

module.exports = router;