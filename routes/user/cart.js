const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',async(req,res)=>{
    if(req.session.user){
        let userId = req.session.user._id
        let userStatus = req.session.user.status
        let products = await helper.userCart(userId)
        let total = await helper.totalPrice(userId)
        
        console.log("this is total price",total)
      
        console.log(products,"hey this is carts products")
            res.render('user/cart',{products,userStatus,total,userId});
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

router.post('/change-product-quantity',async(req,res,next)=>{
    console.log(req.body)
    let userId = req.session.user._id
    let newPrice = await helper.changeProductQuantity(req.body)
    let total = await helper.totalPrice(userId)
    
    console.log(total);

    res.send({status : true, newPrice,total})

//     helper.changeProductQuantity(req.body).then((newPrice)=>{
//         res.send({status : true, newPrice,total})
 
//     }) 
})

router.post('/remove',async(req,res)=>{
    
    let userId = req.session.user._id
    let cartId = req.body.cart
    let productId = req.body.product
    helper.removeFromCart(cartId,productId)
    let total = await helper.totalPrice(userId)
    res.send({status:true,total})
})

router.get('/checkout',async(req,res)=>{
   
        let userStatus = req.session.user.status
       
        if(userStatus){
            let userId = req.session.user._id
            let products = await helper.userCart(userId)
            let total = await helper.totalPrice(userId)
            helper.findAddress(userId).then((resp)=>{
                let address = resp;
                res.render('user/checkout',{products,userStatus,total,userId,address})
        })
        
    }
    else{
        res.redirect('/signIn')
    }
   
})

module.exports = router;