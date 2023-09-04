const router = require('express').Router();
const {
  getUser,
  createUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
