const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

const verifyLogin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }
    else{
        res.redirect('/admin/login')
    }
}

router.get('/',verifyLogin,(req,res)=>{

    res.render('admin/banner')
})

router.get('/banner-1',verifyLogin,(req,res)=>{
    res.render('admin/banner-1')
})

router.post('/add-banner',verifyLogin,(req,res)=>{
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

router.post('/add-banner-1',verifyLogin,(req,res)=>{
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

router.get('/select-banner',verifyLogin,(req,res)=>{
    helper.viewBanner().then((resp)=>{
        let admin = true;
        let banner = resp;
        console.log(banner)
        res.render('admin/bannerList',{admin,banner})
    })
})

router.get('/select-banner-1',verifyLogin,(req,res)=>{
    helper.viewBannerOne().then((resp)=>{
        let admin = true;
        let banner = resp;
        console.log(banner)
        res.render('admin/bannerList-1',{admin,banner})
    })
})

router.post('/selectBanner',verifyLogin,async (req,res)=>{
 
    id=req.body.id
    console.log(id);
   
    let banner = await helper.selectBanner(id)
    console.log(banner);
    // helper.selectBanner(info)
    // res.send('success')

})

router.post('/selectBanner-1',verifyLogin,async (req,res)=>{
 
    id=req.body.id
    console.log(id);
   
    let banner = await helper.selectBannerOne(id)
    console.log(banner);
    // helper.selectBanner(info)
    // res.send('success')

})
module.exports = router;