const nodemailerAuth = require("../config/auth").nodemailerAuth;
var nodemailer = require('nodemailer');
var ejs = require("ejs");
var fs = require('fs');
var transporter = nodemailer.createTransport({
  host: 'mail-b01.cloudmailbox.in',
  port: 25,
  secureConnection: false,
  auth: nodemailerAuth
});

module.exports = {
  sendContractEmail: function (email, result, coinName, smartcontractType) {
    ejs.renderFile(__dirname + '/emailerTemplates/contractMailer.ejs', {
      email: email
    }, (err, data) => {
      var mailOptions = {
        from: "contract@mycontract.com",
        to: email,
        subject: "Mycontract.co - Smart Contract generation(" + coinName + "-" + smartcontractType + ")",
        html: data,
        attachments: [{
          filename: "coin.sol",
          content: result,
          contentType: "text/plain"
        }]
      };
      triggerEmail(mailOptions);
    });
  },

  sendEmail: function (sendermail, recipientmail, subject, content) {
    var mailOptions = {
      from: sendermail,
      to: recipientmail,
      subject: subject,
      text: content
    };
    triggerEmail(mailOptions);
  },

  sendVerificationMail: function (req, recipientmail, name, userhash) {
    console.log("mailOptionsmailOptions22222211");
    var link = "http://" + req.get('host') + "/verifyAccount?resetId=" + userhash + "&email=" + recipientmail;
    // var link = "http://" + "mycontract.co" + "/verifyAccount?resetId=" + userhash + "&email=" + recipientmail;

    ejs.renderFile(__dirname + '/emailerTemplates/emailVerification.ejs', {
      name: name,
      link: link
    }, (err, data) => {
      console.log(err,"errr");
      var mailOptions = {
        from: "emailverification@mycontract.co",
        to: recipientmail,
        subject: "Email Verification",
        html: data
      };
      console.log(mailOptions,"mailOptionsmailOptions");
      triggerEmail(mailOptions);
    });
  },

  sendUserVerificationMail: function (req, recipientmail, name, userhash) {
    console.log("mailOptionsmailOptions222222");
    var link = "http://" + req.get('host') + "/verifyMail?verificationId=" + userhash;
    ejs.renderFile(__dirname + '/emailerTemplates/emailVerification.ejs', {
      name: name,
      link: link
    }, (err, data) => {
      console.log(err,"err2");
      var mailOptions = {
        from: "emailverification@mycontract.co",
        to: recipientmail,
        subject: "Email Verification",
        html: data
      };
      console.log(mailOptions,"mailOptionsmailOptions222222");
      triggerEmail(mailOptions);
    });
  },
  //OTP
  sendConfirmationOTP: function (recipientmail, otp) {
    ejs.renderFile(__dirname + '/emailerTemplates/packageOTPMailer.ejs', {
      otp: otp
    }, (err, data) => {
      console.log(err);
      var mailOptions = {
        from: "packagePayment@mycontract.co",
        to: recipientmail,
        subject: "Package Payment OTP",
        html: data
      };
      triggerEmail(mailOptions);
    });
  },
  //forgot password mailer
  forgotPasswordMailer: function (req, recipientmail, userhash) {
    console.log(recipientmail, userhash)
    var link = "http://" + req.get('host') + "/resetPassword?resetId=" + userhash + "&email=" + recipientmail;
    ejs.renderFile(__dirname + '/emailerTemplates/forgotPassword.ejs', {
      link: link
    }, (err, data) => {
      console.log(err);
      var mailOptions = {
        from: "forgotPassword@mycontract.co",
        to: recipientmail,
        subject: "reset Password link",
        html: data
      };
      triggerEmail(mailOptions);
    });
  },
  // contact us
  contactUs: function (req) {
    ejs.renderFile(__dirname + '/emailerTemplates/contactUsAdmin.ejs', {
      contactName: req.body.contactName,
      contactMessage: req.body.contactMessage,
      email: req.body.contactEmail
    }, (err, data1) => {
      ejs.renderFile(__dirname + '/emailerTemplates/contactUs.ejs', {
        contactName: req.body.contactName,
        // contactMessage: req.body.contactMessage
      }, (err, data2) => {
        console.log(err);
        var mailOptions1 = {
          from: "admin@mycontract.co",
          to: req.body.contactEmail,
          subject: "Mycontract enquiry",
          html: data2
        };
        var mailOptions2 = {
          from: "support@mycontract.co",
          to: 'info@xinfin.org',
          subject: "Mycontract enquiry",
          html: data1
        };
        triggerEmail(mailOptions1);
        triggerEmail(mailOptions2);
      });
    })
  },

}

function triggerEmail(mailOptions) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error,"error");
    } else {
      console.log(info.response,"info.response")
      console.log("Email sent: " + info.response);
      return;
    }
  });
}
