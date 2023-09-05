const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      return res.status(200).send({ "message": cards });
    })
    .catch((err) => res.status(500).send({ "message": "Ошибка по умолчанию." }));
};

module.exports.deleteCard = (req, res) => {
  return Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ "message": "Указанного id нет в базе данных." });
      }
      return res.send({ "message": card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ "message": "Карточка по указанному id не найдена." });
      }
      return res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ "message": card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ "message": "Переданы некорректные данные при создании карточки." });
      }
      return res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ "message": "Указанного id нет в базе данных." });
      }
      return res.status(201).send({ "message": card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ "message": "Переданы некорректные данные для постановки лайка." });
      } if (err.name === "CastError") {
        return res.status(404).send({ "message": "Передан несуществующий id карточки." });
      }
      return res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ "message": "Указанного id нет в базе данных." });
      }
      res.status(200).send({ "message": card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ "message": "Переданы некорректные данные для снятии лайка." });
      } if (err.name === "CastError") {
        return res.status(404).send({ "message": "Передан несуществующий id карточки." });
      }
      return res.status(500).send({ "message": "Ошибка по умолчанию." });
    });
};
