const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.toggleLike = async function(req, res){
    try{
        let likeable;
        let deleted = true;

        if(req.query.type == Post){
            let likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            let likeable = await Comment.findById(req.query.id).populate('likes')
        }

        let existingLike = await Like.findById({
            user: req.query._id,
            likeable: req.query.id,
            onModel: req.query.type
        });

        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        }else{
           let newLike = await Like.create({
               user: req.query._id,
               likeable: req.query.id,
               onModel: req.query.type
           })
           likeable.likes.push(newLike._id);
           likeable.save();
        }


    }catch(err){
        console.log('error in liking the post', err);
        return res.json(500, {
            message: 'error in liking the post'
        })
    }
}
