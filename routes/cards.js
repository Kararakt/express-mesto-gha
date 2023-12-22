const router = require('express').Router();

const {
  createCardValidation,
  cardIdValidation,
} = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCardValidation, createCard);

router.delete('/:cardId', cardIdValidation, deleteCard);

router.put('/:cardId/likes', cardIdValidation, likeCard);

router.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
