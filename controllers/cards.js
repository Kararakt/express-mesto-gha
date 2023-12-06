const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });

    return res.status(201).send(newCard);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res
          .status(400)
          .send({ message: 'Ошибка валидации полей', error: error.message });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId).orFail(
      () => new NotFoundError('Карточка по заданному ID не найдена'),
    );

    return res.status(200).send(card);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(400).send({ message: 'Передан не валидный ID' });

      case 'NotFoundError':
        return res.status(error.statusCode).send({ message: error.message });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new NotFoundError('Карточка по заданному ID не найдена'));

    return res.status(200).send(card);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(400).send({ message: 'Передан не валидный ID' });

      case 'NotFoundError':
        return res.status(error.statusCode).send({ message: error.message });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new NotFoundError('Карточка по заданному ID не найдена'));

    return res.status(200).send(card);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(400).send({ message: 'Передан не валидный ID' });

      case 'NotFoundError':
        return res.status(error.statusCode).send({ message: error.message });

      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};
