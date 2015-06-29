var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var engines = require('consolidate');
var mongoose = require('mongoose');
require('express-mongoose');
var models = require('./models');
var Sensor = mongoose.model('Sensor');
var SensorDataMod = mongoose.model('SensorData');

var mqtt = require('mqtt')



var index = require('./routes/index');

var app = express();

var http_host = (process.env.VCAP_APP_HOST || '0.0.0.0');
var http_port = (process.env.VCAP_APP_PORT || 7000);
app.set('sensorCounter',2);
app.set('port', http_port);
app.set('host',http_host);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

 //use favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// add session to store the api-key and auth token in the session
app.use(session({secret: 'iotfCloud123456789',saveUninitialized: true,
                 resave: true}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
var client = mqtt.createClient(1883, "localhost");




mongoose.connect('mongodb://localhost/EgyIOTPortal', function (err) {
	console.log("APP.JS Processing connected to mongoDB");

  if (err){  
	  console.log(" Error Message is "+err);
  }else{
	  
	 Sensor.find({  }, function(err, sensors) {
    if (err) {
    } else {
		if(sensors.length > 0){
			for(var i=0;i<sensors.length;i++){
				console.log("Registered to "+sensors[i]._id);
            client.subscribe(sensors[i]._id);
			}
	}

    }
  });
  
  
	  
  }
});
	
	
	
	client.on('message', function (topic, message) {
  console.log("Topic name receive  from APP $$$ "+ topic + " Message content is  "+message);
  var id = mongoose.Types.ObjectId();

  	        var sensorData = { _id: id };
			sensorData.name=topic;
	       sensorData.value=message;

		   
		           SensorDataMod.create(sensorData, function (err, newUser) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            } 
         //   return next(err);
          }
        
        })
		
		
		
		   

});



app.use('/',index);


app.use(function(req, res, next) {
    if(req.session.api_key){
		console.log("APP.JS 4");

    res.redirect("/index");
	}else{
	  console.log("APP.JS 5");

	  console.log("App login ");
	  
       //res.render('login');
       res.redirect("/login");

				//res.render("login",{ title: 'ejs' });

	}
});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(app.get('port'), app.get('host'), function() {
  console.log('Express server listening on ' + server.address().address + ':' + server.address().port);
});

module.exports = app;
