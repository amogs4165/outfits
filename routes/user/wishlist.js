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

router.get('/',verifyLogin,(req,res)=>{
    let userId = req.session.user._id
    helper.getWishlist(userId).then((resp)=>{
        console.log(resp);
        if(resp == null){
            res.send('noo')
        }else{
            console.log(resp,"this is resp");
            helper.getWishlistProducts(userId).then((resp)=>{
                console.log("this reswp",resp)
                let product = resp
                // let count = product.manufacturerquantity
                // console.log(count)
                console.log("her products",product);
                
                res.render('user/wishlist',{product})
            })
           
        }
    }).catch(()=>{
        console.log("catch here")
    })
})

router.post('/',verifyLogin,(req,res)=>{
    console.log(req.params.id)
    let userId = req.session.user._id;
    let proId = req.body.proId
    helper.wishlist(userId,proId).then((resp)=>{
        console.log(resp);
        if(resp=="alreadyHave"){
            console.log("hey")
            res.send({status:false})
        }
        else{
            res.send({status:true})
        }
        
    })
    
})

router.post('/remove',verifyLogin,(req,res)=>{
    let userId = req.session.user._id
    let proId = req.body.product
    helper.removeWishlist(userId,proId).then(async()=>{
        let wishlist = await helper.WishlistCheck(userId)
        
        let check
        if(wishlist.product.length <= 1){
            check = true;
        }else{
            check = false;
        }
        
        res.send({status:true,check})
    })
})

module.exports = router;