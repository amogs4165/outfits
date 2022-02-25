const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/:id',async(req,res)=>{

    const catt = req.params.id
    const category = req.session.category
    const products = await helper.categoryWise(catt)
    res.render('user/categorySearch',{products,category,catt})
})


module.exports = router;