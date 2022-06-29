const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/social_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "error in connecting to mongodb"));

db.once('open', function(){
    console.log('connected succesfully to mongdb');
});

module.exports = db;