var express = require('express');
var router = express.Router();
var helper = require('../helper/connectionHelper')

/* GET home page. */
router.get('/', function(req, res, next) {

  let userStatus = req.session.status;

  helper.getProducts().then((resp)=>{
    let products = resp.slice(0,3)
    console.log("hey",products)
    res.render('index',{userStatus});
  })
  
  
});

router.get('/logout',(req,res)=>{
  let user = req.session.status
  if(user){
    req.session.status = false;
    res.redirect('/')
  }
 
})
module.exports = router;
