const {Cart} = require('../models/Cart')
exports.addToCart = async (req,res) =>{
    const {id} = req.user;
    const cart = new Cart({...req.body, user: id});
    // const product = new Cart(req.body);
    try{
        const doc = await cart.save();
        const result = await doc.populate('product');

        res.status(200).json(result);
    }
    catch(error){
        res.status(400).json(error);
    }
}

exports.fetchItemsByUserId = async (req,res) =>{
    const {id} = req.user;
    try{
        const cartItems = await Cart.find({user: id}).populate('product');
        res.status(200).json(cartItems);
    }
    catch(error){
        console.log(error);
        res.status(400).json(error);
    }
}
exports.updateCart = async (req,res) =>{
    const {id} = req.params;
    try{
        const cartItems = await Cart.findByIdAndUpdate(id,req.body , {new: true});
        res.status(200).json(cartItems);
    }
    catch(error){
        console.log(error);
        res.status(400).json(error);
    }
}
exports.deleteItemFromCart = async (req,res) =>{
    const {id} = req.params;
    try{
        const response = await Cart.findByIdAndDelete(id);
        res.status(200).json(response);
    }
    catch(error){
        console.log(error);
        res.status(400).json(error);
    }
}