var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let userStatus = req.session.status;
  
  res.render('index',{userStatus});
});

router.get('/logout',(req,res)=>{
  let user = req.session.status
  if(user){
    req.session.status = false;
    res.redirect('/')
  }
 
})
module.exports = router;
