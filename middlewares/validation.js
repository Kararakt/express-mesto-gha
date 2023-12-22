/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.registrationValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(
      /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]+#?)$/,
    ),
  }),
});

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.updateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .regex(/^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]+#?)$/)
      .required(),
  }),
});

module.exports.userByIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
});

module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .regex(/^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]+#?)$/)
      .required(),
  }),
});

module.exports.cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});
