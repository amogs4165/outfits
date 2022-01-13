let express = require('express');
let router = express.Router();

router.get('/',(req,res)=>{
    let userStatus = req.session.status
    if(userStatus){
        res.render('user/userProfile',{userStatus})
    }
    else{
        res.redirect('/signIn')
    }
})

// router.get('/'),(req,res)=>{
//     res.render('user/userProfile')
// }

// router.get('/'),(req,res)=>{
//     res.render('user/userProfile')
// }

// router.get('/'),(req,res)=>{
//     res.render('user/userProfile')
// }

module.exports = router;