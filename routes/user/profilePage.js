let express = require('express');
let router = express.Router();
let helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{
    let userStatus = req.session.status
    
    if(userStatus){
        let user = req.session.user
        let userId = req.session.user._id
        helper.findAddress(userId).then((resp)=>{
            let address = resp;
            console.log("this is address got here",address);
            // address.addAddress1.status = true;
            res.render('user/userProfile',{userStatus,user,address})
        }).catch(()=>{
            res.render('user/userProfile',{userStatus,user})
        })
       
    }
    else{
        res.redirect('/signIn')
    }
})

router.post('/add-address',(req,res)=>{
    let user = req.session.user
    let userId = req.session.user._id;
    let address = req.body
    let userStatus = req.session.status
    console.log(req.body)
    helper.addAddress(userId,address).then(()=>{
        helper.findAddress(userId).then((resp)=>{
            let address = resp;
            console.log("this is address got here",address);
            address.addAddress1.status = true;
            res.render('user/userProfile',{userStatus,user,address})
        }).catch(()=>{
            res.render('user/userProfile',{userStatus,user})
        })
    })
})

router.post('/add-address2',(req,res)=>{
    let userId = req.session.user._id;
    let address = req.body;
    helper.addAddress2(userId,address).then((resp)=>{
        let user = req.session.user
        helper.findAddress(userId).then((resp)=>{
            let address = resp;
            console.log("this is address got here",address);
            res.render('user/userProfile',{userStatus,user,address})
        }).catch(()=>{
            res.render('user/userProfile',{userStatus,user})
        })
    })
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