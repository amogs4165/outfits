const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',async(req,res)=>{
    if(req.session.user){
        let userId = req.session.user._id
        let userStatus = req.session.user.status
        let products = await helper.userCart(userId)
        let totalPrice = helper.totalPrice(userId)
        
        console.log("this is total price",totalPrice)
      
        console.log(products,"hey this is carts products")
            res.render('user/cart',{products,userStatus,});
    }else{
        res.redirect('/')
    }
    
})

router.get('/cart-add/:id',(req,res)=>{
    console.log(req.params.id)
    let userId = req.session.user._id;
    let productId = req.params.id;

    helper.addToCart(userId,productId).then(()=>{
        res.redirect('/cart')
    })
})

router.post('/change-product-quantity',(req,res,next)=>{
    console.log(req.body)
    helper.changeProductQuantity(req.body).then((newPrice)=>{
        res.send({status : true, newPrice})

    })
})


module.exports = router;