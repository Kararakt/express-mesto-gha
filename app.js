const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const {
  loginValidation,
  registrationValidation,
} = require('./middlewares/validation');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { error } = require('./middlewares/error');
const NotFoundError = require('./utils/NotFoundError');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());

mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', loginValidation, login);
app.post('/signup', registrationValidation, createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', auth, () => {
  throw new NotFoundError('Такого пути не существует!');
});

app.use(errors());

app.use(error);

app.listen(PORT);
