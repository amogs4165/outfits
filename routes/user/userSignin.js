var express = require('express');
const { Db } = require('mongodb');
var router = express.Router();
var helper = require('../../helper/connectionHelper');
require('dotenv').config()
const serviceSSID = process.env.serviceSSID;
const accountSID = process.env.accountSID;
const authToken = process.env.authToken;
const client = require('twilio')(accountSID, authToken)
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID
const clients = new OAuth2Client(CLIENT_ID);


router.get('/', (req, res) => {

    let userStatus = req.session.status;
    console.log('in signin', userStatus)

    if(userStatus){
        res.redirect('/')
    }
    else{
        let err = req.session.err
        res.render('user/signIn',{err})
        req.session.err = null;
    }
    

})
router.post('/verify', (req, res) => {
    loginCredential = req.body
    helper.userVerify(loginCredential).then((response) => {
        if (response.status) {
            req.session.status = true;
            res.redirect('/')
        }
        else {
            req.session.err = "invalid username or password";
            res.redirect('/signIn')
        }
    }).catch(() => {
        res.send('hey')
    })
})
router.get('/signInwithnumber', (req, res) => {
    res.render('user/signInWithNumber')
})
router.post('/getnumber', (req, res) => {
    req.session.userDetails = req.body
    console.log(req.body);
    let number = req.body;
    helper.verifyMobileNum(number).then((response)=>{
        if(response.status){
            console.log('im here');
            console.log(serviceSSID);
            console.log(accountSID);
                client.verify
            .services(serviceSSID)
            .verifications.create({
                to: `+91${req.body.phoneNumber}`,
                channel: "sms"
            }).then((resp) => {
                console.log("response",resp);
                
                res.render('user/otpVerifySignin')
            }).catch((resp) => {
                console.log("response",resp);
                res.send("something went wrongggg")
            })

        }
        else{
            res.send("mobile number not registered")
        }
    })
    
})
router.post('/otpverify',(req,res)=>{
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
                req.session.status = true;
                res.redirect('/')
            }
            else {
                let err ="wrong otp"
                res.render('user/otpVerifySignin',{err})
            }

    
    })
})
router.post('/getId',(req,res)=>{
    let token = req.body.token;

    console.log(token);
    async function verify() {
    const ticket = await clients.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    console.log(payload)
    req.session.email = payload.email;
    

}
verify().then(()=>{
    // console.log("hey")
    res.cookie('success',token)
    res.send('success')
    
}).catch(console.error);

})



module.exports = router;
