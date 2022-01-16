const express = require('express');
const { Db } = require('mongodb');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{
    console.log("hehwhweuhrfjcsia")
    let admin =true;
    helper.getCategory().then((response)=>{
        console.log(response);
        let catt = response;
        res.render('admin/categoryManagement',{admin,catt})
    })
    
})

router.post('/addCategory',(req,res)=>{
    
    let category = req.body
    console.log(category);
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

router.post('/addSubCategory',(req,res)=>{
  
    console.log(req.body);
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

router.get('/viewCategory',(req,res)=>{
    let admin = true;
    helper.getCategoryDetails().then((resp)=>{
        let cattDetails = resp.cattDetails
        res.render('admin/showCategory',{cattDetails,admin})
    }).catch(()=>{

    })
   
})

router.get('/viewSubcategory/:id',(req,res)=>{
    let admin = true;
    let id = req.params.id
    helper.getSubcategoryDetails(id).then((resp)=>{
        let cattDetails = resp.cattDetails
        res.render('admin/showSubcategory',{cattDetails,admin})
    }).catch(()=>{

    })
})

module.exports = router;