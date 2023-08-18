import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'serpica.sl@gmail.com',
        pass: process.env.NODEMAILER_SECRET,
    },
});
export function sendEmail({ to, subject, html }) {
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to,
        subject,
        html,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
        }
        else {
            console.log('Correo enviado:', info.response);
        }
    });
}
