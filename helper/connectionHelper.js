const { response } = require('express');
const async = require('hbs/lib/async');
const{ObjectId, Db} = require('mongodb');
const dB = require('../config/connection');

module.exports = {

    userRegistration:(userData)=>{
        return new Promise((resolve,reject)=>{
            userData.status=true;
            dB.get().collection('userData').insertOne(userData).then(()=>{
                return resolve(true)
            })
            .catch(()=>{
                return reject(false)
            })
        })
    },
    userVerify:(loginCredential)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await dB.get().collection('userData').findOne({userName:loginCredential.userName,password:loginCredential.password,status:true})
            if(user){
                return resolve ({status:true,user})
            }
            else{
                return resolve ({status:false})
            }
        })
    },
    loginUserdetailWithNum:(number)=>{
        return new Promise(async(resolve,reject)=>{
            await dB.get().collection('userData').findOne({phoneNumber:number}).then((user)=>{
                console.log(user,"heey this is the user detials logged in by number")
                return resolve(user)
            })
        })
    },
    verifyMobileNum:(number)=>{
        return new Promise(async(resolve,reject)=>{
            console.log("hey"+number.phoneNumber)
            let user = await dB.get().collection('userData').findOne({phoneNumber:number.phoneNumber,status:true})
            if(user){
                console.log("got it sucees")
                return resolve({status:true,user})
            }
            else{
                console.log("got it failure");
                return resolve({status:false})
            }
        })
    },
    checkEmail:(email)=>{
        return new Promise(async(resolve,reject)=>{
            console.log("heyeyeyeyey"+email)
            let user = await dB.get().collection('userData').findOne({email:email,status:true})
            if(user){
                console.log("hey got it ");
                return resolve({status:true,user})
            }
            else{
                console.log("got it but failure");
                return resolve({status:false})
            }
        })
    },
    getuserDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            var userDetails =await dB.get().collection('userData').find().toArray();

            if(userDetails){
                return resolve({userDetails,status:true})
            }
            else{
                return resolve({staus:false})
            }
        })
  
    },
    userBlock:(id)=>{
        return new Promise((resolve,reject)=>{
            dB.get().collection('userData').updateOne({_id:ObjectId(id)},{
                $set:{
                    status:false
                }}).then(()=>{
                    
                    return resolve(true)

                })
                .catch(()=>{
                    return reject(false)
                })
        })
    },
    userUnblock:(id)=>{
        return new Promise((resolve,reject)=>{
            dB.get().collection('userData').updateOne({_id:ObjectId(id)},{
                $set:{
                    
                    status:true
                    
                }})
                .then(()=>{
                    
                    return resolve(true)
                })
                .catch(()=>{
                    return resolve(false)
                })
        })
    },
    userDelete:(id)=>{
        return new Promise((resolve,reject)=>{
            dB.get().collection('userData').deleteOne({_id:ObjectId(id)}).then(()=>{
                return resolve(true)
            })
            .catch(()=>{
                return reject(false)
            })
        })
    },
    checkCategory:(category)=>{
        return new Promise (async(resolve,reject)=>{
            console.log(category.categoryName);
            
            await dB.get().collection('category').findOne({categoryName:category.categoryName}).then((catt)=>{
                console.log("hii",catt);
                if(catt){
                    return resolve(true)
                }
                else{
                    return resolve(false)
                }
            
            })
            
          
        })
    },
    addCategory:(category)=>{
        return new Promise((resolve,reject)=>{
            dB.get().collection('category').insertOne(category).then(()=>{
                return resolve(true)
            }).catch(()=>{
                return reject(false)
            })
        })
    },
    getCategory:()=>{
        return new Promise((resolve,reject)=>{
            let catt = dB.get().collection('category').find().toArray();
            return resolve(catt);
        })
    },
    addSubCategory:(data)=>{
        return new Promise((resolve,reject)=>{
            let id = data.category;
            let subCategory = data.subCategoryName;
            console.log(id,subCategory);
            dB.get().collection('subcategory').insertOne({subCategory,category:ObjectId(id)}).then(()=>{
                return resolve();
            }).catch(()=>{
                return reject();
            })
        })
    },
    checkSubCategory:(data)=>{
        return new Promise((resolve,reject)=>{
            console.log(data)
           dB.get().collection('subcategory').findOne({subCategory:data}).then((ifData)=>{
               if(ifData){
                   return resolve(true);
               }
               else{
                   return resolve(false);
               }
           }) 
        })
    },
    getCategoryDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let cattDetails = await dB.get().collection('category').find().toArray();
            if(cattDetails){
                return resolve({status:true,cattDetails})
            }
            else{
                return resolve({status:false})
            }
        })
    },
    getSubcategoryDetails:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let cattDetails = await dB.get().collection('subcategory').find({category:ObjectId(id)}).toArray();
            if(cattDetails){
                return resolve({status:true,cattDetails})
            }
            else{
                return resolve({status:false})
            }
        })
    },
    getSCategoryDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let cattDetails = await dB.get().collection('subcategory').find().toArray();
            if(cattDetails){
                return resolve({status:true,cattDetails})
            }
            else{
                return resolve({status:false})
            }
        })
    },
    addProduct:(product,callback)=>{
       
        dB.get().collection('products').insertOne(product).then((data)=>{
            console.log(data);
            callback(data.insertedId)
        })
        
    },
    getProducts:()=>{
        console.log('im here 1')
        return new Promise(async(resolve,reject)=>{
            let products = await dB.get().collection('products').find().toArray()
            
                console.log((products));
            if(products){
                return resolve(products)
            }
            
        })
        
    },
    verifyAdmin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let admin = await dB.get().collection('admin').findOne({adminName:data.adminName,password:data.password})
            if(admin){
                return resolve({status:true})
            }
            else{
                return resolve({status:false})
            }
        })
    },
    getProductDetailsById:(id)=>{
        return new Promise((resolve,reject)=>{
            dB.get().collection('products').findOne({_id:ObjectId(id)}).then((product)=>{
                resolve (product)
            })
        })
    },
    updateProduct:(id,productDetails)=>{
        return new Promise((resolve,reject)=>{
            dB.get().collection('products').updateOne({_id:ObjectId(id)},{
                $set:{
                    productname:productDetails.productname,
                    manufacturerbrand:productDetails.manufacturerbrand,
                    productsize:productDetails.productsize,
                    productprice:productDetails.productprice,
                    manufacturerquantity:productDetails.manufacturerquantity
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    deleteProduct:(id)=>{
        return new Promise((resolve,reject)=>{
            dB.get().collection('products').deleteOne({_id:ObjectId(id)}).then(()=>{
                resolve()
            })
        })
    },
    getSpecificProduct:(id)=>{
        return new Promise((resolve,reject)=>{
            dB.get().collection('products').findOne({_id:ObjectId(id)}).then((resp)=>{
                return resolve(resp);
            })
        })
    },
    addToCart:(userId,productId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart = await dB.get().collection('cart').findOne({userId: ObjectId(userId)})

            if(userCart){
                let product = await dB.get().collection('cart').findOne({productId: ObjectId(productId)})
                if(product){
                    
                }
                else{
                    dB.get().collection('cart').updateOne({userId:ObjectId(userId)},
                    {
                        
                            $push:{productId:ObjectId(productId)}
                        
                    }).then(()=>{
                        return resolve()
                    })
                }
                
            }
            else{
                dB.get().collection('cart').insertOne({userId:ObjectId(userId),productId:[ObjectId(productId)]}).then(()=>{
                    return resolve();
                })
            }
           
        })
    },
    userCart:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await dB.get().collection('cart').aggregate([
                {
                    $match:{userId:ObjectId(userId)}
                },
                {
                    $lookup:{
                        from:'products',
                        
                        let:{prodList:'$productId'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].productId)
        })
    }
}
