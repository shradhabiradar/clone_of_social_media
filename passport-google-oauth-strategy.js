const passport = require('passport');
const googleStrategay = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user')

passport.use(new googleStrategay({
        clientID: '659225501700-4s3fva8sgjsbsr6u3qia9bahq6vc3igr.apps.googleusercontent.com',
        clientSecret: 'U4vFB4cRoixKt3VO6TPTAtag',
        callbackURL: 'http://localhost:7000/users/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done){
        User.findOne({emai: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log('error in finding the user', err); return;}

            if(user){
                return done(null, user);
            }else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){console.log('error in creating the user'); return;}

                    return done(null, user);
                });
            }
        });
    }
));


module.exports = passport;