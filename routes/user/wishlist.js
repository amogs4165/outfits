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

router.get('/:id',verifyLogin,(req,res)=>{
    console.log(req.params.id)
    let userId = req.session.user._id;
    let proId = req.params.id
    helper.wishlist(userId,proId).then(()=>{
        res.render('user/wishlist');
    })
    
})

module.exports = router;