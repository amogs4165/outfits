const express = require('express');
const res = require('express/lib/response');
const { registerHelper } = require('hbs');
const router = express.Router();
require('dotenv').config()
const helper = require('../../helper/connectionHelper')
const serviceSSID = process.env.serviceSSID
const accountSID = process.env.accountSID
const authToken = process.env.authToken
const client = require('twilio')(accountSID, authToken)


router.post('/', (req, res) => {
    console.log("hee");
    console.log(req.body);
    const { otp } = req.body;

    var userData = req.session.userDetails
    console.log("heyeyeyey" + userData);
    var number = userData.phoneNumber
    console.log("helloomynumber" + number)
    client.verify.services(serviceSSID)
        .verificationChecks.create({
            to: `+91${number}`,
            code: otp
        }).then((resp) => {
            console.log("otp res", resp);

            if (resp.valid) {

                helper.userRegistration(userData).then((userStatus) => {
                    if (userStatus.status) {
                        console.log("heeeee---------------------------------",userStatus.resp)
                        req.session.status = true;
                        let id = userStatus.resp.insertedId
                        helper.getUser(id).then((resp)=>{
                        if(req.session.referal){
                            helper.incrementAmount(req.session.referal,500)
                            helper.incrementAmount(id,100)
                            req.session.user = resp
                            res.redirect('/')
                        }else{

                            req.session.user = resp
                            res.redirect('/')
                        }
                        })
                    }
                 
                    else {
                        req.session.errorss = "this number is already registered with another account please register with another number"
                        res.redirect('/register')
                    }
                })
            }
            else {
                let err = "Wrong Otp"
                res.render('user/otpVerifySignin',{err})
            }

        }).catch(() => {
            res.send("what is this")
            
        })


})

module.exports = router;