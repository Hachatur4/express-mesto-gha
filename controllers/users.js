const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequesError = require('../errors/bad-request-error');

function addCookieToResponse(res, user) {
  const token = jwt.sign(
    { _id: user._id },
    'ded13ce1a4e548a829e2608470f868a5e89b9f2d9e4c2f2fdd270e785fb3bce6',
    { expiresIn: '7d' },
  );
  res
    .status(200)
    .cookie('jwt', token, { maxAge: 604800000, httpOnly: true });
}

function usersPasswordHandler(pass) {
  if (!pass) {
    throw new BadRequesError('Не указан пароль');
  }
  if (pass.length < 8) {
    throw new BadRequesError('Пароль должен быть не короче 8 символов');
  }
  return bcrypt.hash(pass, 10);
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError('Список пользователей пуст.');
      }
      return res.status(200).send({ "message": users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res) => {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      return res.status(200).send({ "message": user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res) => {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      return res.status(200).send({ "message": user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  usersPasswordHandler(req.body.password)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({ "message": 'Вы успешно зарегистрировались' }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new NotFoundError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new BadRequesError('Пользователь с данным email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne(email).select('+password')
    .then((user) => {
      if (!user) {
        throw new ForbiddenError('Такого пользователя не существует.');
      }
      bcrypt.compare(password, user.password, (error, isValid) => {
        if (!isValid) {
          throw new UnauthorizedError('Неправильные почта или пароль.');
        }
        addCookieToResponse(res, user);
        res.status(200).send({ "message": 'Вы успешно авторизованы' });
      });
    })
    .catch((err) => {
      res.clearCookie('jwt');
      next(err);
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ "message": user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new NotFoundError('Переданы некорректные данные при создании пользователя.'));
      } if (err.name === "CastError") {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ "message": user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new NotFoundError('Переданы некорректные данные при создании пользователя.'));
      } if (err.name === "CastError") {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      next(err);
    });
};
