var express = require('express');
var router = express.Router();
var helper = require('../helper/connectionHelper')

/* GET home page. */
router.get('/', function(req, res, next) {

  let userStatus = req.session.status;

  helper.getProducts().then((resp)=>{
    let products = resp.slice(0,8)
    
    res.render('index',{userStatus,products});
  })
  
  
});

router.get('/logout',(req,res)=>{
  let user = req.session.status
  if(user){
    req.session.status = false;
    res.redirect('/')
  }
 
})

router.get('/productShow/:id',(req,res)=>{
  let id = req.params.id;
  let userStatus = req.session.status
  helper.getSpecificProduct(id).then((resp)=>{
    let product = resp;  
    res.render('productView',{userStatus,product})
  })
  
})
module.exports = router;
