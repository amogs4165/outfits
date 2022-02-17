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

router.get('/',verifyLogin,(req,res)=>{
    console.log("hey")
})

router.get('/stock',verifyLogin,(req,res)=>{
    res.render('admin/stockReport',{admin:true})
})

module.exports = router;