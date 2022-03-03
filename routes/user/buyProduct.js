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
 
    let userId = req.session.user._id;
    let userStatus = true;
    let check= true;
    let details = req.body
    details.total = req.body.quantity*req.body.productprice;
    let total = details.total;
    let products = [details];
    
    helper.findAddress(userId).then((resp)=>{
        let address = resp;
     
        res.render('user/checkout',{products,userStatus,userId,address,check,total})
    })
    
})

router.post('/remove',verifyLogin,(req,res)=>{
    let orderId = req.body.orderId
    helper.deleteOrder(orderId).then((resp)=>{
        if(resp.status){
            res.json({status:true})
        }else{
            res.json({status:false})
        }
    })
})
module.exports = router;