const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');



module.exports.postContent = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post,
                },
                messge: "post has been created"
            })
        }
        req.flash('success', 'post created')
        return res.redirect('back');
    }catch(err){
        console.log('error', err)
    }
}


module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id)

        if(post.user == req.user.id){
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}})
        }
        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    }, message: "Post deleted successfully"
                })
            }
            req.flash('success', 'post deleted')
            return res.redirect('back')
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('error', err);
        return;
    }
}