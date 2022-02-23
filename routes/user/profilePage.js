let express = require('express');
let router = express.Router();
let helper = require('../../helper/connectionHelper')

const verifyLogin = (req,res,next) =>{
    if(req.session.status){
        next()
    }else{
        res.redirect('/signIn');
    }
}

router.get('/',verifyLogin,async(req,res)=>{
    let userStatus = req.session.status
   
        
        console.log("user here",req.session.user)
        let userId = req.session.user._id
        let user = await helper.getUser(userId)
        let orders = await helper.ordersById(userId)
        helper.findAddress(userId).then((resp)=>{
            let address = resp;
            
            console.log("this is address got here",address);
            // address.addAddress1.status = true;
            res.render('user/userProfile',{userStatus,user,address,orders})
        }).catch(()=>{
            res.render('user/userProfile',{userStatus,user})
        })
       
   
})

router.post('/add-address',verifyLogin,(req,res)=>{
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
            res.redirect('/profile')
        }).catch(()=>{
            res.redirect('/profile');
        })
    })
})

router.post('/update-address',verifyLogin,(req,res)=>{
    let addressId = req.body.addressId;
    let address = req.body;
    let userId = req.session.user._id;
    helper.updateAddress(userId,addressId,address).then((resp)=>{
        console.log(resp)
        res.redirect('/profile')
    })
    console.log(addressId);
    console.log(req.body);
})

router.post('/editProfile',verifyLogin,(req,res)=>{
    console.log(req.body);
    let id = req.session.user._id
    let profileImg = req.files.image1
    let details = req.body
    console.log(id);
    profileImg.mv('./public/profile-image/'+id+'image1.jpg')
    helper.editUserDetail(id,details).then(()=>{
        res.redirect('/profile')
    })
    
})

// router.get('/'),(req,res)=>{
//     res.render('user/userProfile')
// }

// router.get('/'),(req,res)=>{
//     res.render('user/userProfile')
// }

module.exports = router;