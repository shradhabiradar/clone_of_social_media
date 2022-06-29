const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer = require('../mailers/comments_mailer')
const queue = require('../config/kue')
const commentEmailWorker = require('../workers/comments_worker');
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });
       
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();
            // commentMailer.newComment(comment)
           let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in creating a job', err)
                }
                console.log(job.id)
            })

            req.flash('success', 'comment created');
            return res.redirect('/');
        
        }
    }catch(err){
        console.log('error', err);
        return;
    }
}

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user = req.user.id){
            let postId = comment.post;
            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});

            await Like.deleteMany({likeable: comments._id, onModel: 'Comment'})
            req.flash('success', 'comment deleted')
            return res.redirect('back')
        
        }else{
            return res.redirect('back');
        }
    
    }catch(err){
        console.log('error', err);
        return;
    }
}