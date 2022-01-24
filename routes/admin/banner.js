const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{

    res.render('admin/banner')
})

router.get('/banner-1',(req,res)=>{
    res.render('admin/banner-1')
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

router.post('/add-banner-1',(req,res)=>{
    let bannerInfo = req.body;
    let image1 = req.files.image1;
    helper.addBannerOne(bannerInfo).then((resp)=>{
        console.log(resp.insertedId)
        let id = resp.insertedId
        image1.mv('./public/banner-images1/'+id+'image1.jpg',(err,done)=>{
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

router.get('/select-banner-1',(req,res)=>{
    helper.viewBannerOne().then((resp)=>{
        let admin = true;
        let banner = resp;
        console.log(banner)
        res.render('admin/bannerList-1',{admin,banner})
    })
})

router.post('/selectBanner',async (req,res)=>{
 
    id=req.body.id
    console.log(id);
   
    let banner = await helper.selectBanner(id)
    console.log(banner);
    // helper.selectBanner(info)
    // res.send('success')

})

router.post('/selectBanner-1',async (req,res)=>{
 
    id=req.body.id
    console.log(id);
   
    let banner = await helper.selectBannerOne(id)
    console.log(banner);
    // helper.selectBanner(info)
    // res.send('success')

})
module.exports = router;