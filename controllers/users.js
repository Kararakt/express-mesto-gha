const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const ConflictError = require('../utils/ConflictError');
const UnauthorizedError = require('../utils/UnauthorizedError');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.status(200).send(users);
  } catch (error) {
    return next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).orFail(
      () => new NotFoundError('Пользователь по заданному ID не найден'),
    );

    return res.status(200).send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан не валидный ID'));
    }

    return next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь по заданному ID не найден'),
    );

    return res.status(200).send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан не валидный ID'));
    }

    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
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
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new ConflictError('Такой пользователь уже существует'));
    } else {
      next(error);
    }

    return next(error);
  }
};

module.exports.updateUserById = async (req, res, next) => {
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
    return next(error);
  }
};

module.exports.updateAvatarUserById = async (req, res, next) => {
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
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
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

    return res
      .status(200)
      .send({ data: { email: user.email, _id: user._id }, token });
  } catch (error) {
    if (error.message === 'NotAuthenticate') {
      next(new UnauthorizedError('Неправильный email или password'));
    }

    return next(error);
  }
};
