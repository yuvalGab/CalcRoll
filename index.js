var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

//use node modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'yuval', resave: false, saveUninitialized: true,}));

//server static folders
app.use("/javascripts", express.static(__dirname + "/javascripts"));
app.use("/stylesheets", express.static(__dirname + "/stylesheets"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/server", express.static(__dirname + "/server"));
app.set('view engine', 'ejs');

//import routering fiels
var loginRouter = require('./server/loginRouter');
var userRouter = require('./server/userRouter');

//check if user is connecting 
app.get('/', function(req, res) {
    if (req.session.isLogin == true) {
        res.redirect('/user');
    } else {
        res.redirect('/login');
    }
});

//routering management
app.use('/login', loginRouter);
app.use('/user', userRouter);

app.listen(8082, function () {
    console.log('CalcRoll app listening in porn 8082');
});
