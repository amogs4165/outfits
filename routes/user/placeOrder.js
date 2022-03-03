const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper');

const paypal = require('paypal-rest-sdk');
const { ObjectId } = require('mongodb');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AfF6k5zk39mI1OUhafw3gKuYwpl-vndoSGGsix0mw2gnfN1Iva9iAgGexB2KdDz2K_P0jQD4yplx8yHE',
  'client_secret': 'EM0SmG5OL1Bg3e_qXeyvCniGIZsG_3VcpPRAoiHBte0NGhBBVKGY0KyPEGB0CAQ9YJHSIMu0tZFAyGQh'
});

const verifyLogin = (req,res,next) =>{
    if(req.session.status){
        next()
    }else{
        res.redirect('/signIn');
    }
}

router.post('/',verifyLogin,async (req,res)=>{
    
    let address = req.body.address;
    let paymentMode = req.body.paymentMode;
    let check = req.body.check
    let coupon = req.body.couponCode
    req.session.coupon = coupon;
    
    if(check== 'false'){

        if(paymentMode =='COD'){
            if(address!=''){
                let userId = req.session.user._id;
                let date = new Date();
                let status = "placed";
                let OrderStatus = "Getting ready"
                let shippingAddress1 = await helper.getShippingAddress (userId,address);
                const [shippingAddress] = shippingAddress1;
                let products = await helper.userCart(userId);
                products.forEach(record => {
                    helper.quantityDecrement(record.productId,record.quantity);
                   
                });
                let total =  req.body.totalAmount
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                    let orderId = ""+resp.insertedId
                    helper.addUserCoupon(userId,coupon)
                    if(req.session.vAmount){

                        helper.incrementAmount(userId,-req.session.wAmount)
                    }
                    helper.removeCart(userId).then(()=>{
                        res.json({status:true,orderId})
                    })
                    
                })
            }
            else{
                let userId = req.session.user._id;
                let details = req.body
                let address = Object.fromEntries(
                    Object.entries(details).slice(1, 12)
                )
                let date = new Date();
                let status = "placed";
                let OrderStatus = "Getting ready"
                let products = await helper.userCart(userId);
                products.forEach(record => {
                    helper.quantityDecrement(record.productId,record.quantity);
                   
                });
                let total =  req.body.totalAmount
                helper.orders(userId,{address},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                    let orderId = ""+resp.insertedId
                    helper.addUserCoupon(userId,coupon)
                    if(req.session.vAmount){

                        helper.incrementAmount(userId,-req.session.wAmount)
                    }
                    helper.removeCart(userId).then(()=>{
                        res.json({status:true,orderId})
                    })
                    
                })
            }
        }else if(paymentMode == 'razorpay'){
            

            if(address!=''){
            
                let userId = req.session.user._id;
                let date = new Date();
                let status = "pending";
                let OrderStatus = "Getting ready"
                let shippingAddress1 = await helper.getShippingAddress (userId,address);
                const [shippingAddress] = shippingAddress1;
                let products = await helper.userCart(userId);
                products.forEach(record => {
                    helper.quantityDecrement(record.productId,record.quantity);
                   
                });
                let total =  req.body.totalAmount
         
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                   
                    let orderId = ""+resp.insertedId
                    helper.generateRazorpay(orderId,total).then((response)=>{
                        res.json({status:false,response})
                    })
                })
              
            }
            else{
                let proId = req.body.proId
                let userId = req.session.user._id;
                let details = req.body
                let address = Object.fromEntries(
                    Object.entries(details).slice(1, 12)
                )
                let date = new Date();
                let status = "pending";
                let products = await helper.userCart(userId);
                products.forEach(record => {
                    helper.quantityDecrement(record.productId,record.quantity);
                   
                });
                let total =  req.body.totalAmount
                helper.orders(userId,{address},products,total,paymentMode,date,status).then((resp)=>{
                    let orderId = ""+resp.insertedId
                    helper.generateRazorpay(orderId,total).then((response)=>{
                        res.json({status:false,response})
                    })
                })
            }  
        }else{


            if(address!=''){
                
                let userId = req.session.user._id;
                let date = new Date();
                let status = "pending";
                let OrderStatus = "Getting ready"
                let shippingAddress1 = await helper.getShippingAddress (userId,address);
                const [shippingAddress] = shippingAddress1;
                let products = await helper.userCart(userId);
                products.forEach(record => {
                    helper.quantityDecrement(record.productId,record.quantity);
                   
                });
                let total =  req.body.totalAmount
                let totalPrice = total/75;
                let totalAmount = parseInt(totalPrice);
                // let totalPrice = totalAmount.toString();
               
                
                req.session.total = totalAmount;
                
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                   
                    let orderId = ""+resp.insertedId
                    req.session.orderId = resp.insertedId
                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://youroutfits.site/placeOrder/order-success",
                            "cancel_url": "http://youroutfits.site"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Red Sox Hat",
                                    "sku": "001",
                                    "price": totalAmount,
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": totalAmount
                            },
                            "description": "Hat for the best team ever"
                        }]
                    };
                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                          
                            
                            for(let i = 0;i < payment.links.length;i++){
                              if(payment.links[i].rel === 'approval_url'){
                                 
                                  let redirecturl = payment.links[i].href
                                res.json({status:false,mode:"paypal",url:redirecturl});
                              }
                            }
                        }
                      });
                })
              
            }
            else{
                let proId = req.body.proId
                let userId = req.session.user._id;
                let details = req.body
                let address = Object.fromEntries(
                    Object.entries(details).slice(1, 12)
                )
                let date = new Date();
                let status = "pending";
                let products = await helper.userCart(userId);
                products.forEach(record => {
                    helper.quantityDecrement(record.productId,record.quantity);
                   
                });
                let total =  req.body.totalAmount
                let totalPrice = total/75;
                let totalAmount = parseInt(totalPrice);
                // let totalPrice = totalAmount.toString();
            
                
                req.session.total = totalAmount;
                helper.orders(userId,{address},products,total,paymentMode,date,status).then((resp)=>{
                  
                    let orderId = ""+resp.insertedId
                    req.session.orderId = resp.insertedId
                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://youroutfits.site/placeOrder/order-success",
                            "cancel_url": "http://youroutfits.site"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Red Sox Hat",
                                    "sku": "001",
                                    "price": totalAmount,
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": totalAmount
                            },
                            "description": "Hat for the best team ever"
                        }]
                    };
                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            
                            for(let i = 0;i < payment.links.length;i++){
                              if(payment.links[i].rel === 'approval_url'){
                                  let redirecturl = payment.links[i].href
                                res.json({status:false,mode:"paypal",url:redirecturl});
                              }
                            }
                        }
                      });
                })
            } 
        }
    }
    else{  //  not cart
       
        if(paymentMode =='COD'){  //cod
            if(address!=''){
              
                let proId = req.body.proId
                let userId = req.session.user._id;
                let date = new Date();
                let status = "placed";
                let OrderStatus = "Getting ready"
                let shippingAddress1 = await helper.getShippingAddress (userId,address);
                const [shippingAddress] = shippingAddress1;
                let products = [await helper.getProductDetailsById(proId)];
                let qty = req.body.qty;
            
                products[0].quantity = parseInt(qty);
                products[0].productId = ObjectId(proId) 
             
                helper.quantityDecrement(proId,qty);
                let total =  req.body.totalAmount
       
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                    let orderId = ""+resp.insertedId
                    helper.addUserCoupon(userId,coupon).then(()=>{
                        if(req.session.vAmount){

                            helper.incrementAmount(userId,-req.session.wAmount)
                        }
                        res.json({status:true,orderId})
                    })
                    
                    
                    
                })
            }
            else{
                let proId = req.body.proId
                let userId = req.session.user._id;
                let details = req.body
                let address = Object.fromEntries(
                    Object.entries(details).slice(1, 12)
                )
                let OrderStatus = "Getting ready"
                let date = new Date();
                let status = "placed";
                let products = [await helper.getProductDetailsById(proId)];
                let qty = req.body.qty;
                products[0].quantity = parseInt(qty);
                products[0].productId = ObjectId(proId) 
                helper.quantityDecrement(proId,qty);
                let total =  req.body.totalAmount
                helper.orders(userId,{address},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                    let orderId = ""+resp.insertedId
                    helper.addUserCoupon(userId,coupon).then(()=>{
                        if(req.session.vAmount){

                            helper.incrementAmount(userId,-req.session.wAmount)
                        }
                        res.json({status:true,orderId})
                    })
                    
                })
            }
        }
        else if(paymentMode == 'razorpay'){  //razorpay
           
            if(address!=''){
                let proId = req.body.proId
                let userId = req.session.user._id;
                let date = new Date();
                let status = "pending";
                let OrderStatus = "Getting ready"
                let shippingAddress1 = await helper.getShippingAddress (userId,address);
                const [shippingAddress] = shippingAddress1;
                let products = [await helper.getProductDetailsById(proId)];
                let qty = req.body.qty;
                products[0].quantity = parseInt(qty);
                products[0].productId = ObjectId(proId) 
                helper.quantityDecrement(proId,qty);
                let total =  req.body.totalAmount
              
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                
                    let orderId = ""+resp.insertedId
                    helper.generateRazorpay(orderId,total).then((response)=>{
                        res.json({status:false,response})
                    })
                })
              
            }
            else{
                let proId = req.body.proId
                let userId = req.session.user._id;
                let details = req.body
                let address = Object.fromEntries(
                    Object.entries(details).slice(1, 12)
                )
                let OrderStatus = "Getting ready"
                let date = new Date();
                let status = "pending";
                let products = [await helper.getProductDetailsById(proId)];
                let qty = req.body.qty;
                products[0].quantity = parseInt(qty);
                products[0].productId = ObjectId(proId) 
                helper.quantityDecrement(proId,qty);
                let total =  req.body.totalAmount
                helper.orders(userId,{address},products,total,paymentMode,date,status,OrderStatus).then((response)=>{
                  
                    helper.generateRazorpay(orderId,total).then((response)=>{
                        res.json({status:false,response})
                    })
                })
            }  
        }else{

            if(address!=''){
                let proId = req.body.proId
                let userId = req.session.user._id;
                let date = new Date();
                let status = "pending";
                let OrderStatus = "Getting ready"
                let shippingAddress1 = await helper.getShippingAddress (userId,address);
                const [shippingAddress] = shippingAddress1;
                let products = [await helper.getProductDetailsById(proId)];
                let qty = req.body.qty;
                products[0].quantity = parseInt(qty);
                products[0].productId = ObjectId(proId) 
                helper.quantityDecrement(proId,qty);
                let total =  req.body.totalAmount
                let totalAmount = parseInt(total)/75;
                totalAmount = parseInt(totalAmount.toFixed(2))
                // let totalPrice = totalAmount.toString();
           
                
                req.session.total = totalAmount;
             
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                   
                    let orderId = ""+resp.insertedId
                    req.session.orderId = resp.insertedId
                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://youroutfits.site/placeOrder/order-success",
                            "cancel_url": "http://youroutfits.site/"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Red Sox Hat",
                                    "sku": "001",
                                    "price": totalAmount,
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": totalAmount
                            },
                            "description": "Hat for the best team ever"
                        }]
                    };
                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                       
                            
                            for(let i = 0;i < payment.links.length;i++){
                              if(payment.links[i].rel === 'approval_url'){
                              
                                  let redirecturl = payment.links[i].href
                                res.json({status:false,mode:"paypal",url:redirecturl});
                              }
                            }
                        }
                      });
                    
                    
                })
              
            }
            else{
                let proId = req.body.proId
                let userId = req.session.user._id;
                let details = req.body
                let address = Object.fromEntries(
                    Object.entries(details).slice(1, 12)
                )
                let OrderStatus = "Getting ready"
                let date = new Date();
                let status = "pending";
                let products = [await helper.getProductDetailsById(proId)];
                let qty = req.body.qty;
                products[0].quantity = parseInt(qty);
                products[0].productId = ObjectId(proId) 
                helper.quantityDecrement(proId,qty);
                let total =  req.body.totalAmount
                let totalAmount = parseInt(total)/75;
                // let totalPrice = totalAmount.toString();
                totalAmount = totalAmount.toFixed(2)
           
                
                req.session.total = totalAmount;
                helper.orders(userId,{address},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                  
                 
                    let orderId = ""+resp.insertedId
                    req.session.orderId = resp.insertedId
                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://youroutfits.site/placeOrder/order-success",
                            "cancel_url": "http://youroutfits.site"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Red Sox Hat",
                                    "sku": "001",
                                    "price": totalAmount,
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": totalAmount
                            },
                            "description": "Hat for the best team ever"
                        }]
                    };
                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                           
                            
                            for(let i = 0;i < payment.links.length;i++){
                              if(payment.links[i].rel === 'approval_url'){
                                
                                  let redirecturl = payment.links[i].href
                                res.json({status:false,mode:"paypal",url:redirecturl});
                              }
                            }
                        }
                      });
                })
            } 


        }
    }
})

