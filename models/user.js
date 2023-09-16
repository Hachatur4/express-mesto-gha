const mongoose = require('mongoose');
const validator = require('validator');

const userCard = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Некорректный email'],
    unique: true,
    required: [true, 'Не указан email'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Не указан пароль'],
  },
});

module.exports = mongoose.model('user', userCard);
