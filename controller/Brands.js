const { Brands } = require('../models/Brands');
exports.fetchAllBrands = async (req,res) =>{
    try{
        const brands = await Brands.find({}).exec();
        res.status(200).json(brands);
    }
    catch(error){
        res.status(400).json(error);
    }
}

exports.createBrands = async (req,res) =>{
    const brand = new Brands(req.body);
    try{
        const doc = brand.save();
        res.status(201).json(brand);
    }
    catch(error){
        console.log(error);
        res.status(400).json(error);
    }
}