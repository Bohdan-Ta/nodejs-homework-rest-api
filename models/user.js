const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { randomUUID } = require('crypto');

const { Role } = require('../libs/constans');

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value.toLowerCase()));
      },
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: { values: Object.values(Role), messege: 'Invalid role' },
      default: Role.USER,
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true);
      },
    },
    cloudID: {
      type: String,
      default: null,
    },
    isActive: { type: Boolean, default: true },
    verifyEmailToken: {
      type: String,
      default: randomUUID,
    },
  },

  { versionKey: false, timestamp: true },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
