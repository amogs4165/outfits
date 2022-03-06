var express = require('express');
var router = express.Router();
require('dotenv').config();
const serviceSSID = process.env.serviceSSID;
const accountSID = process.env.accountSID;//username
const authToken = process.env.authToken;//password
const client = require('twilio')(accountSID, authToken);
const helper = require('../../helper/connectionHelper')
const { ObjectId, Db } = require('mongodb');


router.get('/', (req, res) => {

    let userStatus = req.session.status;

    if(userStatus){
        res.redirect('/')
    }
    else{
        let err = req.session.errorss
        res.render('user/register',{err})
       
    }
    
});

router.get('/:id', (req, res) => {
    let id = req.params.id
 
    let userStatus = req.session.status;
    

    if(userStatus){
        res.redirect('/')
    }
    else{
        if(ObjectId.isValid(id)){

            helper.getUser(id).then((resp)=>{
               
                if(resp){
                   
                    req.session.referal = id;
                    res.render('user/register')
                }else{
                    
                    res.render('user/register')
                }
            })
        }else{
            res.render('user/register')
        }
    }
    
});

router.post('/userDetail', (req, res) => {

    req.session.userDetails = req.body;
    details = req.session.userDetails;
    req.session.mobNum = req.body.phoneNumber
    res.redirect('/verify/userOtp');

})


module.exports = router;


