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
    let productId = req.body.product
    let crrQuantity = await helper.quantity(userId,productId)
    let currQuantity = Object.values(crrQuantity)
    let currentQuantity = currQuantity[0];

    if(currentQuantity==1 && req.body.count =='-1'){
        let qty = 1
        res.send({status : true,qty})
    }
    else{
        let newPrice = await helper.changeProductQuantity(req.body)
        let total = await helper.totalPrice(userId)
        let quantity = await helper.quantity(userId,productId)
    
        console.log(productId)
        let currQty = Object.values(quantity)
        let qty = currQty[0];
        console.log(qty);
        if(qty<=1){
            helper.changeButtonStatus(userId,productId).then(()=>{
                res.send({status : true, newPrice,total,qty})
            })
        }else{
            helper.changeButtonStatusT(userId,productId).then(()=>{
                res.send({status : true, newPrice,total,qty})
            })
           
        }
    }



   
    

    

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
            let check= false;
            helper.findAddress(userId).then((resp)=>{
                let address = resp;
                console.log("this is address",address);
                res.render('user/checkout',{products,userStatus,total,userId,address,check})
            })
        
    }
    else{
        res.redirect('/signIn')
    }
   
})

module.exports = router;