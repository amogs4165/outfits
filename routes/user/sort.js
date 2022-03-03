const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/:id',async(req,res)=>{

    const catt = req.params.id
    const allCategory = req.session.allCategory
    const products = await helper.categoryWise(catt)
    products.map((pro)=>{
        if(pro.manufacturerquantity == 0){
          pro.outofstock = "true";
        }
      })
    res.render('user/categorySearch',{products,allCategory,catt})
})


module.exports = router;