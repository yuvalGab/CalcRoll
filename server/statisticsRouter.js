var express = require('express');
var mongo = require('mongodb');
var router = express.Router();

var url = 'mongodb://localhost:27017/CalcRoll';

//statistics report page
router.get('/', function (req, res) {
    if (req.session.isLogin == undefined) {
        res.redirect('/');
    } else {
        var userEmail = req.session.email;
        userEmail = userEmail.split('@');
        userEmail = userEmail[0] + userEmail[1];
        monthsGraph(req, res ,userEmail, graph2);
        function graph2() {
            yearsGraph(req, res, userEmail, finish);
        }
        function finish() {
            res.render('statistics.ejs', {monthsData: req.session.monthsData, yearsData: req.session.yearsData});
        }
    }
});

function monthsGraph(req, res, userEmail ,callback) {
    var monthsData = [];
    for (var i = 1; i<= 12; i++) {
        monthsData[i] = {
            totalPayment: 0,
            totalDays: 0
        };      
    }
    var date = new Date();
    var year = date.getFullYear();
    mongo.connect(url, function (err, db, next){ 
        var cursor = db.collection(userEmail).find({year: year}).sort({month: 1});
        cursor.forEach(function(doc) {
            for (var i = 0; i <=12; i++) {
                if (doc.month == i) {
                    monthsData[i].totalPayment += parseFloat(doc.payment);
                    monthsData[i].totalDays++;
                }
            }
        }, function() {
            db.close();
            req.session.monthsData = monthsData;
            callback();
        });
    });
}

function yearsGraph(req, res, userEmail, callback) {
    var yearsData = [];
    for (var i = 1; i <= 15; i++) {
        yearsData[i] = {
            totalPayment: 0,
            totalDays: 0
        }
    }
    mongo.connect(url, function (err, db, next){
        var cursor = db.collection(userEmail).find().sort({year: 1});
        cursor.forEach(function(doc) {
            for (var i = 1; i <= 15; i++) {
                if(doc.year == (i + 2015)) {
                    yearsData[i].totalPayment += parseFloat(doc.payment);
                    yearsData[i].totalDays++;
                }
            }
        }, function() {
            db.close();
            req.session.yearsData = yearsData;
            callback();
        });
    });
}

module.exports = router;