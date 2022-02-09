
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
    let admin = true;
    helper.getCategoryDetails().then((resp)=>{
        let cattDetails = resp.cattDetails;
        helper.getSCategoryDetails().then((response)=>{
            let scattDetails = response.cattDetails;
            console.log(scattDetails);
            res.render('admin/addProduct',{admin,scattDetails,cattDetails})
        })
            
    })
    
})

router.post('/add',verifyLogin,(req,res)=>{
    console.log(req.body);
    console.log(req.files.image);
    helper.addProduct(req.body,(id)=>{
        let image1 = req.files.image1
        let image2 = req.files.image2
        let image3 = req.files.image3
        let image4 = req.files.image4
        console.log(id);
        image1.mv('./public/product-images/'+id+'image1.jpg',(err,done)=>{
            if(!err){
                image2.mv('./public/product-images/'+id+'image2.jpg',(err,done)=>{
                    if(!err){
                        image3.mv('./public/product-images/'+id+'image3.jpg',(err,done)=>{
                            if(!err){
                                image4.mv('./public/product-images/'+id+'image4.jpg',(err,done)=>{
                                    if(!err){
                                        res.redirect('/addProduct')
                                    }
                                })
                            }
                        })
                        
                    }
                })
              
            }
        })

    })
    
})



module.exports = router;
