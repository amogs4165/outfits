var express = require('express');
const { Db } = require('mongodb');
var router = express.Router();
var helper = require('../../helper/connectionHelper')

const client = require('twilio')(accountSID, authToken)
const {OAuth2Client} = require('google-auth-library');

const clients = new OAuth2Client(CLIENT_ID);


router.get('/', (req, res) => {

    res.render('user/signIn')

})
router.post('/verify', (req, res) => {
    loginCredential = req.body
    helper.userVerify(loginCredential).then((response) => {
        if (response.status) {
            req.session.status = true;
            res.redirect('/')
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
    console.log(req.body);
    let number = req.body;
    helper.verifyMobileNum(number).then((response)=>{
        if(response.status){
                client.verify
            .services(serviceSID)
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
router.post('/verify',(req,res)=>{
    const { otp } = req.body;

    var userData = req.session.userDetails
    console.log("heyeyeyey" + userData);
    var number = userData.phoneNumber
    console.log("helloomynumber" + number)

    client.verify.services(serviceSID)
        .verificationChecks.create({
            to: `+91${number}`,
            code: otp
        }).then((resp) => {
            console.log("otp res", resp);

            if (resp.valid) {
                req.session.user.status = true;
                res.redirect('/')
            }
            else {
                res.send("invalid otp")
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
    req.session.status = true;

}
verify().then(()=>{
    // console.log("hey")
    res.cookie('success',token)
    res.send('success')
    
}).catch(console.error);

})



module.exports = router;
