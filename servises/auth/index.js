const jwt = require('jsonwebtoken');
const Users = require('../../repository/users');
const { HTTP_STATUS_CODE } = require('../../libs/constans');
const { CustomError } = require('../../middlewares/error-handler');
const EmailService = require('../email/service');
const SenderNodemailer = require('../email/senders/nodemailer-sender');
const SenderSendGrid = require('../email/senders/sendgrid-sender');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthServise {
  async create(body) {
    const user = await Users.findByEmail(body.email);
    if (user) {
      throw new CustomError(HTTP_STATUS_CODE.CONFLICT, 'User already exist');
    }

    const newUser = await Users.create(body);

    const sender = new SenderSendGrid();
    const emailService = new EmailService(sender);

    try {
      await emailService.sendEmail(
        user.email,
        user.name,
        user.verificationToken,
      );
    } catch (error) {
      console.log(error);
    }

    return {
      id: newUser.id,
      email: newUser.email,
      subscription: newUser.subscription,
      avatar: newUser.avatar,
    };
  }

  async login({ email, password }) {
    const user = await this.getUser(email, password);
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
      throw new CustomError(HTTP_STATUS_CODE.NOT_FOUND, 'User not found');
    }

    if (!(await user?.isValidPassword(password))) {
      throw new CustomError(HTTP_STATUS_CODE.UNAUTHORIZED, 'Password is wrong');
    }

    if (!user.verify) {
      throw new CustomError(HTTP_STATUS_CODE.BAD_REQUEST, 'User not verified');
    }
    return user;
  }

  generateToken(user) {
    const payload = { id: user.id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return token;
  }

  async verifyUser(token) {
    const user = await Users.findByToken(token);
    if (!user) {
      throw new CustomError(HTTP_STATUS_CODE.BAD_REQUEST, 'User not found');
    }
    if (user && user.verify) {
      throw new CustomError(
        HTTP_STATUS_CODE.BAD_REQUEST,
        'User already verify',
      );
    }
    await Users.verifyUser(user.id, null);
    return user;
  }

  async reverifyEmail(email) {
    const user = await Users.findByEmail(email);
    if (!user) {
      throw new CustomError(
        HTTP_STATUS_CODE.NOT_FOUND,
        'Invalid mail. User not found',
      );
    }
    if (user && user.verify) {
      throw new CustomError(
        HTTP_STATUS_CODE.BAD_REQUEST,
        'User already verify',
      );
    }
    const sender = new SenderNodemailer();
    const emailService = new EmailService(sender);

    try {
      await emailService.sendEmail(
        user.email,
        user.name,
        user.verificationToken,
      );
    } catch (error) {
      throw new CustomError(
        HTTP_STATUS_CODE.SERVICE_UNAVAILABLE,
        'Error sending message',
      );
    }
  }
}

module.exports = new AuthServise();
