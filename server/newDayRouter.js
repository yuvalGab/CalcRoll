var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var url = 'mongodb://localhost:27017/CalcRoll';

//annual-report page
router.get('/', function (req, res) {
    if (req.session.isLogin == undefined) {
        res.redirect('/');
    } else {
    res.render('new-day.ejs', {user: req.session.email});
    }
});

//create new day in database
router.post('/create-day', function(req, res) {
    var year = parseInt(req.body.year);
    var month = parseInt(req.body.month);
    var day = parseInt(req.body.day);
    var hourlyWage = req.body.hourly_wage;
    var logonTime = req.body.logon_time;
    var whenExiting = req.body.when_exiting;
    var isBreak = req.body.break;
    var workingDay = new DayData(year, month, day, hourlyWage, logonTime, whenExiting, isBreak);
    workingDay.start();
    var userEmail = req.session.email;
    userEmail = userEmail.split('@');
    userEmail = userEmail[0] + userEmail[1];
    mongo.connect(url, function(err, db, next){
        db.collection(userEmail).insertOne(workingDay);
        db.close;
        res.redirect('/user');
    });
});

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