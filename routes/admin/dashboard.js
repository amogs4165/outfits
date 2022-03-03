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
    let orders = await helper.getCattOrders();
    let cattStock = await helper.getCattStock();
   

        res.render('admin/lbar',{admin,codPayment,razorpayPayment,paypalPayment,orders: JSON.stringify(orders),cattStock: JSON.stringify(cattStock)})

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

