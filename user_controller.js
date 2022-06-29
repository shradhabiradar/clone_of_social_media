const User = require('../models/user')
const fs = require('fs');
const path = require('path')


module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'profile',
            profile_user: user,
        })
    })
    
}

module.exports.update = async function(req, res){

    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('*******error', err);
                }
                
                user.name = req.body.name,
                user.email = req.body.email

                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar))
                    }
                    user.avatar = User.avatarpath + "/" + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })

        }catch(error){
            req.flash('error', 'error while connecting');
            return res.redirect('back');
        }
        // User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
        //     return res.redirect('back')
        // })
    }else{
        req.flash('error', 'Unauthorised')
        return res.status(401).send('Unauthorised');
    }
}

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up', {
        title: 'sign up'
    })
}

module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in', {
        title: 'sign In'
    })
}

module.exports.create = function(req, res){
    if(req.body.password  != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email : req.body.email}, function(err, user){
        if(err){console.log('error in signing up'); return;}
        
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in signing up'); return;}
                return res.redirect('/users/sign-in')
            });
        }else{
            return res.redirect('back');
        }
    });

}

module.exports.createSession = function(req, res){
    req.flash('success', 'logged in successfully')
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'you have logged out')

    return res.redirect('/')
}