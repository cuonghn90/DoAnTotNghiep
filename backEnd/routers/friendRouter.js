const express = require('express');
const router = express.Router()
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getFriends, getFriend, getUserAndCheckFriend, deleteRequestAddFriend, acceptRequestAddFriend, requestAddFriend, updateNumberGiveGiftFriend } = require('../controller/friendController');

router.get('/', authMiddleware, getFriends)
router.get('/search-friend', authMiddleware, getUserAndCheckFriend)
router.get('/:userFriendId', authMiddleware, getFriend)

router.post('/', authMiddleware, requestAddFriend)

router.put('/', authMiddleware, acceptRequestAddFriend)
router.put('/update-give-gift', authMiddleware, updateNumberGiveGiftFriend)

router.delete('/:userFriendId', authMiddleware, deleteRequestAddFriend)

module.exports = router;