var express = require('express');
var router = express.Router();
var mqtt = require('mqtt')


var mongoose = require('mongoose');
var User = mongoose.model('User');
var Sensor = mongoose.model('Sensor');
var SensorDataMod = mongoose.model('SensorData');
var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');
var shortid = require('shortid');

var nodemailer = require('nodemailer');


console.log("Auth test");


var client = mqtt.createClient(1883, "broker.mqtt-dashboard.com");


router.get('/channel', function(req, res) {
	console.log("Channel Page");
	res.render('channel', { title: ' EGY IOT' });

});

client.on('message', function (topic, message) {
  console.log("Topic name is receive from AUTH &&&  "+ topic + " Message content is  "+message);
  var minThreshold , maxThreshold ;
  
Sensor.findById(topic, function (err, sensor) {
      if (err){
	  console.log("Error to get Sensor Attributes");
      }else {
				 console.log("Object returned is "+sensor);
if(( parseInt(message) > parseInt(sensor.maxthreshold) ) || (parseInt(message)  < parseInt(sensor.minthreshold))){
console.log("send email"+parseInt(sensor.maxthreshold)  +"message "+ parseInt(message) );
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jdev.cs2011@gmail.com',
        pass: '0105570894'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Fred Foo ✔ <jdev.cs2011@gmail.com>', // sender address
    to: 'jdev.cs2011@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});



				 
}	 
}


    });
			
			 
			 
  var id = mongoose.Types.ObjectId();
  console.log(" Id Genrated is  "+id);

  	        var sensorData = { _id: id };
			sensorData.name=topic;
	       sensorData.value=message;

		   
		           SensorDataMod.create(sensorData, function (err, newUser) {
			console.log("Save sensor Data");
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            } 
         //   return next(err);
          }
		  


  
  
        
        })
		
		
		
		   

});

router.post('/channel', function(req, res) {
	var sensId=req.app.get('sensorCounter');
	req.app.set('sensorCounter',sensId+1);
	console.log("Add Sensor Post"+sensId);
	var genId=shortid.generate();
    var sensorName=req.param('name');
	sensorName=sensorName.replace(/\s+/g, '');
	var sensorId="EgyIOT/"+sensorName+"/EGY"+genId+sensId;
    client.subscribe(sensorId);
    console.log(' generated ID '+sensorId);

    	        var sensor = { _id: sensorId };
			sensor.name=cleanString(sensorName);

            sensor.email=req.session.user;
		    sensor.description=cleanString(req.param('description'));
		    sensor.longitude=cleanString(req.param('longitude'));
	       sensor.latitude=cleanString(req.param('latitude'));
		   	sensor.field=cleanString(req.param('field1'));

		     sensor.minthreshold=cleanString(req.param('minthreshold'));
		    sensor.maxthreshold=cleanString(req.param('maxthreshold'));



  
console.log(" name" +sensor.name +"  desc "+sensor.description +"  longit"+sensor.longitude+"  latitude"+sensor.latitude+"  max"+sensor.maxthreshold+"  min"+sensor.minthreshold +" Field "+sensor.field + " email "+sensor.email);
  

        Sensor.create(sensor, function (err, newUser) {
			console.log("Inside Create "+sensor.email);
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
             console.log(err.name);
			 //return invalid();
            } 
         //   return next(err);
          }
		        req.session.isLoggedIn = true;
         
          console.log('created user: %s',  req.session.user );
           return res.send(sensorId);
        })
		
	
		  
		  
		  
});





router.post('/getsensorslist', function(req, res) {
	var email=req.session.user;	

console.log('Get Registered Sesnros for This user'+email);
	Sensor.find({  
    'email': email
  }, function(err, sensors) {
    if (err) {
    } else {
      console.log(sensors);
	             return res.send(sensors);

    }
  });
  
  		  
});



// Login page
router.get('/login', function(req, res) {
	console.log("Login Get");
  res.render('login', { title: 'EGY IOT' });
});

//login page after a login failure
router.get('/loginfail', function(req, res) {
  res.render('loginfail', { title: ' EGY IOT' });
});

router.post('/login', function(req, res) {
  console.log("Login Post **** ");

      // validate input
    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
	console.log("USER :"+email + "Password :"+pass);
    if (!(email && pass)) {
      return invalid();
    }

    // user friendly
    email = email.toLowerCase();

    // query mongodb
    User.findById(email, function (err, user) {
      if (err) return next(err);

      if (!user) {
        return invalid();
      }

      // check pass
      if (user.hash != hash(pass, user.salt)) {
        return invalid();
      }

      req.session.isLoggedIn = true;
      req.session.user = email;
      res.redirect('/index');
    })

    function invalid () {
      return res.render('login', { invalid: true });
    }
	
	
  req.session.api_key = req.body.api_key;
  req.session.auth_token = req.body.auth_token;

 // res.redirect("/index");
});

// Logout the user, then redirect to the home page.
router.post('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;