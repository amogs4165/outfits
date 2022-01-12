const { response } = require('express');
const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{

    email = req.session.email;
    helper.checkEmail(email).then((response)=>{
        if(response.status){
            req.session.status=true;
            console.log(response.user)
            res.redirect('/')
        }
        else{
            res.redirect('/signIn')
        }
    })
   
    
    
})

module.exports = router;