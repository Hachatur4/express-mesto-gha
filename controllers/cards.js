const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequesError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      return res.status(200).send({ "message": cards });
    })
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку.');
      }
      return Card.deleteOne(card, { new: true })
        .then((result) => {
          return res.status(200).send(card);
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequesError('Карточка по указанному id не найдена.'));
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ "message": card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      return res.status(201).send({ "message": card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные для постановки лайка.'));
      } if (err.name === "CastError") {
        return next(new BadRequesError('Передан несуществующий id карточки.'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      res.status(200).send({ "message": card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные для снятии лайка.'));
      } if (err.name === "CastError") {
        return next(new BadRequesError('Передан несуществующий id карточки.'));
      }
      next(err);
    });
};
