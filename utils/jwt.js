const jwt = require('jsonwebtoken');

module.exports.generateToken = (payload) => jwt.sign(payload, 'dev_secret', {
  expiresIn: '7d',
});
