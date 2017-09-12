var express = require('express');
var mongo = require('mongodb');
var passwordHash = require('password-hash');
var router = express.Router();

var url = 'mongodb://localhost:27017/CalcRoll';

//first app page - login
router.get('/', function (req, res) {
    res.render('login.ejs', {msg: req.session.msg});
});

//create a new account
router.post('/new-account', function (req, res) {
    var user = {
            email: req.body.new_email,
            password: passwordHash.generate(req.body.new_password)
        };
    mongo.connect(url, function(err, db, next){
        var checkData = [];
        req.session.msg = "please insert valid email and password";
        var cursor = db.collection('users').find({"email": user.email});
        cursor.forEach(function(doc) {
            checkData.push(doc);
        }, function() {
            if (checkData[0] == undefined && user.email != "" && req.body.new_password != "") {
                db.collection('users').insertOne(user);
                req.session.msg = "user create successfully";
            } else if (user.email != "" && req.body.new_password != "") {
                req.session.msg = "email already exist";
            }
            db.close();
            res.redirect('/login');
        });
    });
});

//login
router.post('/connect', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var userDatabase = [];
    mongo.connect(url, function(err, db, next){
        var cursor = db.collection('users').find({"email": email});
        cursor.forEach(function(doc) {
            userDatabase.push(doc);
        }, function(){
            db.close();
            if (userDatabase[0] != undefined) {
                if ( (passwordHash.verify(password, userDatabase[0].password)) == true ) {
                    req.session.isLogin = true;
                    req.session.email = email;
                    req.session.msg = "";
                    res.redirect('/user');
                } else {
                    req.session.msg = "incorrect password";
                    res.redirect('/login');
                }
            } else {
                req.session.msg = "please insert correct email and password";
                res.redirect('/login');
            }
        });
    });
});

module.exports = router;