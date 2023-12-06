const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarUserById,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUserById);

router.patch('/me/avatar', updateAvatarUserById);

module.exports = router;
