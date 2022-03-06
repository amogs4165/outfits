const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper');
const fs = require('fs');

const verifyLogin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }
    else{
        res.redirect('/admin/login')
    }
}

router.get('/',verifyLogin,(req,res)=>{

    res.render('admin/banner',{admin:true})
})

router.get('/banner-1',verifyLogin,(req,res)=>{
    res.render('admin/banner-1',{admin:true})
})

router.post('/add-banner',verifyLogin,(req,res)=>{
    let bannerInfo = req.body;
    let image1 = req.files.image1;
    helper.addBanner(bannerInfo).then((resp)=>{
       
        let id = resp.insertedId
        image1.mv('./public/banner-images/'+id+'image1.jpg',(err,done)=>{
            if(!err){
                res.redirect('/banner/select-banner')
            }
        })
    })
})

router.post('/add-banner-1',verifyLogin,(req,res)=>{
    let bannerInfo = req.body;
    let image1 = req.files.image1;
    helper.addBannerOne(bannerInfo).then((resp)=>{

        let id = resp.insertedId
        image1.mv('./public/banner-images1/'+id+'image1.jpg',(err,done)=>{
            if(!err){
                res.redirect('/banner/select-banner-1')
            }
        })
    })
})

router.get('/select-banner',verifyLogin,(req,res)=>{
    helper.viewBanner().then((resp)=>{
        let admin = true;
        let banner = resp;
       
        res.render('admin/bannerList',{admin,banner})
    })
})

router.get('/select-banner-1',verifyLogin,(req,res)=>{
    helper.viewBannerOne().then((resp)=>{
        let admin = true;
        let banner = resp;
       
        res.render('admin/bannerList-1',{admin,banner})
    })
})

router.post('/selectBanner-1',verifyLogin,async (req,res)=>{
    
    let id=req.body.id
    helper.selectBannerOne(id).then(async(resp)=>{
        let response = await resp
        res.json({status:true})
    })

})

router.post('/selectBanner',verifyLogin,async (req,res)=>{
 
    let id=req.body.id
    helper.selectBanner(id).then(async(resp)=>{
        let response = await resp
        res.json({status:true})
    })

})
router.post('/removebannerOne',verifyLogin,(req,res)=>{
    let id = req.body.id
    helper.removeBannerOne(id).then(()=>{
        var path = './public/banner-images1/'+id+'image1.jpg'
            fs.unlinkSync(path);
            res.json({status:true});
    })
})
router.post('/removebanner',verifyLogin,(req,res)=>{
    let id = req.body.id
    helper.removeBanner(id).then(()=>{
        var path = './public/banner-images/'+id+'image1.jpg'
        fs.unlinkSync(path);
        res.json({status:true});
    })
})
module.exports = router;