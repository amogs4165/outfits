const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{
    let admin = req.session.admin
    helper.getOrders().then((resp)=>{
        let orders = resp;
        console.log(orders);
        res.render('admin/orderManagement',{admin,orders})

    })
    
})

module.exports = router;


// timestamp date converting codde

// db.collection.aggregate([
//     { "$project": {
//       "_id": {
//         "$toDate": {
//           "$toLong": "$_id"
//         }
//       }
//     }},
//     { "$group": {
//       "_id": { "$dateToString": { "format": "%Y-%m-%d", "date": "$_id" } },
//       "count": { "$sum": 1 }
//     }}
//   ])