var express = require('express');
var mongo = require('mongodb');
var router = express.Router();

var url = 'mongodb://localhost:27017/CalcRoll';

//monthly report page
router.get('/', function (req, res) {
    if (req.session.isLogin == undefined) {
        res.redirect('/');
    } else {
        if (req.session.filter == "show") {
            req.session.filter = "hide";
            res.render('monthly-report.ejs', {monthData: req.session.monthData, total: req.session.total, msg: req.session.msg, currentYear: req.session.currentYear, currentMonth: req.session.currentMonth} );
        } else {
            filtering(req, res);
        }
    }
});

//return selected month data 
router.post('/filter', function(req, res) {
    filtering(req, res);
});

//edit chosen item
router.post('/edit', function(req, res) {
    var userEmail = req.session.email;
    userEmail = userEmail.split('@');
    userEmail = userEmail[0] + userEmail[1];
    var dayID = req.body.dayID;
    var year = req.session.currentYear;
    var month = req.session.currentMonth;
    var day = parseInt(req.body.day);
    var logonTime = req.body.logon_time;
    var whenExiting = req.body.when_exiting;
    var hourlyWage = req.body.hourly_wage;
    var isBreak = req.body.is_break;
    var workingDay = new DayData(year, month, day, hourlyWage, logonTime, whenExiting, isBreak);
    workingDay.start();
    mongo.connect(url, function(err, db, next){ 
        db.collection(userEmail).replaceOne({ _id : new mongo.ObjectID(dayID) } ,workingDay);
        db.close();
        filtering(req, res);
    });
});

//delete chosen item
router.post('/delete', function(req, res) {
    var userEmail = req.session.email;
    userEmail = userEmail.split('@');
    userEmail = userEmail[0] + userEmail[1];
    var dayID = req.body.dayID;
    mongo.connect(url, function(err, db, next){ 
        db.collection(userEmail).deleteOne({ _id : new mongo.ObjectID(dayID) });
        db.close();
        filtering(req, res);
    });
});

//global filtering function
function filtering(req, res) {
    var userEmail = req.session.email;
    userEmail = userEmail.split('@');
    userEmail = userEmail[0] + userEmail[1];
    var year = parseInt(req.body.year);
    var month = parseInt(req.body.month);
    if (isNaN(year) == true || isNaN(month) == true) {
        var date = new Date();
        year = date.getFullYear();
        month = date.getMonth() + 1;
    }
    req.session.currentYear = year;
    req.session.currentMonth = month;
    mongo.connect(url, function(err, db, next){
        var monthData = [];
        var cursor = db.collection(userEmail).find({$and:[{year: year}, {month: month}]}).sort({day: 1});
        cursor.forEach(function(doc) {
            monthData.push(doc);
        }, function() {
            db.close;
            var totalHours = 0;
            var totalHours100 = 0; 
            var totalHours125 = 0; 
            var totalHours150 = 0;
            var totalPayment = 0;
            monthData.forEach(function(doc) {
                totalHours += parseFloat(doc.totalHours);   
                totalHours100 += parseFloat(doc.hours100);  
                totalHours125 += parseFloat(doc.hours125);
                totalHours150 += parseFloat(doc.hours150);  
                totalPayment += parseFloat(doc.payment);
            });
            var total = {
                days: monthData.length,
                hours: totalHours.toFixed(2),
                hours100: totalHours100.toFixed(2),
                hours125: totalHours125.toFixed(2),
                hours150: totalHours150.toFixed(2),
                payment: totalPayment.toFixed(2)
            }
            if (monthData[0] == null) {
                req.session.msg = "data is not exist";
                req.session.monthData = false;
            } else {
                req.session.msg = "";
                req.session.monthData = monthData;
                req.session.total = total;
            }
            req.session.filter = "show";
            res.redirect('/user/monthly-report');
        });
    });
}

//createing the working day object data
class DayData {
    constructor(year, month, day, hourlyWage, logonTime, whenExiting, isBreak) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hourlyWage = hourlyWage;
        this.logonTime = logonTime;
        this.whenExiting = whenExiting;
        this.isBreak = isBreak;
    }

    totalHours() {
        var totalTime = 0;
        var logonTimeHex = Math.floor(this.logonTime) + ((this.logonTime - Math.floor(this.logonTime))/0.6);
        var exitingTimeHex = Math.floor(this.whenExiting) + ((this.whenExiting - Math.floor(this.whenExiting))/0.6);
        if (logonTimeHex < exitingTimeHex){
            totalTime = exitingTimeHex - logonTimeHex;
        }
        else if (logonTimeHex > exitingTimeHex){
            totalTime = (24-logonTimeHex) + exitingTimeHex;
        }
        if (this.isBreak == 'on'){
            totalTime -= 0.5;
        }
        return this.totalHours = totalTime.toFixed(2);
    }

    hours100() {
        var hours100 = 0;
        if (this.totalHours > 8.6){
            hours100 = 8;
        }
        else{
            hours100 = this.totalHours;
        }
        return this.hours100 = hours100;
    }

    hours125() {
        var hours125 = 0;
        if (this.totalHours > 10){
            hours125 = 2;
        }
        else if (this.totalHours > 8.6){
            hours125 = this.totalHours - 8;
        }
        return this.hours125 = hours125;
    }

    hours150() {
        var hours150 = 0;
        if (this.totalHours > 10){
            hours150 = this.totalHours - 10;
        }
        return this.hours150 = hours150;
    }

    payment() {
        var pay = 0;
        if (this.totalHours > 10){
            pay = 8 * this.hourlyWage + this.hours125 * this.hourlyWage * 1.25 + this.hours150 * this.hourlyWage * 1.5;
        }
        else if (this.totalHours > 8.6){
            pay = 8 * this.hourlyWage + this.hours125 * this.hourlyWage * 1.25;
        }
        else{
            pay = this.totalHours * this.hourlyWage;
        }
         return this.payment = pay.toFixed(2);
    }

    start() {
        this.totalHours();
        this.hours100();
        this.hours125();
        this.hours150();
        this.payment();
    }

}

module.exports = router;
