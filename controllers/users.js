const user = require('../models/user');
const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        return res.status(404).send({ "message": "Список пользователей пуст" });
      }
      return res.status(200).send({ "message": users });
    })
    .catch((err) => {
      res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};

module.exports.getUserById = (req, res) => {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(400).send({ "message": "Указанного id нет в базе данных." });
      }
      return res.status(200).send({ "message": user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ "message": "Пользователь по указанному id не найден." });
      }
      return res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ "message": user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ "message": "Переданы некорректные данные при создании пользователя." });
      }
      return res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ "message": user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ "message": "Переданы некорректные данные пользователя." });
      } if (err.name === "CastError") {
        return res.status(404).send({ message: "Пользователь по указанному id не найден." });
      }
      return res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ "message": user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ "message": "Переданы некорректные данные пользователя." });
      } if (err.name === "CastError") {
        res.status(404).send({ "message": "Пользователь по указанному id не найден." });
      }
      return res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};
