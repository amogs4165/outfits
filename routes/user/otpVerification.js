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
                    if (userStatus) {
                        req.session.status = true;
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