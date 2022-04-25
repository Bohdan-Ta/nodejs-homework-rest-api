const { Schema, model } = require('mongoose');
const { Role } = require('../libs/constans');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: { type: String, default: 'Guest' },
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
userSchema.method.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = model('user', userSchema);

module.exports = User;
