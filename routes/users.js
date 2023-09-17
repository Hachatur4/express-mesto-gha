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
//Почему здесь передается cardId ? Тут же передается именно userId.
router.get('/:userId', idValidator, getUserById);
router.patch('/me', updateUserInfoValidator, updateUserInfo);
router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

module.exports = router;
