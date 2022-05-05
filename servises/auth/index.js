const jwt = require('jsonwebtoken');
const Users = require('../../repository/users');
const { HTTP_STATUS_CODE } = require('../../libs/constans');
const { CustomError } = require('../../middlewares/error-handler');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthServise {
  async create(body) {
    const user = await Users.findByEmail(body.email);
    if (user) {
      throw new CustomError(HTTP_STATUS_CODE.CONFLICT, 'User already exist');
    }
    const newUser = await Users.create(body);

    return {
      id: newUser.id,
      email: newUser.email,
      subscription: newUser.subscription,
      avatar: newUser.avatar,
    };
  }

  async login({ email, password }) {
    const user = await this.getUser(email, password);
    if (!user) {
      throw new CustomError(
        HTTP_STATUS_CODE.UNAUTHORIZED,
        '"Email or password is wrong"',
      );
    }
    const token = this.generateToken(user);
    await Users.updateToken(user.id, token);
    return { token };
  }

  async logout(id) {
    await Users.updateToken(id, null);
  }

  async getUser(email, password) {
    const user = await Users.findByEmail(email);
    if (!user) {
      return null;
    }

    if (!(await user?.isValidPassword(password))) {
      return null;
    }

    return user;
  }

  generateToken(user) {
    const payload = { id: user.id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return token;
  }

  async verifyUser(token) {}

  async reverifyEmail(email) {}
}
module.exports = new AuthServise();
