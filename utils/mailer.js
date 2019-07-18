const Mailgun = require('mailgun-js');
const apiKey = process.env.MAILGUN_API;
const domain = process.env.MAILGUN_DOMAIN;
const fromAddress = process.env.MAILGUN_FROM_ADDRESS;

const User = require('../models/User.js');

const mailgun = new Mailgun({apiKey: apiKey, domain: domain});

class Mailer {
  constructor(user) {
    this.user = user;
    this.data = {
      from: fromAddress,
      to: user.email,
    };
  }

  async getUser() {
    try {
      return await User.findOne({email: this.user.email});
    } catch (err) {
      throw err;
    };
  }

  async forgotPassword() {
    const user = await this.getUser();

    const link = 'testlink.com';

    this.data.subject = 'Reset your password';
    this.data.text = `Hey ${user.firstName}!\nClick the link to reset your password!\n${link}\nIf you did not request a password change, please ignore this email.`;

    mailgun.messages().send(this.data, function(err, body) {
      if (err) throw err;

      console.log('Message Sent!');
    });
  }
}

module.exports = Mailer;
