const jwt = require('jsonwebtoken');
const User = require('../../repository/users');
const { HTTP_STATUS_CODE } = require('../../libs/constans');
const { CustomError } = require('../../middlewares/error-handler');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthServise {
  async create(body) {}
  async login({ email, password }) {}
  async logout(id) {}
}
module.exports = new AuthServise();
