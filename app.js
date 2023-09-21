require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const helmet = require('helmet');
const port = 3000;
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const cards = require('./routes/cards');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/error-handler');
const {
  loginValidator,
  createUserValidator,
} = require('./validators/validators');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('DB Active');
});

app.use(helmet());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use('*', (req, res, next) => {
  return next(new NotFoundError('Страница не найдена.'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
