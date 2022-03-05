var express = require('express');
var router = express.Router();
var helper = require('../helper/connectionHelper')
const { ObjectId, Db } = require('mongodb');

/* GET home page. */
router.get('/', async (req, res, next) => {

  let userStatus = req.session.status;

  if (userStatus) {
    helper.getProducts().then(async (resp) => {
      let userId = req.session.user._id
      let userStatus = req.session.user.status
      let allPro = resp
      
      allPro.map((pro)=>{
        if(pro.manufacturerquantity == 0){
          pro.outofstock = "true";
        }
      })
    
      let products = allPro.slice(0, 8)
      let secondProduct = allPro.slice(8,16)
      const[banner,bannerOne,cartProducts] = await Promise.all([
        helper.getBanner(), helper.getBannerOne(), helper.userCart(userId)
      ])
      let allCategory = await helper.getCategorywithSubcategory()
      req.session.allCategory = allCategory
      let length 
     
      if(cartProducts==null){
        var total = null;
        length = 0;
      }else{
        length = cartProducts.length
        var total = await helper.totalPrice(userId)
      }
      
      
      res.render('index', { userStatus, allCategory, allPro, products, secondProduct, banner, bannerOne, cartProducts,total,length});

    });
  }
  else {
    helper.getProducts().then(async (resp) => {
      let allPro = resp

      allPro.map((pro)=>{
        if(pro.manufacturerquantity == 0){
          pro.outofstock = "true";
        }
      })

      let products = allPro.slice(0, 8)
      let secondProduct = allPro.slice(8,16)
      
      const[banner,bannerOne] = await Promise.all([
        helper.getBanner(), helper.getBannerOne()
      ])
      let allCategory = await helper.getCategorywithSubcategory()
      req.session.allCategory = allCategory
      
      res.render('index', {allPro, products, secondProduct, banner, bannerOne, category, allCategory });
    })

  }
})

router.get('/logout', (req, res) => {
  let user = req.session.status
  if (user) {
    req.session.status = false;
    res.redirect('/')
  }

})

router.get('/productShow/:id', (req, res) => {
  let id = req.params.id;
  if(ObjectId.isValid(id)){

    let userStatus = req.session.status
    helper.getSpecificProduct(id).then((resp) => {
      let product = resp;

     
      if(product.manufacturerquantity <= 20 && product.manufacturerquantity >= 1){
        product.stock = "true";
      }
      if(product.manufacturerquantity == 0){
        product.outofstock = "true";
      }
     
  
      res.render('productView', { userStatus, product })
    })
  }else{
    res.redirect('/')
  }

})

router.post('/search',(req,res)=>{
  
  let search = req.body.item
  const allCategory = req.session.allCategory
  helper.searchProduct(search).then((resp)=>{
    let products = resp;
    products.map((pro)=>{
      if(pro.manufacturerquantity == 0){
        pro.outofstock = "true";
      }
    })
    res.render('user/searchProducts',{products,search,allCategory})
  })
})



module.exports = router;
