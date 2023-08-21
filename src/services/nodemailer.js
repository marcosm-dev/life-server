"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport(transport[, defaults])
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'serpica.sl@gmail.com',
        pass: process.env.NODEMAILER_SECRET,
    },
});
// Verificar transport 'No necesario'
// transporter.verify()
//   .then(() => {
//     console.log('Nodemailer ready')
//   })
//   .catch(err => new Error ('Error al conectar nodemailer: ', err))
var sendEmail = function (_a) {
    var to = _a.to, subject = _a.subject, html = _a.html;
    var mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: to,
        subject: subject,
        html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error al enviar el correo:', error);
        }
        else {
            console.log('Correo enviado:', info.response);
        }
    });
};
sendEmail;
