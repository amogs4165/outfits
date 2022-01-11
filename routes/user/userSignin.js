var express = require('express');
var router = express.Router();
var helper = require('../../helper/connectionHelper')
const serviceSSID = "VAac7318af48f716701e6864d30fff2e77"
const accountSID = "AC47a755177338b0c75eef8e299e37299b"
const authToken = "3479c51e6d29b995f3607c15fca0f021"
const client = require('twilio')(accountSID, authToken)

router.get('/', (req, res) => {

    res.render('user/signIn')

})
router.post('/verify', (req, res) => {
    loginCredential = req.body
    helper.userVerify(loginCredential).then((response) => {
        if (response.status) {
            res.send('hey you are signed in ')
        }
        else {
            res.send('fuckoff buddy')
        }
    }).catch(() => {
        res.send('fuckoff buddy')
    })
})
router.get('/signInwithnumber', (req, res) => {
    res.render('user/signInWithNumber')
})
router.post('/getnumber', (req, res) => {
    req.session.userDetails = req.body
    console.log(req.body.phoneNumber);
    client.verify
        .services(serviceSSID)
        .verifications.create({
            to: `+91${req.body.phoneNumber}`,
            channel: "sms"
        }).then((resp) => {
            res.render('user/otpVerification')
        }).catch(() => {
            res.send("something went wrong")
        })

})
router.get('/otpverification',(req,res)=>{
    const { otp } = req.body;

    var userData = req.session.userDetails
    console.log("heyeyeyey" + userData);
    var number = userData.phoneNumber
    console.log("helloomynumber" + number)
    helper.verifyMobileNum(number).then((response)=>{
        if(response.staus){
            client.verify.services(serviceSSID)
            .verificationChecks.create({
                to: `+91${number}`,
                code: otp
            }).then((resp) => {
                console.log("otp res", resp);
    
                if (resp.valid) {
                    res.redirect('/')
                }
                else {
                    res.send("invalid otp")
                }
    
            }).catch(() => {
                res.send("something went wrong")
                res.redirect('/register')
            })
        }
        else{
            res.send("number not registered")
        }
    })

})


module.exports = router;
