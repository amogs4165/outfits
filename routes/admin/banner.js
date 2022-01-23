const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{

    res.render('admin/banner')
})

router.post('/add-banner',(req,res)=>{
    let bannerInfo = req.body;
    let image1 = req.files.image1;
    helper.addBanner(bannerInfo).then((resp)=>{
        console.log(resp.insertedId)
        let id = resp.insertedId
        image1.mv('./public/banner-images/'+id+'image1.jpg',(err,done)=>{
            if(!err){
                res.send('sucess')
            }
        })
    })
})

router.get('/select-banner',(req,res)=>{
    helper.viewBanner().then((resp)=>{
        let admin = true;
        let banner = resp;
        console.log(banner)
        res.render('admin/bannerList',{admin,banner})
    })
})
module.exports = router;