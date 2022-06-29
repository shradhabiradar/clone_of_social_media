const passport = require('passport');

const passportLocal = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new passportLocal({
    usernameField: 'email',
    passReqToCallback: true
},function(req, email, password, done){
    User.findOne({email: email}, function(err, user){
        if(err){
            req.flash('error', err);
            return done(err);
        }

        if(!user || user.password != password){
            req.flash('error', 'Invalid username or password')
            return done(null, false);
        }

        return done(null, user);
    })
}
));


// serializing the user
passport.serializeUser(function(user, done){
    done(null, user.id)
});

//deserialising the user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){console.log('error in finding the user ---> passport'); return done(err);}
        done(null, user);
    })
});


passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;