// const { Category } = require('../models/Category');
const { User } = require('../models/User')
// exports.fetchLoggedInUserOrders = async (req,res) =>{
//     try{
//         const categories = await Category.find({}).exec();
//         res.status(200).json(categories);
//     }
//     catch(error){
//         res.status(400).json(error);
//     }
// }

exports.updateUser = async (req,res) =>{
    const {id} = req.params;

    try{
    const user = await User.findByIdAndUpdate(id,req.body, {new: true});

    res.status(201).json(user);
    }
    catch(error){
        res.status(400).json(error);
    }
}
exports.fetchLoggedInUserInfo = async (req,res) =>{
    const {id} = req.user;
    try{
       const user = await User.findById(id);
       res.status(200).json({id: user.id, addresses: user.addresses, email: user.email, role: user.role});
    }
    catch(error){
        res.status(400).json(error);
    }
}