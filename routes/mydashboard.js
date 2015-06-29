
var express = require('express');
var router = express.Router();
var querystring = require("querystring");



   
   

/* GET realtime page. */
router.get('/', function(req, res) {
	
	var qs = querystring.parse(req.url.split("?")[1]),
   sensorId = qs.sensorId ;
   
   console.log("Channel ID "+sensorId);
	
	console.log(" ///// From MY   DashBoard.JS ")
	
	res.render('dashboard',{ title: 'IOT' , channelName:sensorId});


	//res.render('dashboard', { title: 'EGY IOT' });
});


module.exports = router;