const express = require('express');
const res = require('express/lib/response');
const { registerHelper } = require('hbs');
const router = express.Router();
const helper = require('../../helper/connectionHelper')
const serviceSSID = "VAac7318af48f716701e6864d30fff2e77"
const accountSID = "AC47a755177338b0c75eef8e299e37299b"
const authToken = "3479c51e6d29b995f3607c15fca0f021"
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
                    if (userStatus) {
                        res.redirect('/')
                    }
                    else {
                        res.redirect('/register')
                    }
                })
            }
            else {
                res.redirect('/register')
            }

        }).catch(() => {
            res.send("something went wrong")
            res.redirect('/register')
        })


})

module.exports = router;