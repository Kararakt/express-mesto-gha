/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');

module.exports = (req, res, next) => {
  let payload;

  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('NotAuthenticate');
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, 'dev_secret');
  } catch (error) {
    if (error.message === 'NotAuthenticate') {
      next(new UnauthorizedError('Требуется авторизация'));
    }

    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('С токеном что-то не так'));
    }
  }

  req.user = payload;

  next();
};
