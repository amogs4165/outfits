const { response } = require('express');
const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{

    email = req.session.email;
    helper.checkEmail(email).then((response)=>{
        if(response.status){
          
            req.session.status=true;
            req.session.user = response.user
        
            res.redirect('/')
        }
        else{
            req.session.err = "No account registered with this email"
            res.redirect('/signIn')
        }
    })
   
    
    
})

module.exports = router;