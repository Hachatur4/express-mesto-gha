const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        return res.status(404).send({ data: 'Список карточек пуст' });
      }
      return res.status(200).send({ data: cards });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  return Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ data: 'Пользователь по указанному id не найден.' });
      }
      return res.status(500).send({ data: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ data: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ data: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ data: 'Переданы некорректные данные для постановки лайка.' });
      } if (err.name === 'CastError') {
        res.status(404).send({ data: 'Передан несуществующий id карточки.' });
      }
      return res.status(500).send({ data: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.user._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ data: 'Переданы некорректные данные для снятии лайка.' });
      } if (err.name === 'CastError') {
        res.status(404).send({ data: 'Передан несуществующий id карточки.' });
      }
      return res.status(500).send({ data: err.message });
    });
};
