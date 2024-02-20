// const { Brands } = require('../models/Brands');
const {User} = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {sanitizeUser, sendMail} = require('../services/common');
const { response } = require('express');

exports.loginUser = async (req,res) =>{
    const user = req.user;
    
    res
        .cookie('jwt',user.token,{
            expires: new Date(Date.now() + 7200000),
            httpOnly: true,
        })
        .status(201)
        .json({id: user.id, role: user.role});
    // try{
        
    //     const user = await User.findOne({email: req.body.email});
    //     // console.log(user);
       
    //     if(!user){
    //         res.status(401).json({message: "no such email address."});
    //     }
    //     else if(user.password === req.body.password ){
    //         res.status(200).json(user);
    //     }
    //     else{
    //         res.status(401).json({message: 'Invalid Credentials.'});
    //     }
    // }
    // catch(error){
    //     res.status(400).json(error);
    // }
}

exports.createUser = async (req,res) =>{
    try{
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            'sha256',
            async function (err, hashedPass){
                const user = new User({...req.body, password: hashedPass, salt});
                const doc = await user.save();

                req.login(sanitizeUser(doc), (err) =>{
                    if(err){
                        res.status(400).json(err);
                    }
                    else{
                       const token = jwt.sign(
                        sanitizeUser(doc),
                        process.env.JWT_SECRET_KEY
                       );
                    //    console.log(token);
                       res
                        .cookie('jwt', token, {
                            expires: new Date(Date.now() + 7200000),
                            httpOnly: true
                        })
                        .status(201)
                        .json({id: doc.id, role: doc.role})
                    }
                })                
            }
        )
    
    }
    catch(error){
        console.log(error);
        res.status(400).json(error);
    }
}
exports.logout = async (req,res) =>{
    
    try{
       res.cookie('jwt', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
       }) 
       .sendStatus(200)
    }
    catch(error){
        // console.log(error);
        res.status(400).json(error);
    }
}

exports.checkAuth = async (req,res) =>{
    if(req.user){
        res.json(req.user);
    }
    else{
        res.sendStatus(401);
    }
}

exports.resetPasswordRequest = async (req,res) =>{
    const email = req.body.email;
    // console.log(req.body);

    const user = await User.findOne({email: email});
    // console.log(user);
    if(user){
        const token = crypto.randomBytes(48).toString('hex');
        user.resetPasswordToken = token;
        await user.save();

        const resetPageLink = `https://shopkart-lac.vercel.app/reset-password?token=${token}&email=${email}`;
        
        const subject = 'reset password for shopkart';
        const html = `<p>click <a href='${resetPageLink}'> here </a> to Reset Password</p>`;

        if(email){
            const response = await sendMail({to: email, subject,html: html});
            res.json(response);
        }
        else {

            res.sendStatus(400);
        }
    }
    else{

        res.sendStatus(400);
    }
}

exports.resetPassword = async (req, res) =>{
    const {email, password, token} = req.body;
    console.log(password)
    const user = await User.findOne({email: email, resetPasswordToken: token});
    console.log(user + "found")
    if(user){
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            password,
            salt,
            310000,
            32,
            'sha256',
            async function(err, hashedPass){
                user.password = hashedPass;
                user.salt = salt;
                await user.save();
                const subject = 'password successfully reset for shopkart';
                const html = `<p> Successfully able to Reset Password</p>`
                if(email){
                    const response = await sendMail({to : email, subject, html});
                    res.json(response);
                }
                else{
                    res.sendStatus(400);
                }
            }
        )
    }
    else{
        res.sendStatus(400);
    }
}