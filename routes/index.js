var express = require('express');
var router = express.Router();

var api_routes = require('./api');
var dashboard_routes = require('./dashboard');
var mydashboard_routes = require('./mydashboard');

var auth_routes = require('./auth');
var signup_routes = require('./sign_up');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

//all requests come here to validate the if api key is present
//else redirect to login
/*router.use(function(req, res, next) {
console.log("Index page 1");
	//set this header, so that there is no browser caching when destroying the session.
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	
	//check to see if we are in Bluemix and if we are bound to IoT service		
	if (! req.session.api_key && process.env.VCAP_SERVICES && req.path.indexOf('login') === -1)
	{
		var keys = getAuthFromVCAP(process.env.VCAP_SERVICES);
		if( keys.api_key) {
									  console.log("Index page 2");

			//found IoTF service, so set the api key and auth token
			req.session.api_key=keys.api_key;
			req.session.auth_token=keys.auth_token;
			req.session.isBluemix= true;
			res.redirect("/dashboard");
		} else {
			//no service found, so redirect to login page
						  console.log("Index page 3");

			res.render("/login",{ title: 'ejs' });
			
		}
	}
	// for api calls, send 401 code
	else if(! req.session.api_key && req.path.indexOf('api') != -1) {
		res.status(401).send({error: "Not authorized"});
	}
	// for all others, redirect to login page
	else if(! req.session.api_key && req.path.indexOf('login') === -1) {
			  console.log("Index page  4");

		res.render("index",{ title: 'IOT' });
	} else {
		next();
	}
});
*/

router.get('/', function(req, res) {
	console.log("Auth.js ////// index Page");
  res.render('index', { title: 'EGY IOT' });
});




router.post('/signup', function(req, res) {
	console.log("Sign_up Post");
	console.log(" Mongoose Module is "+mongoose);
	
	    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
	
	console.log(" User "+email + " Password "+pass)
    if (!(email && pass)) {
      return invalid();
    }

    User.findById(email, function (err, user) {
      if (err) return next(err);

      if (user) {
		  console.log("User Already Existing");
        return res.render('sign_up', { exists: true });
      }

      crypto.randomBytes(16, function (err, bytes) {
        if (err) return next(err);

        var user = { _id: email };
        user.salt = bytes.toString('utf8');
        user.hash = hash(pass, user.salt);

        User.create(user, function (err, newUser) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            } 
            return next(err);
          }

          // user created successfully
          req.session.isLoggedIn = true;
          req.session.user = email;
          console.log('created user: %s', email);
          return res.redirect('/login');
        })
      })
    })

    function invalid () {
      return res.render('sign_up', { invalid: true });
    }
	
	
  //res.redirect("/login");
});

//manage login routes
router.use('/',auth_routes);

// Sign Up
router.use('/sign_up',signup_routes);

//dashboard routes
router.use('/index', dashboard_routes);
router.use('/dashboard', mydashboard_routes);

//proxy api routes TODO: remove this after datapower handles the CORS requests
router.use('/api/v0001',api_routes);

function getAuthFromVCAP(VCAP_SERVICES) {

	var env = JSON.parse(VCAP_SERVICES);
	for (var service in env) {
		//find the IoT Service
		for (var i=0;i<env['iotf-service'].length;i++) {
			
			if (env['iotf-service'][i].credentials.iotCredentialsIdentifier) {
				//found an IoT service, return api_key and api_token session variables
				return { api_key : env['iotf-service'][i].credentials.apiKey,
						auth_token : env['iotf-service'][i].credentials.apiToken }
			}
		}
	}
	return {};
}

module.exports = router;
