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

module.exports = router;