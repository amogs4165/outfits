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
    let admin = req.session.admin
    helper.getOrders().then((resp)=>{
        let orders = resp;
        res.render('admin/orderManagement',{admin,orders})

    })
    
})

router.post('/',verifyLogin,(req,res)=>{

    let id = req.body.id;
    let status = req.body.status
    helper.updateOrderStatus(id,status).then(()=>{

    })
})
module.exports = router;


