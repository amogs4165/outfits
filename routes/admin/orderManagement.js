const express = require('express');
const router = express.Router();
const helper = require('../../helper/connectionHelper')

router.get('/',(req,res)=>{
    let admin = req.session.admin
    helper.getOrders().then((resp)=>{
        let orders = resp;
        res.render('admin/orderManagement',{admin,orders})

    })
    
})

router.post('/',(req,res)=>{

    console.log("heyyyyy")
    console.log(req.body)
    let id = req.body.id;
    let status = req.body.status
    helper.updateOrderStatus(id,status).then(()=>{

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