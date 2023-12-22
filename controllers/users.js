const bcrypt = require('bcryptjs');

const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const { generateToken } = require('../utils/jwt');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).orFail(
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
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    return res.status(201).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
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

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => NotFoundError('Пользователь по заданному ID не найден'));

    return res.status(200).send(user);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res
          .status(400)
          .send({ message: 'Ошибка валидации полей', error: error.message });

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

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => new NotFoundError('Пользователь по заданному ID не найден'));
    return res.status(200).send(user);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res
          .status(400)
          .send({ message: 'Ошибка валидации полей', error: error.message });

      case 'NotFoundError':
        return res.status(error.statusCode).send({ message: error.message });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(() => new Error('NotAuthenticate'));

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new Error('NotAuthenticate');
    }

    const token = generateToken({ _id: user._id });

    return res.status(200).send({ data: { email: user.email, _id: user._id }, token });
  } catch (error) {
    if (error.message === 'NotAuthenticate') {
      return res
        .status(401)
        .send({ message: 'Неправильные email или password' });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};
