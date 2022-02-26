const MongodbClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const state = {
    db: null
}

module.exports.connect = (callback) => {
    const url = process.env.MONGO_URI;
    // const url = 'mongodb://localhost:27017';
    const dbname = 'outfits';

    MongodbClient.connect(url, {
        useUnifiedTopology: true, useNewUrlParser: true
    }, (err, data) => {
        if (err) {
            return callback(err)
        }
        state.db = data.db(dbname)
        callback()
    })
}

module.exports.get = () => {
    return state.db
}