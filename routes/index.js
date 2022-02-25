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
      let products = resp.slice(0, 8)
      let secondProduct = resp.slice(8,16)
      const[banner,bannerOne,cartProducts,category] = await Promise.all([
        helper.getBanner(),helper.getBannerOne(),helper.userCart(userId),helper.getCategory()
      ])
      
      let length 
     
      if(cartProducts==null){
        var total = null;
        length = 0;
      }else{
        length = cartProducts.length
        var total = await helper.totalPrice(userId)
      }
      
      
      res.render('index', { userStatus, category, allPro, products, secondProduct, banner, bannerOne, cartProducts,total,length});

    });
  }
  else {
    helper.getProducts().then(async (resp) => {
      let allPro = resp
      let products = resp.slice(0, 8)
      let secondProduct = resp.slice(8,16)
      const[banner,bannerOne,category] = await Promise.all([
        helper.getBanner(), helper.getBannerOne(), helper.getCategory()
      ])
     
      
      res.render('index', {allPro, products, secondProduct, banner, bannerOne, category });
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
  
      res.render('productView', { userStatus, product })
    })
  }else{
    res.redirect('/')
  }

})

router.post('/search',(req,res)=>{
  console.log(req.body.item)
  let search = req.body.item
  helper.searchProduct(search).then((resp)=>{
    let products = resp;
    res.render('user/searchProducts',{products,search})
  })
})



module.exports = router;
