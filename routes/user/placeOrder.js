const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper');

const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AfF6k5zk39mI1OUhafw3gKuYwpl-vndoSGGsix0mw2gnfN1Iva9iAgGexB2KdDz2K_P0jQD4yplx8yHE',
  'client_secret': 'EM0SmG5OL1Bg3e_qXeyvCniGIZsG_3VcpPRAoiHBte0NGhBBVKGY0KyPEGB0CAQ9YJHSIMu0tZFAyGQh'
});

router.post('/',async (req,res)=>{
    
    console.log("check is here",req.body);
    let address = req.body.address;
    let paymentMode = req.body.paymentMode;
    let check = req.body.check
    
    if(!check){
        if(paymentMode =='COD'){
            if(address!=''){
                let userId = req.session.user._id;
                let date = new Date();
                let status = "placed";
                let OrderStatus = "Getting ready"
                let shippingAddress1 = await helper.getShippingAddress (userId,address);
                const [shippingAddress] = shippingAddress1;
                let products = await helper.userCart(userId);
                let total = await helper.totalPrice(userId);
                console.log("its here");
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then(()=>{
                    helper.removeCart(userId).then(()=>{
                        res.json({status:true})
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
                let products = await helper.userCart(userId);
                let total = await helper.totalPrice(userId);
                helper.orders(userId,{address},products,total,paymentMode,date,status).then(()=>{
                    helper.removeCart(userId).then(()=>{
                        res.json({status:true})
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
                let total = await helper.totalPrice(userId);
                console.log("its here",total);
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                    console.log("resp details.....",resp)
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
                let total = await helper.totalPrice(userId);
                helper.orders(userId,{address},products,total,paymentMode,date,status).then((response)=>{
                  
                    helper.generateRazorpay(orderId,total).then((response)=>{
                        res.json({status:false,response})
                    })
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
                let total = req.body.total
                console.log("its here");
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then(()=>{
                    helper.removeCart(userId).then(()=>{
                        res.json({status:true})
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
                let status = "placed";
                let products = [await helper.getProductDetailsById(proId)];
                let total = req.body.total
                helper.orders(userId,{address},products,total,paymentMode,date,status).then(()=>{
                    helper.removeCart(userId).then(()=>{
                        res.json({status:true})
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
                let total = req.body.productprice
                console.log("its here",total);
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                    console.log("resp details.....",resp)
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
                let products = [await helper.getProductDetailsById(proId)];
                let total = req.body.productprice
                helper.orders(userId,{address},products,total,paymentMode,date,status).then((response)=>{
                  
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
                let total = req.body.productprice
                console.log("its here",total);
                helper.orders(userId,{...shippingAddress},products,total,paymentMode,date,status,OrderStatus).then((resp)=>{
                    console.log("resp details.....",resp)
                    let orderId = ""+resp.insertedId
                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3000/placeOrder/order-success",
                            "cancel_url": "http://localhost:3000/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Red Sox Hat",
                                    "sku": "001",
                                    "price": "25.00",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "25.00"
                            },
                            "description": "Hat for the best team ever"
                        }]
                    };
                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            console.log("create paynm resp");
                            console.log(payment);
                            
                            for(let i = 0;i < payment.links.length;i++){
                              if(payment.links[i].rel === 'approval_url'){
                                  console.log(payment.links[i].href);
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
                let products = [await helper.getProductDetailsById(proId)];
                let total = req.body.productprice
                helper.orders(userId,{address},products,total,paymentMode,date,status).then((response)=>{
                  
                    helper.generateRazorpay(orderId,total).then((response)=>{
                        res.json({status:false,response})
                    })
                })
            } 


        }
    }
})

router.post('/verify-payment',(req,res)=>{
    console.log("verify payment",req.body);
    helper.verifyPayment(req.body).then(()=>{
        let crrStatus = "placed"
        helper.changePaymentStatus(req.body['order[receipt]'],crrStatus).then((resp)=>{
            console.log(resp);
            console.log("payment succesful");
            res.json({status:true})
        })
    }).catch((err)=>{
        console.log(err)
        res.json({status:'Paymentfailed'})
    })
})

router.get('/order-success',(req,res)=>{
    
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    if(!payerId){
        res.render('user/checkout-success')
    }
    else{

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                }
            }]
          };
        
          paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                
                console.log(error.response);
                throw error;
            } else {
                console.log("get payment response")
                console.log(JSON.stringify(payment));
                res.send('Success');
            }
        });
    }
    
})

// router.post('/newAddress',(req,res)=>{
//     console.log(req.body);
// })
module.exports = router;