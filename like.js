const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    likeable:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refpath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['post', 'Comment']
    }
});


const Like = mongoose.model('Like', likeSchema);
module.exports = Like;