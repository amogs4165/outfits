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
    let admin = true;

    helper.getuserDetails().then((response)=>{

        console.log(response.userDetails)
        var userDetails = response.userDetails;

        res.render('admin/userManagement',{userDetails,admin})
    })
    
})

router.get('/delete/:id',verifyLogin,function(req,res,next){
    console.log(req.params.id)
    var id=req.params.id;
    helper.userDelete(id).then((response)=>{
        if(response){
            res.redirect('/userManagement')
        }
        else{
            res.redirect('/userManagement')
        }
    })
})

router.post('/block',verifyLogin,function(req,res,next){
    var id = req.body.id;
    helper.userBlock(id).then((response)=>{
        if(response){
            req.session.userConfirm=false
            req.session.userStatus=false
            res.redirect('/userManagement')
        }
        else{
            res.redirect('/userManagement')
        }
    })
})

router.post('/unblock',verifyLogin,function(req,res,next){
    var id = req.body.id;
    helper.userUnblock(id).then((response)=>{
        if(response){
            req.session.userConfirm=true
            res.redirect('/userManagement')
        }
        else{
            res.redirect('/userManagement')
        }
    })
})


module.exports = router;