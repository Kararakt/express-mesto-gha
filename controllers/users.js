const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь по заданному ID не найден'),
    );

    return res.status(200).send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(400).send({ message: 'Передан не валидный ID' });

      case 'NotFoundError':
        return res.status(error.statusCode).send({ message: error.message });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });

    return res.status(201).send(newUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res
          .status(400)
          .send({ message: 'Ошибка валидации полей', error: error.message });

      case 'MongoServerError':
        return error.code === 11000
          ? res
            .status(409)
            .send({ message: 'Такой пользователь существует в базе данных' })
          : res
            .status(500)
            .send({ message: 'Ошибка соединения с базой данных' });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports.updateUserById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(userId, { name, about }).orFail(
      () => new NotFoundError('Пользователь по заданному ID не найден'),
    );
    return res.status(200).send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(400).send({ message: 'Передан не валидный ID' });

      case 'NotFoundError':
        return res.status(error.statusCode).send({ message: error.message });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports.updateAvatarUserById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(userId, { avatar }).orFail(
      () => new NotFoundError('Пользователь по заданному ID не найден'),
    );
    return res.status(200).send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(400).send({ message: 'Передан не валидный ID' });

      case 'NotFoundError':
        return res.status(error.statusCode).send({ message: error.message });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};
