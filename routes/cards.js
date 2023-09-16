const router = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidator,
  idValidator,
} = require('../validators/validators');

router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:cardId', idValidator, deleteCard);
router.put('/:cardId/likes', idValidator, likeCard);
router.delete('/:cardId/likes', idValidator, dislikeCard);

module.exports = router;
