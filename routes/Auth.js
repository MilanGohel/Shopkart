const express = require('express');
const { loginUser,createUser,logout, checkAuth, resetPasswordRequest, resetPassword } = require('../controller/Auth');
// const { fetchLoggedInUserInfo, updateUser, fetchLoggedInUserOrders } = require('../controller/User');
// // const {createProduct, fetchAllProducts, fetchProductById, updateProductById} = require('../controller/Product')
const passport = require('passport');

const router = express.Router();

// Routes

router.post('/signup',createUser)
        .post('/login',passport.authenticate('local'),loginUser)
        .get('/check',passport.authenticate('jwt'),checkAuth)
        .post('/logout',logout)
        .post('/reset-password-request', resetPasswordRequest)
        .post('/reset-password',  resetPassword)
        

exports.router = router;