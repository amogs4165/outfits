const { response } = require('express');
const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{

    email = req.session.email;
    helper.checkEmail(email).then((response)=>{
        if(response.status){
            console.log((response.status));
            console.log(("sucessssssssssssssssssss"));
            req.session.status=true;
            req.session.user = response.user
            console.log(response.user)
            res.redirect('/')
        }
        else{
            console.log("failureeeeeeeeeeeeeeeeeeeee");
            res.redirect('/signIn')
        }
    })
   
    
    
})

module.exports = router;