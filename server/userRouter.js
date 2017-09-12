var express = require('express');
var router = express.Router();

//import routering fiels
var newDayRouter = require('./newDayRouter');
var monthlyReportRouter = require('./monthlyReportRouter');
var annualReportRouter = require('./annualReportRouter');
var statisticsRouter = require('./statisticsRouter');

//routering management
router.use('/', newDayRouter);
router.use('/monthly-report', monthlyReportRouter);
router.use('/annual-report', annualReportRouter);
router.use('/statistics', statisticsRouter);

//log-out from the app
router.get('/log-out', function(req, res) {
   req.session.destroy();
   res.redirect('/');
});

module.exports = router;