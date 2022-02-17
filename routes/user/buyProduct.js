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
    let details = req.body
    details.total = req.body.quantity*req.body.productprice;
    let total = details.total;
    let products = [details];
    console.log(products);
    helper.findAddress(userId).then((resp)=>{
        let address = resp;
        console.log("this is address",address);
        res.render('user/checkout',{products,userStatus,userId,address,check,total})
    })
    
})

module.exports = router;