const {Product} = require('../models/Product')
exports.createProduct = (req,res) =>{
    const product = new Product(req.body);
    product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
    product.save().then(
        (doc) =>{
            res.status(201).json(doc);
        })
        .catch((err) => {console.log(err)});

}

exports.fetchAllProducts = async (req,res) =>{
    // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}

  let conditions = {};
  if(!req.query.admin){
    conditions.deleted = {$ne: true};
  }
// console.log(req.query)
  let query = Product.find(conditions);

  let totalProductsQuery = Product.find(conditions);
    if(req.query.category){
        query = query.find({category: {$in:req.query.category.split(',')}});
        totalProductsQuery = totalProductsQuery.find({category: {$in:req.query.category.split(',')}});
    }
    if(req.query.brand){
        // console.log(query + "this is query") ;
        // console.log(req.query.brand.split(','))
        query = query.find({brand: {$in: req.query.brand.split(',')}});
        totalProductsQuery = totalProductsQuery.find({brand: {$in: req.query.brand.split(',')}});
        // console.log(totalProductsQuery)
    }

    if(req.query._sort && req.query._order){
        query = query.sort({[req.query._sort]: req.query._order});
    }

    const totalCount = await totalProductsQuery.count().exec();
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
exports.fetchProductById = async (req,res) =>{
    const {id} = req.params;
    // console.log(id);
    try{
        const product = await Product.findById(id);
        // console.log(product);
        if(!product){
            res.status(400).json({"error":"Product Not Found"});
        }
        res.status(200).json(product);
    }
    catch(error){
        res.status(400).json(error);
    } 
}
exports.updateProductById = async (req,res) =>{
    const {id} = req.params;
    // console.log(id);
    try{
        // let error = await req.body.validateSync();
        // console.log(error);
        // assert.equal(error.errors['rating'].message,'rating must be between 0 to 5.');
        const product = await Product.findByIdAndUpdate(id,req.body,{new: true,runValidators: true});
    
        // console.log(product);
        if(!product){
            res.status(400).json({"error":"Product Not Updated"});
        }
        res.status(200).json(product);
    }
    catch(error){
        res.status(400).json(error);
    } 
}