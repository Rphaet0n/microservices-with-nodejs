var express = require('express');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;

//for https
var https = require('https');
var fs = require('fs');
//for requests
//var url = require('url');
const fetch = require("node-fetch");
var URLSearchParams = require('url-search-params');


passport.use(new Strategy({
    consumerKey: 'ZVYDKnSjYhybM5dtJkMPaE8g1',
    consumerSecret: '0kJPGmb9maEILYeZGbId0b1jxl2oqti8B8s0joPMklIH4jYaJx',
    callbackURL: 'https://apigateway.ddns.net/login/twitter/return'
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }));


passport.serializeUser(function(user, cb) {
  cb(null, user);
  //console.log('serializing user:', user)
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
  //console.log('deserializing user:', obj)  
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/twitter',
  passport.authenticate('twitter'));

app.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

  app.get('/articles',
  require('connect-ensure-login').ensureLoggedIn(),
  async function(req, res){
    try {
      const response = await fetch("http://localhost:1111/api/articles");
      const json = await response.json();
      console.log(json.data);
      res.render('articles', { results: json.data });
    } catch (e) {
      console.log(e)
    }
  });

  app.get('/create_article',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('post');
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


  app.post('/create_article', require('connect-ensure-login').ensureLoggedIn(),
  async function (req, res) {
   console.log(req.body)
   const form = new URLSearchParams();
   form.append('author', req.body.author);
   form.append('title', req.body.title);
   form.append('content', req.body.content);   
  //console.log(formurlencoded.default(req.body))
   const response = await fetch('http://localhost:1111/api/create_article', { method: 'POST', body: form, 
   headers: {'Content-Type': 'application/x-www-form-urlencoded'}} )
   if (response.ok) {
      res.redirect('/articles');
   }
   console.log(response)   
  })


 
  var options = {
      key: fs.readFileSync('server.key'),
      passphrase: '000000',
      cert: fs.readFileSync('server.crt'),
      requestCert: false,
      rejectUnauthorized: false
  };
  
  //app.listen(3001);
  var server = https.createServer(options, app).listen(3001, function(){
      console.log("server started at port 3001");
  });

