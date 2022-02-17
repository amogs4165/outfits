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

router.get('/',verifyLogin,async (req,res)=>{
    let admin = true;

    let CategotyOffer = await helper.getCategoryOffer()
    helper.getCategoryDetails().then((resp)=>{
        console.log(resp);
        let category = resp.cattDetails
        res.render('admin/categoryOffer',{admin, category,CategotyOffer})
    })
})

router.post('/add-categoryOffer',verifyLogin, (req,res)=>{
    let admin = true;
    
    console.log(req.body)
    let offer = req.body
    helper.insertCategoryOffer(offer.offercategory,offer.discount,offer.validity).then(()=>{

        helper.addCategoryOffer(offer).then(()=>{
            res.redirect('/offerManagement')
        })
    })
})

router.get('/addProductOffer/:id',verifyLogin,(req,res)=>{
    let userId = req.params.id;
    let productOffer = helper.getProductOffer()
    res.render('admin/addProductOffer',{userId,productOffer});

})

router.post('/add-productOffer',verifyLogin,(req,res)=>{
    
    console.log("request body",req.body)
    let offer = req.body
    helper.insertProductOffer(offer.proId,offer.discount,offer.validity).then((resp)=>{
        helper.addProductOffer(offer).then(()=>{
            res.redirect('/offerManagement/getProductoffer')
        })
    })
})

router.get('/getProductoffer',verifyLogin,(req,res)=>{
    helper.getProductOffer().then((resp)=>{
        let productOffer = resp;
        res.render('admin/showProductOffer',{productOffer,admin:true})
    })
})

router.post('/delete-categoryOffer',verifyLogin,(req,res)=>{
    console.log(req.body)
    let name = req.body.name;
    let id = req.body.id
    console.log("hey her its catt delte")
    helper.deleteCategoryOffer(name,id).then(()=>{
        res.send({status:true})
    })
})

router.post('/delete-productOffer',verifyLogin,(req,res)=>{
    console.log("hey her its produt delte",req.body)
    let id = req.body.id;
    let proId = req.body.proId;
    helper.deleteProductOffer(id,proId).then(()=>{
        console.log
    })
})

router.get('/add-coupon',verifyLogin,async (req,res)=>{
    let coupon = await helper.getCoupon()
    res.render('admin/addCoupon',{admin:true,coupon})
})

router.post('/add-couponOffer',verifyLogin,(req,res)=>{
    console.log(req.body)
    let details = req.body
    helper.insertCouponOffer(details).then(()=>{
        res.redirect('/offerManagement/add-coupon')
    })
})

router.post('/delete-couponOffer',verifyLogin,(req,res)=>{
    console.log("hey her its produt delte",req.body)
    let id = req.body.id;
    let proId = req.body.proId;
    helper.deletecouponOffer(id).then(()=>{
        res.send({status:true})
    })
})

router.post('/couponCheck',(req,res)=>{
    console.log(req.body);
    let coupon = req.body.couponCode;
    let userId = req.session.user._id
    console.log(coupon);
    console.log(userId);
    helper.checkCoupon(userId,coupon).then((resp)=>{
        let subTotal = req.body.total
        if(subTotal-100>resp.coupon.discount){

            if(resp.status){
    
                let statuss = resp.status
                let msg = resp.msg
                let couponDetail = resp.coupon
                
                let totalAmount = req.body.total- resp.coupon.discount
                res.json({statuss,msg,coupon,couponDetail,totalAmount,subTotal})
            }else{
                let subTotal = req.body.total
                let msg = resp.msg
                let statuss = resp.status
                res.json({statuss,msg,subTotal})
            }
        }else{
            if(resp.status){
                let subTotal = req.body.total
                let msg = "Should have Min.Rs.100 difference"
                let statuss = false;
                res.json({statuss,msg,subTotal})
            }else{
                let subTotal = req.body.total
                let msg = resp.msg
                let statuss = resp.status
                res.json({statuss,msg,subTotal})
            }
        }
    })

    
})

module.exports = router;