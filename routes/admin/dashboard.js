const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

const verifyLogin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }
    else{
        res.redirect('/admin/login')
    }
}

router.get('/',verifyLogin,async (req,res)=>{
    let admin = true;
    let cod = await helper.getpaymentmode("COD");
    let razorpay = await helper.getpaymentmode("razorpay");
    let paypal = await helper.getpaymentmode("paypal");
    let codPayment = cod.length;
    let razorpayPayment = razorpay.length;
    let paypalPayment = paypal.length;
    let menOrders = await helper.getCattOrders()
    console.log(cod.length)
    console.log("---------------------------------------------------------")
    console.log(razorpay.length)
    console.log("---------------------------------------------------------")

    console.log(paypal.length)
    console.log("---------------------------------------------------------")

    res.render('admin/lbar',{admin,codPayment,razorpayPayment,paypalPayment})

})

router.get('/orders',verifyLogin,(req,res)=>{
    
    let admin = req.session.admin
  
        res.render('admin/orders',{admin})
   
    
})
router.get('/login',(req,res)=>{
    let err = req.session.err
    res.render('admin/signin',{err})
    req.session.err = null;
})
router.post('/adminverify',(req,res)=>{
    let loginCredential = req.body;
    helper.verifyAdmin(loginCredential).then((response)=>{
        if(response.status){
            req.session.admin = true;
            res.redirect('/admin');
        }
        else{
            req.session.err = "Invalid admin name or password";
            res.redirect('/admin/login')
        }
        
    })
})
router.get('/logout',(req,res)=>{
    req.session.admin = false;
    res.redirect('/admin/login')
})

module.exports = router;

