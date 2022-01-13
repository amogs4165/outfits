const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{
    let admin = true;
    res.render('admin/lbar',{admin})
})

router.get('/orders',(req,res)=>{
    let admin = true;
    
    res.render('admin/orders',{admin})
})

module.exports = router;

