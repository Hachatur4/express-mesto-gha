const express = require('express');
const mongoose = require('mongoose');
const app = express();
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

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('DB Active');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use('*', (req, res) => {
  return next(new NotFoundError('Страница не найдена.'));
});

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
