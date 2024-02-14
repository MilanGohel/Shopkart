const express = require('express');
const { fetchLoggedInUserInfo, updateUser, fetchLoggedInUserOrders } = require('../controller/User');
// const {createProduct, fetchAllProducts, fetchProductById, updateProductById} = require('../controller/Product')

const router = express.Router();

// Routes

router.get('/',fetchLoggedInUserInfo)
        .patch('/:id',updateUser)

        

exports.router = router;