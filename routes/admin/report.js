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

router.get('/',verifyLogin, async(req,res)=>{
    let sales = await helper.salesReport()
    console.log(sales);
    res.render('admin/salesReport',{admin:true,sales})
})

router.get('/stock',verifyLogin,async (req,res)=>{
    let stock = await helper.stockReport()
    console.log(stock)
  
    res.render('admin/stockReport',{admin:true,stock})
})



module.exports = router;