const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper');

router.post('/',async (req,res)=>{
    console.log(req.body);
    let address = req.body.address;
    let paymentMode = req.body.paymentMode;

    if(address!=''){
        let userId = req.session.user._id;
        let shippingAddress1 = await helper.getShippingAddress (userId,address);
        const [shippingAddress] = shippingAddress1;
        let products = await helper.userCart(userId);
        let total = await helper.totalPrice(userId);
        helper.orders(userId,{...shippingAddress},products,total,paymentMode).then(()=>{

        })
    }
    else{
        let userId = req.session.user._id;
        let details = req.body
        let address = Object.fromEntries(
            Object.entries(details).slice(1, 12)
        )
       
        let products = await helper.userCart(userId);
        let total = await helper.totalPrice(userId);
        helper.orders(userId,{address},products,total,paymentMode).then(()=>{

        })
    }

})

// router.post('/newAddress',(req,res)=>{
//     console.log(req.body);
// })
module.exports = router;