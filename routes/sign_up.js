
var express = require('express');
var router = express.Router();


/* GET realtime page. */
router.get('/', function(req, res) {
	
	console.log("get Sign Up")
	
	res.render('sign_up',{ title: 'IOT' });


	//res.render('dashboard', { title: 'EGY IOT' });
});

router.post('/signup', function(req, res) {
  console.log("****** Sign Up PosTT ***///////////****** ");

  req.session.api_key = req.body.api_key;
  req.session.auth_token = req.body.auth_token;

  res.redirect("/login");
});




module.exports = router;