router.post('/verify-payment',verifyLogin,(req,res)=>{
  
    helper.verifyPayment(req.body).then(()=>{
        let crrStatus = "placed"
        let userId = req.session.user._id;
        let coupon = req.session.coupon;
        helper.changePaymentStatus(req.body['order[receipt]'],crrStatus).then((resp)=>{
            helper.addUserCoupon(userId,coupon)
            if(req.session.vAmount){

                helper.incrementAmount(userId,-req.session.wAmount)
            }
 
            res.json({status:true})
        })
    }).catch((err)=>{
    
        res.json({status:'Paymentfailed'})
    })
})

router.get('/order-success',verifyLogin,(req,res)=>{
    
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    if(!payerId){
        let orderId = req.session.user._id;
        res.render('user/checkout-success',{orderId})
    }
    else{

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": req.session.total
                }
            }]
          };
        
          paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                
                throw error;
            } else {

                let coupon = req.session.coupon
                let crrStatus = "placed"
                let userId = req.session.user._id;
                let orderId = req.session.orderId
                helper.changePaymentStatus(orderId,crrStatus).then(()=>{
                    helper.addUserCoupon(userId,coupon)
                    if(req.session.vAmount){

                        helper.incrementAmount(userId,-req.session.wAmount)
                    }
                    res.render('user/checkout-success',{orderId})
                })
                
            }
        });
    }
    
})

module.exports = router;