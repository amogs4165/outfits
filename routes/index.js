var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("hiiiiiiiiii"+req.session.status)
  let userStatus = req.session.status
  console.log("helooooooooooo"+userStatus);
  res.render('index',{userStatus});
});

module.exports = router;
