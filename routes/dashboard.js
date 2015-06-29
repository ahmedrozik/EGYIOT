
var express = require('express');
var router = express.Router();

/* GET realtime page. */
router.get('/', function(req, res) {
	
	console.log(" From DashBoard.JS  1")
	
	res.render('index',{ title: 'IOT' });


	//res.render('dashboard', { title: 'EGY IOT' });
});


module.exports = router;