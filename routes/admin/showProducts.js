const express = require("express");
const router = express.Router();
const helper = require('../../helper/connectionHelper');

router.get('/',(req,res)=>{
    
    console.log("heyyyyyy");
    let admin = true;
    helper.getProducts().then((products)=>{
        console.log("heyeheeuheuh",products);
        res.render('admin/showProducts',{products,admin});
    })
    
})

module.exports = router;