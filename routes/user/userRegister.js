var express = require('express');
var router = express.Router();
require('dotenv').config();
const serviceSSID = process.env.serviceSSID;
const accountSID = process.env.accountSID;//username
const authToken = process.env.authToken;//password
const client = require('twilio')(accountSID, authToken);


router.get('/', (req, res) => {

    let userStatus = req.session.status;

    if(userStatus){
        res.redirect('/')
    }
    else{
        res.render('user/register')
    }
    
});

router.post('/userDetail', (req, res) => {
    // console.log(req.body)
    console.log(req.body.phoneNumber);
    req.session.userDetails = req.body;
    details = req.session.userDetails
    console.log(details);
    client.verify
        .services(serviceSSID)
        .verifications.create({
            to: `+91${req.body.phoneNumber}`,
            channel: "sms"
        }).then((resp) => {
            console.log("response",resp);
            res.render('user/otpVerification')
        }).catch((resp) => {
            console.log("response",resp);
            res.send("something went wrongggg")
        })

})

module.exports = router;


