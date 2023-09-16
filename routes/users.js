const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const {
  updateUserInfoValidator,
  updateUserAvatarValidator,
  idValidator,
} = require('../validators/validators');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', idValidator, getUserById);
router.patch('/me', updateUserInfoValidator, updateUserInfo);
router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

module.exports = router;
