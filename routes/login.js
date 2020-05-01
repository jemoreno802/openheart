var express = require('express');
var router = express.Router();

//the below route is reached when a user clicks the login/logout button
router.get('/', function(req, res) { 
    if(typeof sess !== "undefined"){//if there is a session defined, they must be clicking 'logout'
        if(typeof sess.user !== "undefined"){
            sess = undefined; //logout
            req.session.destroy();
            res.render('index', {user: ""});
        }  
    }else{ //if a session has not been defined, the user must be trying to login 
        console.log("csrf token: " + req.csrfToken());
        res.render('login', {message: "", csrfToken: req.csrfToken()});
    }
    
});

router.post('/', function(req,res) {
    db.query("SELECT * FROM openheart_db.users WHERE username = ? AND pass = ?;", [req.body.username, req.body.password], (err, result) =>{
        if(err){
            console.log("DB ERROR");
            res.redirect('login', {message: "database error"});
        } else{
            if(result.length){ //if we receive a result that is not undefined
                console.log("authenticated user : " + req.body.username);
                sess = req.session; //assign session and session user
                sess.user = req.body.username;
                //req.session.cart = undefined;
                res.render('index', {user: req.body.username}); 
            } else{ //if result.length is undefined, there is no user matching the credentials
                console.log("incorrect credentials");
                res.render('login', {message: "incorrect credentials", csrfToken: req.csrfToken()});
            }
        }
    });
});

module.exports = router;