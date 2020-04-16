//These are the imports, libraries javascript
const express = require('express');

//Create a session middleware 
var session = require('express-session');

//for basic website security
var helmet = require('helmet');

//Calling the express function 
const app = express();
//THE PORT OF THE WEBSITE
const port = process.env.PORT || 3000;
//The localhost variable
const hostname = 'localhost';
const LOCAL_ADDRESS='0.0.0.0'
const path = require('path');

//For forms 
const bodyParser = require('body-parser');

//set view engine and stylesheets
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public')));

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
}));

//calling helmet
app.use(helmet());

const adminRouter = require('./routes/adminRoute.js');
app.use('/admin', adminRouter);

//home router
const homeRouter = require('./routes/homeRoute.js'); //passing db to the file homeRoute.js
app.use('/', homeRouter);

// user router
const userRouter = require('./routes/userRoute.js');
app.use('/user', userRouter);

// payments router
const paymentRouter = require('./routes/paymentRoute.js');
app.use('/totalCharge', paymentRouter);

// hotel router << normal users and guest
const hotelRouter = require('./routes/hotelRoute.js');
app.use('/hotel', hotelRouter);

app.listen(port, LOCAL_ADDRESS, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

//partials for hbs
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials')

//hbs helpers
const hbsHelpers = require(__dirname +'/controllers/hbsController.js');
hbs.registerHelper(hbsHelpers);

module.exports = app;
