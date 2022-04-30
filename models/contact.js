const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');
const { LIMIT_NUMBERS_CONTACT } = require('../libs/constans');

const contactSchema = new Schema(
  {
    name: { type: String, required: [true, 'Set name for contact'] },
    email: { type: String, required: [true, 'Set email for contact'] },
    phone: {
      type: String,
      min: LIMIT_NUMBERS_CONTACT.min,
      max: LIMIT_NUMBERS_CONTACT.max,
      required: true,
    },
    favorite: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.plugin(mongoosePaginate);
const Contact = model('Contact', contactSchema);

module.exports = Contact;
