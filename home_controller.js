const Post = require('../models/post')
const User = require('../models/user')

module.exports.home = async function(req, res){

    // console.log(req.cookies)
    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: 'home page',
    //         posts: posts
    //     })
    // })

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        },
        populate:{
            path: 'likes'
        }
    }).populate('likes')
        let users = await User.find({})
        User.find({}, function(err, users){
            return res.render('home', {
                title: 'home page',
                posts: posts,
                all_user: users
            });
        })
        

    }catch(err){
        console.log('Error', err);
        return;
    }
    
}