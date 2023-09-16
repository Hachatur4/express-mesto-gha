const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    if (!token) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    payload = jwt.verify(token, 'ded13ce1a4e548a829e2608470f868a5e89b9f2d9e4c2f2fdd270e785fb3bce6');
    const user = await User.findById(payload._id);
    if (!user) {
      throw new UnauthorizedError('Необходима авторизация');
    }
  } catch (err) {
    res.clearCookie('jwt');
    next(err);
  }
  req.user = payload;
  next();
};
