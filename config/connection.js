const MongodbClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const state ={
    db:null
}

module.exports.connect = (callback)=>{
    const url = process.env.MONGO_URI;
    const dbname = 'outfits';

    MongodbClient.connect(url, {useUnifiedTopology: true}, (err,data)=>{
        if(err){
            return callback(err)
        }
        state.db=data.db(dbname)
        callback()
    })
}

module.exports.get = ()=>{
    return state.db
}