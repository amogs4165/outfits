const { response } = require('express');
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
    }
}
