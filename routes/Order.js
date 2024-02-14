const express = require('express');
const { createOrder, deleteOrder, updateOrder, fetchLoggedInUserOrders, fetchAllOrders } = require('../controller/Order');

const router = express.Router();

// Routes

router.get('/',fetchLoggedInUserOrders)
        .post('/',createOrder)
        .delete('/:id',deleteOrder)
        .patch('/:id',updateOrder)
        .get('/admin',fetchAllOrders)

exports.router = router;