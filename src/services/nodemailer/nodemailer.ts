import * as nodemailer from 'nodemailer'
import { type MailOptions } from 'nodemailer/lib/json-transport'

// const transporter = nodemailer.createTransport(transport[, defaults])

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'serpica.sl@gmail.com',
    pass: process.env.NODEMAILER_SECRET
  }
})

// Verificar transport 'No necesario'

// transporter.verify()
//   .then(() => {
//     console.log('Nodemailer ready')
//   })
//   .catch(err => new Error ('Error al conectar nodemailer: ', err))

export const sendEmail = ({ to, subject, html }: MailOptions) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    html
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error)
      return error
    } else {
      console.log('Correo enviado:', info.response)
      return info.response
    }
  })
}
