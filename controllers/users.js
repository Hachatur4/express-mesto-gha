const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequesError = require('../errors/bad-request-error');
const VerificationError = require('../errors/verification-error');

function addCookieToResponse(res, user) {
  const token = jwt.sign(
    { _id: user._id },
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    { expiresIn: '7d' },
  );
  res
    .status(200)
    .cookie('jwt', token, { maxAge: 604800000, httpOnly: true });
}

function usersPasswordHandler(pass) {
  return bcrypt.hash(pass, 10);
}

module.exports.getUsers = (req, res, next) => {
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

module.exports.getUser = (req, res, next) => {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      return res.status(200).send({ "message": user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequesError('Некорректные данные.'));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      return res.status(200).send({ "message": user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequesError('Некорректные данные.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
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
    .then((user) => res.status(201).send({
      "name": user.name,
      "about": user.about,
      "avatar": user.avatar,
      "email": user.email,
      "_id": user._id,
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new VerificationError('Пользователь с данным email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Такого пользователя не существует.');
      }
      bcrypt.compare(password, user.password, (error, isValid) => {
        if (!isValid) {
          return next(new UnauthorizedError('Неправильные почта или пароль.'));
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

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ "message": user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные при создании пользователя.'));
      } if (err.name === "CastError") {
        return next(new BadRequesError('Пользователь по указанному id не найден.'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ "message": user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные при создании пользователя.'));
      } if (err.name === "CastError") {
        return next(new BadRequesError('Пользователь по указанному id не найден.'));
      }
      next(err);
    });
};
