var express = require('express')
var router = express.Router()
const serviceSSID = "VAac7318af48f716701e6864d30fff2e77"
const accountSID = "AC47a755177338b0c75eef8e299e37299b"
const authToken = "3479c51e6d29b995f3607c15fca0f021"
const client = require('twilio')(accountSID, authToken)


router.get('/', (req, res) => {
    res.render('user/register')
});

router.post('/userDetail', (req, res) => {
    // console.log(req.body)
    console.log(req.body.phoneNumber);
    req.session.userDetails = req.body;
    detailss = req.session.userDetails
    console.log(detailss);
    client.verify
        .services(serviceSSID)
        .verifications.create({
            to: `+91${req.body.phoneNumber}`,
            channel: "sms"
        }).then((resp) => {
            res.render('user/otpVerification')
        }).catch(() => {
            res.send("something went wron")
        })

})

module.exports = router;


