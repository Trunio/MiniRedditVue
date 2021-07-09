const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 25,
  auth: {
    user: "apikey",
    pass: "",
  },
});
const remind = async function main(email, pass) {
  let info = await transporter.sendMail({
    from: "<kondrat.studia@interia.pl>",
    to: email,
    subject: "Password Reset",
    text: "Password Reset",
    html: `<p>Twoje hasło to ${pass}</p>`,
  });
  console.log("Message sent: %s", info.messageId);
};
const verify = async function main(email, uuid) {
  let info = await transporter.sendMail({
    from: "<kondrat.studia@interia.pl>",
    to: email,
    subject: "Aktywuj Konto",
    text: "Aktywuj Konto",
    html: `<p>Aktywuj konto</p> <a href="http://localhost:8080/verify/${uuid}">http://localhost:8080/verify/${uuid}</a>`,
  });
  console.log("Message sent: %s", info.messageId);
};

module.exports = {
  remind,
  verify,
};
