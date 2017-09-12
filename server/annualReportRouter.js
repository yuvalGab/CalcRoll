var express = require('express');
var mongo = require('mongodb');
var router = express.Router();

var url = 'mongodb://localhost:27017/CalcRoll';

//annual report page
router.get('/', function (req, res) {
    if (req.session.isLogin == undefined) {
        res.redirect('/');
    } else {
        if (req.session.filter == "show") {
            req.session.filter = "hide";
            res.render('annual-report.ejs', {msg: req.session.msg, yearData: req.session.yearData, total: req.session.total, currentYear: req.session.currentYear});
        } else {
            filtering(req, res);
        }
    }
});

//return selected year data 
router.post('/filter', function(req, res) {
    filtering(req, res);
});

function filtering(req,res) {
    var userEmail = req.session.email;
    userEmail = userEmail.split('@');
    userEmail = userEmail[0] + userEmail[1];
    var year = parseInt(req.body.year);
    if (isNaN(year) == true) {
        var date = new Date();
        year = date.getFullYear();
    }
    if (isNaN(year) == true) {
        var date = new Date()
        year = date.getFullYear();
    }
    req.session.currentYear = year;
    mongo.connect(url, function(err, db, next) {
        var total = {
            days: 0,
            hours: 0,
            hours100: 0,
            hours125: 0,
            hours150: 0,
            payment: 0
        };
        var yearData = [];
        for (var i = 0; i <= 12; i++) {
            yearData[i] ={
                days: 0,
                totalHours: 0,
                hours100: 0,
                hours125: 0,
                hours150: 0,
                payment: 0
            };
        }
        var cursor = db.collection(userEmail).find({year: year}).sort({month: 1});
        cursor.forEach(function(doc) {
            for (var i = 1; i <= 12; i++) {
                if (doc.month == i) {
                    yearData[i].days++;
                    yearData[i].totalHours += parseFloat(doc.totalHours);
                    yearData[i].hours100 += parseFloat(doc.hours100);
                    yearData[i].hours125 += parseFloat(doc.hours125);
                    yearData[i].hours150 += parseFloat(doc.hours150);
                    yearData[i].payment += parseFloat(doc.payment);
                    total.days++;
                    total.hours += parseFloat(doc.totalHours);
                    total.hours100 += parseFloat(doc.hours100);
                    total.hours125 += parseFloat(doc.hours125);
                    total.hours150 += parseFloat(doc.hours150);
                    total.payment += parseFloat(doc.payment);
                }
            }
        }, function () {
            db.close();
            var dataExist = false;
            for (var i = 0; i <= 12; i++) {
                if (yearData[i].days != 0) {
                    dataExist = true;
                }    
            }
            if (!dataExist) {
                req.session.msg = "data is not exist";
                req.session.yearData = false;
            } else {
                req.session.msg = "";
                req.session.yearData = yearData;
                req.session.total = total;
            }
            req.session.filter = "show";
            res.redirect('/user/annual-report');
        });
    });
} 

module.exports = router;