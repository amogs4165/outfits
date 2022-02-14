const { response } = require('express');
const async = require('hbs/lib/async');
const { ObjectId, Db } = require('mongodb');
const dB = require('../config/connection');
const Razorpay = require('razorpay')
const instance = new Razorpay({
    key_id: 'rzp_test_nUVcKdOUWrUXIZ',
    key_secret: 'JCCNkRAJ4RRAe0opTVGwdhW8',
});

module.exports = {

    userRegistration: (userData) => {
        return new Promise((resolve, reject) => {
            userData.status = true;
            dB.get().collection('userData').insertOne(userData).then(() => {
                return resolve(true)
            })
                .catch(() => {
                    return reject(false)
                })
        })
    },
    userVerify: (loginCredential) => {
        return new Promise(async (resolve, reject) => {
            let user = await dB.get().collection('userData').findOne({ userName: loginCredential.userName, password: loginCredential.password, status: true })
            if (user) {
                return resolve({ status: true, user })
            }
            else {
                return resolve({ status: false })
            }
        })
    },
    loginUserdetailWithNum: (number) => {
        return new Promise(async (resolve, reject) => {
            await dB.get().collection('userData').findOne({ phoneNumber: number }).then((user) => {
                console.log(user, "heey this is the user detials logged in by number")
                return resolve(user)
            })
        })
    },
    verifyMobileNum: (number) => {
        return new Promise(async (resolve, reject) => {
            console.log("hey" + number.phoneNumber)
            let user = await dB.get().collection('userData').findOne({ phoneNumber: number.phoneNumber, status: true })
            if (user) {
                console.log("got it sucees")
                return resolve({ status: true, user })
            }
            else {
                console.log("got it failure");
                return resolve({ status: false })
            }
        })
    },
    checkEmail: (email) => {
        return new Promise(async (resolve, reject) => {
            console.log("heyeyeyeyey" + email)
            let user = await dB.get().collection('userData').findOne({ email: email, status: true })
            if (user) {
                console.log("hey got it ");
                return resolve({ status: true, user })
            }
            else {
                console.log("got it but failure");
                return resolve({ status: false })
            }
        })
    },
    getuserDetails: () => {
        return new Promise(async (resolve, reject) => {
            var userDetails = await dB.get().collection('userData').find().toArray();

            if (userDetails) {
                return resolve({ userDetails, status: true })
            }
            else {
                return resolve({ staus: false })
            }
        })

    },
    userBlock: (id) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('userData').updateOne({ _id: ObjectId(id) }, {
                $set: {
                    status: false
                }
            }).then(() => {

                return resolve(true)

            })
                .catch(() => {
                    return reject(false)
                })
        })
    },
    userUnblock: (id) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('userData').updateOne({ _id: ObjectId(id) }, {
                $set: {

                    status: true

                }
            })
                .then(() => {

                    return resolve(true)
                })
                .catch(() => {
                    return resolve(false)
                })
        })
    },
    userDelete: (id) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('userData').deleteOne({ _id: ObjectId(id) }).then(() => {
                return resolve(true)
            })
                .catch(() => {
                    return reject(false)
                })
        })
    },
    checkCategory: (category) => {
        return new Promise(async (resolve, reject) => {
            console.log(category.categoryName);

            await dB.get().collection('category').findOne({ categoryName: category.categoryName }).then((catt) => {
                console.log("hii", catt);
                if (catt) {
                    return resolve(true)
                }
                else {
                    return resolve(false)
                }

            })


        })
    },
    addCategory: (category) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('category').insertOne(category).then(() => {
                return resolve(true)
            }).catch(() => {
                return reject(false)
            })
        })
    },
    getCategory: () => {
        return new Promise((resolve, reject) => {
            let catt = dB.get().collection('category').find().toArray();
            return resolve(catt);
        })
    },
    addSubCategory: (data) => {
        return new Promise((resolve, reject) => {
            let id = data.category;
            let subCategory = data.subCategoryName;
            console.log(id, subCategory);
            dB.get().collection('subcategory').insertOne({ subCategory, category: ObjectId(id) }).then(() => {
                return resolve();
            }).catch(() => {
                return reject();
            })
        })
    },
    checkSubCategory: (data) => {
        return new Promise((resolve, reject) => {
            console.log(data)
            dB.get().collection('subcategory').findOne({ subCategory: data }).then((ifData) => {
                if (ifData) {
                    return resolve(true);
                }
                else {
                    return resolve(false);
                }
            })
        })
    },
    getCategoryDetails: () => {
        return new Promise(async (resolve, reject) => {
            let cattDetails = await dB.get().collection('category').find().toArray();
            if (cattDetails) {
                return resolve({ status: true, cattDetails })
            }
            else {
                return resolve({ status: false })
            }
        })
    },
    getSubcategoryDetails: (id) => {
        return new Promise(async (resolve, reject) => {
            let cattDetails = await dB.get().collection('subcategory').find({ category: ObjectId(id) }).toArray();
            if (cattDetails) {
                return resolve({ status: true, cattDetails })
            }
            else {
                return resolve({ status: false })
            }
        })
    },
    getSCategoryDetails: () => {
        return new Promise(async (resolve, reject) => {
            let cattDetails = await dB.get().collection('subcategory').find().toArray();
            if (cattDetails) {
                return resolve({ status: true, cattDetails })
            }
            else {
                return resolve({ status: false })
            }
        })
    },
    addProduct: (product, callback) => {
        let price = parseInt(product.productprice);
        product.productprice = price;

        dB.get().collection('products').insertOne(product).then((data) => {
            console.log(data);
            callback(data.insertedId)
        })

    },
    getProducts: () => {
        console.log('im here 1')
        return new Promise(async (resolve, reject) => {
            let products = await dB.get().collection('products').find().toArray()

            console.log((products));
            if (products) {
                return resolve(products)
            }

        })

    },
    verifyAdmin: (data) => {
        return new Promise(async (resolve, reject) => {
            let admin = await dB.get().collection('admin').findOne({ adminName: data.adminName, password: data.password })
            if (admin) {
                return resolve({ status: true })
            }
            else {
                return resolve({ status: false })
            }
        })
    },
    getProductDetailsById: (id) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('products').findOne({ _id: ObjectId(id) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (id, productDetails) => {

        let price = parseInt(productDetails.productprice);
        return new Promise((resolve, reject) => {
            dB.get().collection('products').updateOne({ _id: ObjectId(id) }, {
                $set: {
                    productname: productDetails.productname,
                    manufacturerbrand: productDetails.manufacturerbrand,
                    productsize: productDetails.productsize,
                    productprice: price,
                    manufacturerquantity: productDetails.manufacturerquantity,
                    description: productDetails.description
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    deleteProduct: (id) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('products').deleteOne({ _id: ObjectId(id) }).then(() => {
                resolve()
            })
        })
    },
    getSpecificProduct: (id) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('products').findOne({ _id: ObjectId(id) }).then((resp) => {
                return resolve(resp);
            })
        })
    },
    addToCart: (userId, productId) => {
        let proObj = {
            item: ObjectId(productId),
            quantity: 1,
            btnStatus: false
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await dB.get().collection('cart').findOne({ user: ObjectId(userId) })

            if (userCart) {
                console.log("helloooooooooooooo")
                let proExist = userCart.products.findIndex(product => product.item == productId);
                console.log("heyyyyyyyyyyyy")
                console.log(proExist)
                if (proExist != -1) {
                    dB.get().collection('cart')
                        .updateOne({ user: ObjectId(userId), 'products.item': ObjectId(productId) },
                            {
                                $inc: { 'products.$.quantity': 1 }, "$set": { "products.$.btnStatus": true }
                            }).then(() => {
                                resolve()
                            })
                } else {
                    dB.get().collection('cart').updateOne({ user: ObjectId(userId) },
                        {

                            $push: { products: proObj }

                        }).then(() => {
                            return resolve()
                        })
                }

                // if(product){

                // }
                // else{


            }
            else {
                let cartObj = {
                    user: ObjectId(userId),
                    products: [proObj]
                }
                dB.get().collection('cart').insertOne(cartObj).then(() => {
                    return resolve();
                })
            }

        })
    },
    checkCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            let checkCart = await dB.get().collection('cart').findOne({ user: ObjectId(userId) })
            return resolve(checkCart)
        })
    },

    userCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            let checkCart = await dB.get().collection('cart').findOne({ user: ObjectId(userId) })
            console.log(checkCart)

            if (checkCart != null) {
                let cartItems = await dB.get().collection('cart').aggregate([
                    {
                        $match: { user: ObjectId(userId) }
                    },
                    {
                        $unwind: '$products'
                    },
                    // {
                    //     $project:{
                    //         item:'$products.item',
                    //         quantity:'$products.quantity'
                    //     }
                    // },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'products.item',
                            foreignField: '_id',
                            as: 'cartProducts'
                        }
                    },
                    {
                        $unwind: '$cartProducts'
                    },
                    {
                        $project: {
                            quantity: '$products.quantity',
                            btnStatus: '$products.btnStatus',
                            total: {
                                $multiply: [
                                    "$cartProducts.productprice", "$products.quantity"
                                ]
                            },
                            productname: '$cartProducts.productname',
                            productprice: '$cartProducts.productprice',
                            productId: '$cartProducts._id',
                            // products:{$arrayElemAt:['$products',0]}
                        }
                    }

                    // {
                    //     $lookup:{
                    //         from:'products',

                    //         let:{prodList:'$productId'},
                    //         pipeline:[
                    //             {
                    //                 $match:{
                    //                     $expr:{
                    //                         $in:['$_id',"$$prodList"]
                    //                     }
                    //                 }
                    //             }
                    //         ],
                    //         as:'cartItems'
                    //     }
                    // }
                ]).toArray()
                console.log(cartItems)
                resolve(cartItems)
            } else {
                resolve(null)
            }

        })
    },
    totalPrice: (userId) => {
        return new Promise(async (resolve, reject) => {
            let checkCart = await dB.get().collection('cart').findOne({ user: ObjectId(userId) })
            if (checkCart) {
                totalPrice = await dB.get().collection('cart').aggregate([
                    {
                        $match: { user: ObjectId(userId) }
                    },
                    {
                        $unwind: '$products'
                    },
                    {
                        $project: {
                            item: '$products.item',
                            quantity: '$products.quantity'
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'item',
                            foreignField: '_id',
                            as: 'cartProducts'
                        }
                    },
                    {
                        $project: {
                            item: 1, quantity: 1, products: { $arrayElemAt: ['$cartProducts', 0] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $multiply: ['$quantity', '$products.productprice'] } }
                        }
                    }



                ]).toArray()


                resolve(totalPrice[0].total)
            } else {
                resolve(null)
            }

        })
    },
    quantity: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            let quantity = await dB.get().collection('cart')
                .aggregate([
                    {
                        $match: { user: ObjectId(userId) }
                    },
                    {
                        $unwind: '$products'
                    },
                    {
                        $match: { 'products.item': ObjectId(productId) }
                    },
                    {
                        $project: {
                            quantity: '$products.quantity'

                        }
                    },
                    {
                        $project: {
                            _id: 0, quantity: 1
                        }
                    }

                ]).toArray()

            resolve(...quantity);
        })

    },
    quantityDecrement: (proId, dcQty) => {
        let qty = parseInt(dcQty);
        return new Promise((resolve, reject) => {
            dB.get().collection('products').updateOne({ _id: ObjectId(proId) }, { $inc: { manufacturerquantity: -qty } })
        })
    },
    changeButtonStatus: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            dB.get().collection('cart').updateOne({ user: ObjectId(userId), 'products.item': ObjectId(productId) }, { "$set": { "products.$.btnStatus": false } })
            resolve()
        })

    },
    changeButtonStatusT: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            dB.get().collection('cart').updateOne({ user: ObjectId(userId), 'products.item': ObjectId(productId) }, { "$set": { "products.$.btnStatus": true } })
            resolve()
        })

    },
    changeProductQuantity: (details) => {
        console.log(details.product);
        let count = parseInt(details.count)
        console.log(count)
        return new Promise((resolve, reject) => {
            dB.get().collection('cart')
                .updateOne({ _id: ObjectId(details.cart), 'products.item': ObjectId(details.product) },
                    {
                        $inc: { 'products.$.quantity': count }
                    }).then(async (response) => {
                        var product = await dB.get().collection('products').findOne({ _id: ObjectId(details.product) })
                        var cartProduct = await dB.get().collection('cart').aggregate([
                            { $match: { _id: ObjectId(details.cart) } },
                            { $unwind: '$products' },
                            { $match: { 'products.item': ObjectId(details.product) } }
                        ]).toArray();
                        cartProduct = cartProduct[0];
                        resolve(product.productprice * cartProduct.products.quantity);
                    })
        })
    },
    removeFromCart: (cartId, productId) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('cart').update({ _id: ObjectId(cartId) }, { $pull: { 'products': { item: ObjectId(productId) } } }).then(() => {
                return resolve();
            })
        })
    },
    addAddress: (userId, address) => {
        return new Promise(async (resolve, reject) => {
            let check = await dB.get().collection('address').findOne({ userId: ObjectId(userId) })
            console.log(check);
            if (check) {
                dB.get().collection('address').updateOne({ userId: ObjectId(userId) }, { $push: { address: { _id: ObjectId(), address } } }).then((resp) => {
                    console.log(resp)
                    return resolve(resp)
                })
            }
            else {
                dB.get().collection('address').insertOne({ userId: ObjectId(userId), address: [{ _id: ObjectId(), address }] }).then((resp) => {
                    console.log(resp)
                    return resolve(resp)
                })
            }

        })
    },
    // addAddress2:(userId,address)=>{
    //     return new Promise((resolve,reject)=>{
    //         dB.get().collection('address').updateOne({_id:ObjectId(userId)},{$set:{address2:address}}).then((resp)=>{
    //             return resolve(resp)
    //         })
    //     })
    // },
    findAddress: (userId) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('address').findOne({ userId: ObjectId(userId) }).then((address) => {
                return resolve(address)
            }).catch(() => {
                return reject;
            })

        })
    },
    addBanner: (info) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('banner').insertOne({ info, status: false }).then((resp) => {
                return resolve(resp);
            })
        })
    },
    addBannerOne: (info) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('bannerOne').insertOne({ info, status: false }).then((resp) => {
                return resolve(resp);
            })
        })
    },
    viewBanner: () => {
        return new Promise(async (resolve, reject) => {
            let resp = await dB.get().collection('banner').find().toArray()
            return resolve(resp);

        })
    },
    viewBannerOne: () => {
        return new Promise(async (resolve, reject) => {
            let resp = await dB.get().collection('bannerOne').find().toArray()
            return resolve(resp);

        })
    },
    selectBanner: (id) => {
        return new Promise(async (resolve, reject) => {
            dB.get().collection('banner').updateMany({}, { $set: { status: false } })
            let banner = await dB.get().collection('banner').updateOne({ _id: ObjectId(id) }, { $set: { status: true } })
            return resolve(banner)

        })
    },
    selectBannerOne: (id) => {
        return new Promise(async (resolve, reject) => {
            dB.get().collection('bannerOne').updateMany({}, { $set: { status: false } })
            let banner = await dB.get().collection('bannerOne').updateOne({ _id: ObjectId(id) }, { $set: { status: true } })
            return resolve(banner)

        })
    },
    getBanner: () => {
        return new Promise(async (resolve, reject) => {
            let banner = dB.get().collection('banner').findOne({ status: true })
            return resolve(banner)
        })
    },
    getBannerOne: () => {
        return new Promise(async (resolve, reject) => {
            let banner = dB.get().collection('bannerOne').findOne({ status: true })
            return resolve(banner)
        })
    },
    findBanner: (id) => {
        return new Promise((resolve, reject) => {
            let banner = dB.get().collection('banner').findOne({ _id: ObjectId(id) })
            resolve(banner);
        })
    },
    // getShippingAddress:(userId,addressId)=>{
    //     return new Promise((resolve,reject)=>{
    //         let shippingAddress = dB.get().collection('address').findOne({userId:ObjectId(userId),address:{$elemMatch:{_id:ObjectId(addressId)}}})
    //         return resolve(shippingAddress)
    //     })
    // },
    getShippingAddress: (userId, addressId) => {
        return new Promise((resolve, reject) => {
            let shippingAddress = dB.get().collection('address').aggregate([
                {
                    $match: { userId: ObjectId(userId) }
                },
                {
                    $project: {
                        _id: 0, address: 1
                    }
                },
                {
                    $unwind: '$address'
                },
                {
                    $match: { 'address._id': ObjectId(addressId) }
                },
                {
                    $project: {
                        address: '$address.address'
                    }
                }



            ]).toArray()
            console.log(shippingAddress)
            return resolve(shippingAddress)
        })
    },
    orders: (id, address, products, total, payment, date, status, OrderStatus) => {
        const formattedInputs = { id, ...address, products, total, payment, date, status, OrderStatus }
        return new Promise((resolve, reject) => {
            dB.get().collection('orders').insertOne(formattedInputs).then((resp) => {
                resolve(resp)
            })
        })
    },
    getOrders: () => {
        return new Promise((resolve, reject) => {
            let orders = dB.get().collection('orders').find().toArray()
            return resolve(orders)
        })
    },
    ordersById: (userId) => {
        return new Promise((resolve, reject) => {
            let orders = dB.get().collection('orders').find({ id: userId }).toArray()
            resolve(orders)
        })
    },
    removeCart: (userId) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('cart').remove({ user: ObjectId(userId) }).then(() => {
                resolve()
            })
        })
    },
    searchProduct: (searchedItem) => {
        return new Promise((resolve, reject) => {
            let products = dB.get().collection('products').aggregate([
                {
                    $match: {
                        $or: [
                            { 'productname': { $regex: searchedItem, $options: 'i' } },
                            { 'manufacturerbrand': { $regex: searchedItem, $options: 'i' } },
                            { 'id': { $regex: searchedItem, $options: 'i' } },
                        ]
                    }
                }
            ]).toArray()
            resolve(products)

        })
    },
    updateOrderStatus: (id, value) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('orders').updateOne({ _id: ObjectId(id) }, { $set: { OrderStatus: value } });
        })
    },
    generateRazorpay: (orderId, total) => {
        let totalPrice = parseInt(total)
        return new Promise((resolve, reject) => {
            var options = {
                amount: totalPrice * 100,  //amount in the smallest currency unit
                currency: "INR",
                receipt: orderId
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("New Order:", order);
                    resolve(order);
                }

            })
        })
    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            console.log(details);
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', 'JCCNkRAJ4RRAe0opTVGwdhW8');
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }

        })
    },
    changePaymentStatus: (orderId, crrStatus) => {
        console.log(orderId);
        return new Promise((resolve, reject) => {
            dB.get().collection('orders').updateOne({ _id: ObjectId(orderId) }, { $set: { status: crrStatus } }).then((resp) => {
                console.log(resp);
                resolve(resp)
            })
        })
    },
    editUserDetail: (id, info) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('userData').updateOne({ _id: ObjectId(id) }, { $set: { firstName: info.firstName, lastName: info.lastName, email: info.email, password: info.password, confirmPassword: info.confirmPassword } }).then(() => {
                resolve();
            })
        })
    },
    getUser: (id) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('userData').findOne({ _id: ObjectId(id) }).then((resp) => {
                resolve(resp)
            })
        })
    }, wishlist: (userId, proId) => {
        return new Promise(async (resolve, reject) => {
            let checkWishlist = await dB.get().collection('wishlist').findOne({ userId: ObjectId(userId) })



            if (checkWishlist != null) {
                console.log("hey::::::::::");
                checkWishlist.product.forEach(document => {
                    console.log("this is document", document)
                    if (document == proId) {
                        checkWishlist = "alreadyHave";
                    }
                });
                if (checkWishlist == "alreadyHave") {
                    resolve(checkWishlist)
                } else {
                    dB.get().collection('wishlist').updateOne({ userId: ObjectId(userId) }, { $push: { product: ObjectId(proId) } })
                    resolve(checkWishlist)
                }

            } else {
                dB.get().collection('wishlist').insertOne({ userId: ObjectId(userId), product: [ObjectId(proId)] })
                resolve(checkWishlist);
            }

        })
    },
    getWishlist: (userId) => {
        return new Promise(async (resolve, reject) => {
            await dB.get().collection('wishlist').findOne({ userId: ObjectId(userId) }).then((resp) => {
                resolve(resp)
            }).catch(() => {
                reject()
            })
        })
    },
    getWishlistProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await dB.get().collection('wishlist').aggregate([
                {
                    $match: { userId: ObjectId(userId) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'wishlistProducts'
                    }
                },
                {
                    $unwind: '$wishlistProducts'
                },

            ]).toArray()

            resolve(wishlist)
        })
    },
    removeWishlist: (userId, proId) => {
        return new Promise((resolve, reject) => {

            // dB.get().collection('cart').updateOne({userId:ObjectId(userId)},{$pull:{'product':ObjectId(proId)}}).then(()=>{
            //     return resolve();
            // })


            dB.get().collection('wishlist').findOne({
                userId: ObjectId(userId)
            }).then((doc) => {
                let index;
                for (let i = 0; i < doc.product.length; i++) {
                    if (doc.product[i].toString() == proId) {
                        index = i;
                    }
                }

                if (index > -1) {
                    doc.product.splice(index, 1); // 2nd parameter means remove one item only
                }
                console.log(doc);

                dB.get().collection('wishlist').updateOne({ userId: ObjectId(userId) }, { $set: { product: doc.product } })
            })
            resolve()
        })
    },
    addCategoryOffer: (details) => {
        return new Promise(async(resolve, reject) => {
            let check = await dB.get().collection('categoryOffer').findOne({offercategory:details.offercategory})
            if(check==null){

                dB.get().collection('categoryOffer').insertOne(details).then(() => {
                    resolve()
                })
            }else{
                resolve()
            }
        })
    },
    getCategoryOffer: () => {
        return new Promise(async (resolve, reject) => {
            let categoryOffer = await dB.get().collection('categoryOffer').find().toArray();
            resolve(categoryOffer);
        })
    },
    insertCategoryOffer: (ctgry, discount, validity) => {
        console.log(ctgry, discount, validity)
        return new Promise(async (resolve, reject) => {
            let products = await dB.get().collection('products').find({ id: ctgry }).toArray()


            products.map(async (pro) => {
                console.log(pro, "first")
                let productprice = pro.productprice
                let OfferPrice = productprice - ((productprice * discount) / 100)
                console.log(pro, "second")
                OfferPrice = parseInt(OfferPrice.toFixed(2))
                let proId = pro._id;

                if(pro.categoryOffer=='false'&&pro.productOffer=='false'){

                    await dB.get().collection('products').updateOne(
                        {
                            _id: ObjectId(proId)
                        },
                        {
                            $set: {
                                productprice: OfferPrice,
                                categoryOffer: 'true',
                                OldPrice: productprice,
                                categoryDiscount: parseInt(discount)
                            }
                        })
                        resolve({status:true})
                }
                else if(pro.categoryOffer=='false'&&pro.productOffer=='true'){

                    let productprice = pro.OldPrice
                    let OfferPrice = productprice - ((productprice * discount) / 100);
                    OfferPrice = parseInt(OfferPrice.toFixed(2))

                    if(OfferPrice< pro.productprice){

                        await dB.get().collection('products').updateOne(
                            {
                                _id: ObjectId(proId)
                            },
                            {
                                $set: {
                                    productprice: OfferPrice,
                                    categoryOffer: 'true',
                                    OldPrice: productprice,
                                    categoryDiscount: parseInt(discount)
                                }
                            })
                            resolve({status:true})
                    }else{
                        await dB.get().collection('products').updateOne(
                            {
                                _id: ObjectId(proId)
                            },
                            {
                                $set: {
                                    
                                    categoryOffer: 'true',
                                    
                                    categoryDiscount: parseInt(discount)
                                }
                            })
                            resolve({status:true})
                    }

                }
                else{
                    console.log("already have")
                    let msg = "Category offer already added"
                    resolve({status:true,msg})
                }

            })


        })
    },
    addProductOffer: (details) => {
        return new Promise((resolve, reject) => {
            dB.get().collection('categoryOffer').insertOne(details).then(() => {
                resolve()
            })
        })
    },
    getProductOffer: () => {
        return new Promise(async (resolve, reject) => {
            let productOffer = await dB.get().collection('productOffer').find().toArray();
            resolve(productOffer);
        })
    },
    insertProductOffer: (proId, discount, validity) => {
        return new Promise(async (resolve, reject) => {
            let pro = await dB.get().collection('products').findOne({_id: ObjectId(proId)})
            let productprice = pro.productprice
                let OfferPrice = productprice - ((productprice * discount) / 100);
                OfferPrice = parseInt(OfferPrice.toFixed(2))
                console.log("productttttofferr",pro.categoryOffer,pro.productOffer);
            if(pro.categoryOffer=='false'&&pro.productOffer=='false'){
                await dB.get().collection('products').updateOne(
                    {
                        _id: ObjectId(proId)
                    },
                    {
                        $set: {
                            productprice: OfferPrice,
                            productOffer: 'true',
                            OldPrice: productprice,
                            productDiscount: parseInt(discount)
                        }
                    })
                    resolve({status:true})
            }
            else if(pro.categoryOffer=='true'&&pro.productOffer=='false'){
                let productprice = pro.OldPrice
                let OfferPrice = productprice - ((productprice * discount) / 100);
                OfferPrice = parseInt(OfferPrice.toFixed(2))
                if(OfferPrice< pro.productprice){

                    await dB.get().collection('products').updateOne(
                        {
                            _id: ObjectId(proId)
                        },
                        {
                            $set: {
                                productprice: OfferPrice,
                                productOffer: 'true',
                                OldPrice: productprice,
                                productDiscount: parseInt(discount)
                            }
                        })
                        resolve({status:true})
                }else{
                    await dB.get().collection('products').updateOne(
                        {
                            _id: ObjectId(proId)
                        },
                        {
                            $set: {
                                
                                productOffer: true,
                                productDiscount: parseInt(discount)
                            }
                        })
                        resolve({status:true})
                }
            }
            else{
                console.log("product offer already added")
                let msg = "Category offer already added"
                    resolve({status:true,msg})
            }
        })
    },
    deleteCategoryOffer:(ctgry,id)=>{
        return new Promise(async(resolve,reject)=>{
            let products = await dB.get().collection('products').find({ id: ctgry }).toArray()
            products.map(async(pro)=>{
                let proId = pro._id
                let productprice = pro.OldPrice;
                if(pro.productOffer=='true'){
                    let discount = pro.productDiscount;
                    let OfferPrice = productprice - ((productprice * discount) / 100)
                    await dB.get().collection('products').updateOne(
                        {
                            _id: ObjectId(proId)
                        },
                        {
                            $set: {
                                productprice: OfferPrice,
                                categoryOffer: 'false',
                                categoryDiscount: ""
                            }
                        }).then(()=>{
                            dB.get().collection('categoryOffer').deleteOne({_id:ObjectId(id)}).then(()=>{

                                resolve({status:true})
                            })
                        })
                }else{
                    await dB.get().collection('products').updateOne(
                        {
                            _id: ObjectId(proId)
                        },
                        {
                            $set: {
                                productprice: productprice,
                                categoryOffer: 'false',
                                categoryDiscount: ""
                            }
                        }).then(()=>{
                            dB.get().collection('categoryOffer').deleteOne({_id:ObjectId(id)}).then(()=>{

                                resolve({status:true})
                            })
                        })
                        
                }
            })
        })
    },
    deleteProductOffer:(ctgry)=>{
        return new Promise(async(resolve,reject)=>{
            let products = await dB.get().collection('products').find({ id: ctgry }).toArray()
            products.map(async(pro)=>{
                if(pro.productOffer=='true'){
                    let discount = pro.productDiscount;
                    let productprice = pro.OldPrice;
                    let OfferPrice = productprice - ((productprice * discount) / 100)
                    await dB.get().collection('products').updateOne(
                        {
                            _id: ObjectId(proId)
                        },
                        {
                            $set: {
                                productprice: OfferPrice,
                                categoryOffer: 'false',
                                categoryDiscount: ""
                            }
                        })
                        resolve({status:true})
                }else{
                    await dB.get().collection('products').updateOne(
                        {
                            _id: ObjectId(proId)
                        },
                        {
                            $set: {
                                productprice: productprice,
                                categoryOffer: 'false',
                                categoryDiscount: ""
                            }
                        })
                        resolve({status:true})
                }
            })
        })
    }

}
