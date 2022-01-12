const{ObjectId, Db} = require('mongodb');
const dB = require('../config/connection');

module.exports = {

    userRegistration:(userData)=>{
        return new Promise((resolve,reject)=>{
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
            let user = await dB.get().collection('userData').findOne({userName:loginCredential.userName,password:loginCredential.password})
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
            let user = await dB.get().collection('userData').findOne({phoneNumber:number.phoneNumber})
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
            let user = await dB.get().collection('userData').findOne({email:email})
            if(user){
                console.log("hey got it ");
                return resolve({status:true,user})
            }
            else{
                console.log("got it but failure");
                return resolve({status:false})
            }
        })
    }
}