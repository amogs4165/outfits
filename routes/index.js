var express = require('express');
var router = express.Router();
var helper = require('../helper/connectionHelper')

/* GET home page. */
router.get('/', async (req, res, next) => {

  let userStatus = req.session.status;

  if (userStatus) {
    helper.getProducts().then(async (resp) => {
      let products = resp.slice(0, 8)
      let banner = await helper.getBanner()
      let bannerOne = await helper.getBannerOne()
      let userId = req.session.user._id
      let userStatus = req.session.user.status
      let cartProducts = await helper.userCart(userId)
      let total = await helper.totalPrice(userId)
      
      res.render('index', { userStatus, products, banner, bannerOne, cartProducts, total });

    });
  }
  else {
    helper.getProducts().then(async (resp) => {
      let products = resp.slice(0, 8)
      
      let banner = await helper.getBanner()
      let bannerOne = await helper.getBannerOne()
      
      res.render('index', {products, banner, bannerOne });
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
  let userStatus = req.session.status
  helper.getSpecificProduct(id).then((resp) => {
    let product = resp;

    res.render('productView', { userStatus, product })
  })

})

router.post('/search',(req,res)=>{
  console.log(req.body.item)
  let search = req.body.item
  helper.searchProduct(search).then((resp)=>{
    let products = resp;
    res.render('user/searchProducts',{products})
  })
})
module.exports = router;
