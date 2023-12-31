const router = require('express').Router();

const {
  getUsers,
  getUser,
  getUserById,
  updateUserById,
  updateAvatarUserById,
} = require('../controllers/users');

const {
  updateUserValidation,
  updateUserAvatar,
  userByIdValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', userByIdValidation, getUserById);

router.patch('/me', updateUserValidation, updateUserById);

router.patch('/me/avatar', updateUserAvatar, updateAvatarUserById);

module.exports = router;
