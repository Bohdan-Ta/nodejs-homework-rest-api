const { sgMail } = require('@sendgrid/mail');

class SenderSendGrid {
  async sent(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const result = await sgMail.send({
      ...msg,
      from: process.env.SENGRID_FROM,
    });
    return result;
  }
}
module.exports = SenderSendGrid;
