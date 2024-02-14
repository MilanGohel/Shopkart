const express = require('express');
const { createCategory,fetchAllCategories } = require('../controller/Category');

const router = express.Router();

// Routes

router.get('/fetchAllCategories',fetchAllCategories)
        .post('/createCategory',createCategory)

exports.router = router;