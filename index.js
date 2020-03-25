//These are the imports, libraries javascript
const express = require('express');

//Saving information about the user
// const session = require('express-session');

//The localhost variable
const hostname = 'localhost';

//THE PORT OF THE WEBSITE
const port = 3000;

//NOT YET NEEDED 
const path = require('path');

//For forms 
const bodyParser = require('body-parser');

//Calling the express function 
const app = express();

//Create a session middleware 
var session = require('express-session')

//MONGO DB
const { MongoClient } = require('mongodb');

//URL OF THE DATABASE
// const uri = "mongodb+srv://user:pass1234@database-ourwj.mongodb.net/test?retryWrites=true&w=majority";
const uri = `mongodb://localhost:27017/test`;

//Opens a new mongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//set view engine and stylesheets
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public')));

//partials for hbs
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials')
    // hbs.registerHelper('display', function(whichHeader){
    //     if (whichHeader === 'guest'){
    //         return header;
    //     }
    //     else if (whichHeader === 'user'){
    //         return headerUser;
    //     }
    //     else {
    //         return headerAdmin;
    //     }
    // });

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//The client using the url, will connect to the database
client.connect().then(() => {
    //making a new collection -- name of the db is test and the name of the collection is devices
    const db = client.db('HotelParaiso');

    //use to create session
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: "secret",
    }));

    // admin router
    const adminRouter = require('./routes/adminRoute')(db);
    app.use('/admin', adminRouter);

    //home router
    const homeRouter = require('./routes/homeRoute')(db); //passing db to the file homeRoute.js
    app.use('/', homeRouter);

    // user router
    const userRouter = require('./routes/userRoute')(db);
    app.use('/user', userRouter);

    // payments router
    const paymentRouter = require('./routes/paymentRoute')(db);
    app.use('/totalCharge', paymentRouter);

    // hotel router << normal users and guest
    const hotelRouter = require('./routes/hotelRoute');
    app.use('/hotel', hotelRouter);

    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}).catch(err => {
    console.log(err);
});

module.exports = app;