const express = require('express');
const { Db } = require('mongodb');
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
  
    let admin =true;
    helper.getCategory().then((response)=>{
       
        let catt = response;
        res.render('admin/categoryManagement',{admin,catt})
    })
    
})

router.post('/addCategory',verifyLogin,(req,res)=>{
    
    let category = req.body
    helper.checkCategory(category).then((response)=>{
       if(response){
           res.send("already exist")
       }
       else{
        helper.addCategory(category).then(()=>{
            res.redirect('/categoryManagement')
        }).catch(()=>{
            console.log("something went wrong while adding category");
        })
       }
    }).catch(()=>{
       console.log("something went wrong while checking category")
    })
   
})

router.post('/addSubCategory',verifyLogin,(req,res)=>{
  
    let cattDetails = req.body;
    let subCategory = req.body.subCategoryName;
    helper.checkSubCategory(subCategory).then((response)=>{
        
        if(response){
            res.send("already exist")
        }
        else{
            helper.addSubCategory(cattDetails).then(()=>{
                res.redirect('/categoryManagement')
            }).catch(()=>{
                res.render('heyy')
            })
        }
    }).catch(()=>{
        res.send("something went wrong while checking subCategory")
    })
    
})

router.get('/viewCategory',verifyLogin,(req,res)=>{
    let admin = true;
    helper.getCategoryDetails().then((resp)=>{
        let cattDetails = resp.cattDetails
        res.render('admin/showCategory',{cattDetails,admin})
    }).catch(()=>{

    })
   
})

router.get('/viewSubcategory/:id',verifyLogin,(req,res)=>{
    let admin = true;
    let id = req.params.id
    helper.getSubcategoryDetails(id).then((resp)=>{
        let cattDetails = resp.cattDetails
        res.render('admin/showSubcategory',{cattDetails,admin})
    }).catch(()=>{

    })
})

router.post('/deleteCategory',verifyLogin,(req,res)=>{
    let id = req.body.id
    helper.deleteCategory(id).then(()=>{
        res.json({status:true})
    })
})

router.post('/deleteSubCategory',verifyLogin,(req,res)=>{
    let id = req.body.id
    helper.deleteSubCategory(id).then(()=>{
        res.json({status:true})
    })
})

module.exports = router;