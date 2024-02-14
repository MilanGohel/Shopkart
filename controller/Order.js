const { Order } = require("../models/Order");
const { Product } = require("../models/Product");

exports.createOrder = async (req,res) =>{
    const order = new Order(req.body);
    for(let item of order.products){

        let product = await Product.findOne({_id: item.product.id});
        product.$inc('stock', -1*item.quantity);

        await product.save();
    }
    order.save().then(
        (doc) =>{
            res.status(201).json(doc);
        })
        .catch((err) => {console.log(err)});

}


exports.updateOrder = async (req,res) =>{
    const {id} = req.params;
   
    try{
        
        const order = await Order.findByIdAndUpdate(id,req.body,{new: true,runValidators: true});
    
        // console.log(product);
        if(!order){
            res.status(400).json({"error":"Order Not Updated"});
        }
        res.status(200).json(order);
    }
    catch(error){
        res.status(400).json(error);
    } 
}

exports.fetchAllOrders = async (req,res) =>{
    // const {_sort, _order,_pagination} = req.query;
    let query = Order.find({deleted: {$ne: true}});

  let totalOrdersQuery = Order.find({deleted: {$ne: true}});
   

    if(req.query._sort && req.query._order){
        query = query.sort({[req.query._sort]: req.query._order});
    }

    const totalCount = await totalOrdersQuery.count().exec();
    // console.log(totalCount);
    if(req.query._page && req.query._limit){
        const page = req.query._page;
        const limit = req.query._limit;
        query = query.skip(limit*(page-1)).limit(limit);
    }
//   console.log(req.query);

    try{
        const docs = await query.exec();
        res.set('X-Total-Count',totalCount);
        res.status(200).json(docs);
    }
    catch(err){
        res.status(400).json(err);
    }
}
exports.deleteOrder = async (req,res) =>{
    const {id} = req.params;
    try {
        const order = await Order.findByIdAndDelete(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json(error);
    }
}
exports.fetchLoggedInUserOrders = async (req,res) =>{
    // TODO: 
    const {id} = req.user;
    try {
        const orders = await Order.find({user: id}).populate('user');
        // console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json(error);   
    }
}