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
                return reject ({status:false})
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
}