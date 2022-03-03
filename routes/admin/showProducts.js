const express = require("express");
const router = express.Router();
const helper = require('../../helper/connectionHelper');
const fs = require('fs')

const verifyLogin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }
    else{
        res.redirect('/admin/login')
    }
}

router.get('/',verifyLogin,(req,res)=>{
    
    let admin = req.session.admin;
    helper.getProducts().then((products)=>{
      
        res.render('admin/showProducts',{products,admin});
    })
    
})

router.get('/edit/:id',verifyLogin,async(req,res)=>{
  
    let admin = req.session.admin;
    let product = await helper.getProductDetailsById(req.params.id)

    res.render('admin/editProduct',{product,admin})
})

router.post('/edit/:id',verifyLogin,(req,res)=>{
    let id = req.params.id;
    helper.updateProduct(id,req.body).then(()=>{
        if(req.files){
            if(req.files.image1){
                let image1 = req.files.image1
                image1.mv('./public/product-images/'+id+'image1.jpg',(err)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
            if(req.files.image2){
                let image2 = req.files.image2
                image2.mv('./public/product-images/'+id+'image2.jpg',(err)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
            if(req.files.image3){
                let image3 = req.files.image3
                image3.mv('./public/product-images/'+id+'image3.jpg',(err)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
            if(req.files.image4){
                let image4 = req.files.image4
                image4.mv('./public/product-images/'+id+'image4.jpg',(err)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        }
        
        res.redirect('/showProducts')
    })

})

router.post('/delete',verifyLogin,(req,res)=>{
    let id = req.body.id;
    
    helper.deleteProduct(id).then(()=>{

        for(i=1;i<5;i++){
            var path = './public/product-images/'+id+'image'+i+'.jpg'
            fs.unlinkSync(path);
        }
        
        res.redirect('/showProducts')
    })
})

module.exports = router;


