const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        return res.status(404).send({ data: 'Список пользователей пуст' });
      }
      return res.status(200).send({ data: users });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUserById = (req, res) => {
  return User.findById(req.params.userId)
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ data: 'Пользователь по указанному id не найден.' });
      }
      return res.status(500).send({ data: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ data: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ data: err.message });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ data: 'Переданы некорректные данные пользователя.' });
      } if (err.name === 'CastError') {
        res.status(404).send({ data: 'Пользователь по указанному id не найден.' });
      }
      return res.status(500).send({ data: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ data: 'Переданы некорректные данные пользователя.' });
      } if (err.name === 'CastError') {
        res.status(404).send({ data: 'Пользователь по указанному id не найден.' });
      }
      return res.status(500).send({ data: err.message });
    });
};
