const Card = require('../models/card');

const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');
const BadRequestError = require('../utils/BadRequestError');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    return next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });

    return res.status(201).send(newCard);
  } catch (error) {
    return next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const card = await Card.findById(cardId).orFail(
      () => new NotFoundError('Карточка по заданному ID не найдена'),
    );

    if (card.owner.toString() !== userId) {
      throw new Error('Forbidden');
    }

    const cardDelete = await Card.findByIdAndDelete(cardId).orFail(
      () => new NotFoundError('Карточка по заданному ID не найдена'),
    );
    return res.status(200).send(cardDelete);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан не валидный ID'));
    }

    if (error.message === 'Forbidden') {
      next(new ForbiddenError('Нельзя удалить чужую карточку'));
    }

    return next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new NotFoundError('Карточка по заданному ID не найдена'));

    return res.status(200).send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан не валидный ID'));
    }

    return next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new NotFoundError('Карточка по заданному ID не найдена'));

    return res.status(200).send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан не валидный ID'));
    }

    return next(error);
  }
};
