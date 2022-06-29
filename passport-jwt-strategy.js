const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');


let opts = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: "codeial"
}


passport.use(new JWTstrategy(opts, function(jwtpayload, done){
    User.findById(jwtpayload._id, function(err, user){
        if(err){
            console.log('error', err);
            return
        }
        if(user){
            return done(null, user)
        }else{
            return(null, false)
        }
    })
}))

module.exports = passport;