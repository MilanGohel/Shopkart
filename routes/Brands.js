const express = require('express');

const { fetchAllBrands, createBrands } = require('../controller/Brands');

const router = express.Router();

// Routes

router.get('/fetchAllBrands',fetchAllBrands)
        .post('/createBrand',createBrands)

exports.router = router;