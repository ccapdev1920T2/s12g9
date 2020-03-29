//These are the imports, libraries javascript
const express = require('express');

//Create a session middleware 
var session = require('express-session');

//Calling the express function 
const app = express();
//THE PORT OF THE WEBSITE
const port = 3000;

//The localhost variable
const hostname = 'localhost';
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

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

//partials for hbs
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials')

module.exports = app;