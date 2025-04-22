var nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const mailData = {
  mail: "noreply@spacedesign-italia.it",
  pass: "@Gemellini04",
};

const transporter = nodemailer.createTransport({
  host: "smtp.ionos.it",
  port: 587,
  secure: false,
  auth: {
    user: mailData.mail,
    pass: mailData.pass,
  },
});

class EmailService {
  static sendStafferWelcomeMail(email, name, surname, password) {
    const emailTemplatePath = path.join(
      __dirname,
      "EmailTemplate/WelcomeStafferModel.html"
    );
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

    let htmlContent = emailTemplate
      .replace("${name}", name)
      .replace("${surname}", surname)
      .replace("${email}", email)
      .replace("${password}", password);

    const sendStafferWelcomeMail = {
      from: `Space Design Italia <${mailData.mail}>`,
      to: email,
      subject: "Benvenuto a bordo del team di Space Design Italia",
      text: "Benvenuto nel team di Space Design Italia! Siamo entusiasti di averti con noi.",
      html: htmlContent,
    };

    transporter.sendMail(sendStafferWelcomeMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
  }

  static sendOtpCode(email, otpCode) {
    const emailTemplatePath = path.join(
      __dirname,
      "EmailTemplate/OtpCodeMail.html"
    );
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

    let htmlContent = emailTemplate.replace("${otpCode}", otpCode);

    const mailOptions = {
      from: `Space Design Italia <${mailData.mail}>`,
      to: email,
      subject: "Codice OTP per Cambio Password",
      text: `Il tuo codice OTP per il cambio password è: ${otpCode}`,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
  }

  static sendPasswordResetConfirmation(email) {
    const emailTemplatePath = path.join(
      __dirname,
      "EmailTemplate/EmailReset.html"
    );
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

    let htmlContent = emailTemplate;

    const mailOptions = {
      from: `Space Design Italia <${mailData.mail}>`,
      to: email,
      subject: "Importante: Conferma Modifica Password",
      text: `Gentile dipendente, La informiamo che è stata effettuata una modifica della password del Suo account. Se non ha effettuato Lei questa modifica, La preghiamo di procedere immediatamente con il reset della password.`,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
  }
}
module.exports = EmailService;
