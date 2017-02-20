const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// use environment variable to set dynamic port for heroku deployment
const port = process.env.PORT || 3000;

// just call the express() method to create an app
const app = express();

// register partials
hbs.registerPartials(`${__dirname}/views/partials`);

// set key : value for express middleware handlebars
app.set('view engine', hbs);

// use next to tell middleware when fn is done and allows to continue app
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `Timestamp: ${now}, Method: ${req.method}, Url: ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', `${log}\n`, (err) => {
    if (err) {
      console.log('Unable to append to server.log file');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'Maintenance Page'
//   });
// });

// register express middleware
app.use(express.static(`${__dirname}/public`));

// handlebars helper fn to dynamically render data to pageTitle
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', text => text.toUpperCase());

// register http route handlers
app.get('/', (req, res) => {
  // response for an http request from user
  // res.send('<h1>Hello Express.js!</h1>');
  // res.send({
  //   name: 'Preston',
  //   likes: [
  //     'biking',
  //     'cities'
  //   ]
  // });
  res.render('home.hbs', {
    welcomeMessage: 'Welcome to Node Express Tutorial!',
    pageTitle: 'Home Page',
  });
});
// dynamic renering with hbs (express wrapper for handlebars)
app.get('/about', (req, res) => {
  // res.send('About page');
  // accepts a second arg as obj for dynamic rendering
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

// bad; send back JSON with error message property: "Error handling request"
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Error handling request'
  });
});
// listen on localhost port 3000
// use environment variable to set dynamic port for heroku deployment
app.listen(port, () => {
  console.log(`Server is active on port: ${port}`);
});
