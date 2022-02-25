const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

const verifyLogin = (req,res,next) =>{
    if(req.session.status){
        next()
    }else{
        res.redirect('/signIn');
    }
}


router.get('/',verifyLogin,async(req,res)=>{
    if(req.session.user){
        let userId = req.session.user._id
        let userStatus = req.session.user.status
        let products = await helper.userCart(userId)
        let cartProducts = await helper.userCart(userId)
        
        console.log(cartProducts)
        if(cartProducts==null){
          var total = null;
        }else{
          var total = await helper.totalPrice(userId)
        }
        
        
        console.log("this is total price",total)
      
        console.log(products,"hey this is carts products")
            res.render('user/cart',{products,cartProducts,userStatus,total,userId});
    }else{
        res.redirect('/')
    }
    
})

router.get('/cart-add/:id',verifyLogin,(req,res)=>{
    console.log(req.params.id)
    let userId = req.session.user._id;
    let productId = req.params.id;

    helper.addToCart(userId,productId).then(()=>{
        res.redirect('/cart')
    })
})

router.post('/change-product-quantity',verifyLogin,async(req,res,next)=>{
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

router.post('/remove',verifyLogin,async(req,res)=>{
    
    let userId = req.session.user._id
    let cartId = req.body.cart
    let productId = req.body.product
    helper.removeFromCart(cartId,productId).then(async()=>{
        console.log("herre ");
        let checkCart = await helper.checkCart(userId)
        console.log(checkCart.products.length,"here")
        if(checkCart.products.length != 0){
            let cartProducts = await helper.userCart(userId)
            
            // let p = {...cartProducts}
            // console.log("heey it is sahe", p)
            if(cartProducts==null){
              var total = null;
            
            }else{
              var total = await helper.totalPrice(userId)
              
            }
        }else{
            helper.removeCart(userId)
            var quantityCheck = true
            var total = null;
        }
      
      
        res.json({status:true,total,quantityCheck})
    })
  
})

router.get('/checkout',verifyLogin,async(req,res)=>{
   
    let userStatus = req.session.user.status
   
       
    let userId = req.session.user._id
    let products = await helper.userCart(userId)
   
    let total = await helper.totalPrice(userId)
    let check= false;
    helper.findAddress(userId).then((resp)=>{
        let address = resp;
        console.log("this is address",address);
        res.render('user/checkout',{products,userStatus,total,userId,address,check})
    })
        
    
   
})

module.exports = router;