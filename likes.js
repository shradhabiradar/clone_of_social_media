const express = require('express');

const router = express.Router();

const likecontroller = require('../controllers/like_controller');

router.get('/toggle', likecontroller.toggleLike);

module.exports = router;