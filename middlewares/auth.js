/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

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
      return res.status(401).send({ message: 'Не авторизован' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'С токеном что-то не так' });
    }
  }

  req.user = payload;

  next();
};
