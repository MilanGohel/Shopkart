require('dotenv').configDotenv()
const express = require('express');
const { mongoose } = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require('cookie-parser');
const { createProduct } = require('./controller/Product');
const path = require('path');
const server = express();
const productsRouters = require('./routes/Products');//default router can be imported using any name
const categoriesRouters = require('./routes/Category')
const brandsRouters = require('./routes/Brands');
const userRouters = require('./routes/User')
const authRouters = require('./routes/Auth')
const cartRouters = require('./routes/Cart')
const orderRouters = require('./routes/Order');
const cors = require('cors');
const { cookieExtractor, isAuth, sanitizeUser } = require('./services/common');
const { User } = require('./models/User');

server.use(express.static(path.resolve(__dirname,'dist')))
// Options of jwt
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;
// middlewares
server.use(cookieParser());
server.use((
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
    })
));
server.use(passport.authenticate('session'));
server.use(cors({
    exposedHeaders: ['X-Total-Count']
}))
server.use(express.json())
server.use('/products',isAuth(),productsRouters.router);
server.use('/categories',isAuth(),categoriesRouters.router);
server.use('/brands',isAuth(),brandsRouters.router);
server.use('/users',isAuth(),userRouters.router)
server.use('/auth',authRouters.router)
server.use('/cart',isAuth(),cartRouters.router);
server.use('/order',isAuth(),orderRouters.router);


server.get('/',(req,res) =>{
    res.json({status: 'success'});
})
// this will redirect the react router in case of other router does not match
server.get('*', (req, res) =>
res.sendFile(path.resolve('dist', 'index.html'))
);


// passport js strategies
passport.use(
    'local',
    new LocalStrategy({usernameField: 'email'}, async function(
        email,password, done
    ){
        try{
            const user = await User.findOne({email})
            if(!user){
                return done(null, false, {message: 'invalid credentials'});
            }

            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                'sha256',
                async function(err, hashedPass){
                    
                    if(!crypto.timingSafeEqual(user.password, hashedPass)){
                        return done(null, false, {message: 'invalid credentials'})
                    }

                    const token = jwt.sign(
                        sanitizeUser(user),
                        process.env.JWT_SECRET_KEY
                    );
                    done(null, {id: user.id, role: user.role, token});
                }
            )
        }
        catch(error){
            done(error);
        }
    })
)


passport.use(
    'jwt',
    new JWTStrategy(opts, async function(jwt_payload, done) {
        try{
            const user = await User.findById(jwt_payload.id);
            if(user){
                return done(null, sanitizeUser(user));
            }
            else{
                return done(null, false);
            }

        }
        catch(error){
            return done(error,false);
        }
    })
)

// Session establishment
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, role: user.role, name: user.name });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
// JWT options
main().catch(error => console.log(error))
async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected")
}
server.listen(process.env.PORT, () =>{
    console.log('server listening on '+process.env.PORT);
})