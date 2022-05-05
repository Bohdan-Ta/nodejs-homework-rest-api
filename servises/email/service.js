const Mailgen = require('mailgen');

class EmailServise {
  constructor(sender) {
    this.sender = sender;
    this.link = `http://localhost:3000`;
    this.mailgen = new Mailgen({
      theme: 'default',
      produc: { name: `My app`, link: this.link },
    });
  }

  createEmailTemplate(username, token) {
    const email = {
      body: {
        name: username,
        intro: "Welcome to My app! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Mailgen, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/api/auth/verify-email/${token}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return this.mailgen.generate(email);
  }

  async sendEmail(email, username, token) {
    const emailTemplate = this.createEmailTemplate(username, token);
    const message = {
      to: email,
      subject: 'Welcome to My app',
      html: emailTemplate,
    };
    try {
      const result = await this.sender.send(message);
      console.log(result);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
