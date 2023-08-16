import nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/json-transport/index.js'

// const transporter = nodemailer.createTransport(transport[, defaults])

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: 'serpica.sl@gmail.com',
    pass: process.env.NODEMAILER_SECRET,
  },
})

// Verificar transport 'No necesario'

// transporter.verify()
//   .then(() => {
//     console.log('Nodemailer ready')
//   })
//   .catch(err => new Error ('Error al conectar nodemailer: ', err))


// Enviar el correo electrónico
export function sendEmail({ to, subject, html }: MailOptions) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    html,
  }

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error)
    } else {
      console.log('Correo enviado:', info.response)
    }
  })
}
