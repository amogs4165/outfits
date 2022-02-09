const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')
const Razorpay = require('razorpay')

const verifyLogin = (req,res,next) =>{
    if(req.session.status){
        next()
    }else{
        res.redirect('/signIn');
    }
}

router.post('/',verifyLogin,(req,res)=>{
 
    console.log("hey is hter",req.body)
    let userId = req.session.user._id;
    let userStatus = true;
    let check= true;
    let products = [req.body];
    helper.findAddress(userId).then((resp)=>{
        let address = resp;
        console.log("this is address",address);
        res.render('user/checkout',{products,userStatus,userId,address,check})
    })
    
})

module.exports = router;