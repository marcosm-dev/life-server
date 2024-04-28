import * as nodemailer from 'nodemailer'
import { type MailOptions } from 'nodemailer/lib/json-transport'
import { create } from 'express-handlebars'
import hbs from 'nodemailer-express-handlebars' // Asegúrate de importar la biblioteca correcta
import path from 'path'
import { GraphQLError } from 'graphql'
// const transporter = nodemailer.createTransport(transport[, defaults])

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'serpica.sl@gmail.com',
    pass: process.env.NODEMAILER_SECRET,
  },
})

// export const sendEmail = ({ to, subject, html }: MailOptions) => {
//   const mailOptions = {
//     from: process.env.ADMIN_EMAIL,
//     to,
//     subject,
//     html,
//   }

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error al enviar el correo:', error)
//       return error
//     } else {
//       console.log('Correo enviado:', info.response)
//       return info.response
//     }
//   })
// }

interface EmailParams {
  content: string
  to: string
  subject: string
  attachments?: string[]
  template: string
  vars: Record<string, any>
}

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  const { content, to, subject, attachments, template, vars } = params

  try {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_AUTH_USER,
      SMTP_AUTH_PASS,
      SEND_MAIL_ADDRESS,
      COMPANY_LOGO,
      COPANY_URL,
      COMPANY_NAME,
    } = process.env
    const transporter = nodemailer.createTransport({
      port: Number(SMTP_PORT),
      host: SMTP_HOST,
      auth: {
        user: SMTP_AUTH_USER,
        pass: SMTP_AUTH_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Ignora errores de certificado
      },
      secure: SMTP_SECURE,
    } as nodemailer.TransportOptions)
    let varUp = vars
    varUp['companyImg'] = COMPANY_LOGO
    varUp['companyUrl'] = COPANY_URL
    varUp['companyName'] = COMPANY_NAME
    varUp['companyLogo'] = COMPANY_LOGO

    const handlebarOptions = {
      viewEngine: create({
        extname: '.handlebars',
        partialsDir: path.resolve('./src/templates/email/partials/'),
        defaultLayout: false, // Especifica tu layout predeterminado aquí
        // Aquí puedes añadir más opciones
        helpers: {
          eq: (a: any, b: any, options: any) => {
            if (a === b) {
              return options.fn(this)
            } else {
              return options.inverse(this)
            }
          },
        },
      }),
      viewPath: path.resolve('./src/templates/email/'),
      extname: '.handlebars',
    }

    transporter.use('compile', hbs(handlebarOptions))
    const mailData: any = {
      from: SMTP_AUTH_USER,
      to: to,
      subject: subject,
      template: template,
      context: varUp,
    }
    if (attachments) {
      const dirPub = './public/media/' + attachments
      const directoryPath = path.join(dirPub)
      mailData['attachments'] = { path: directoryPath }
    }
    //console.log({ mailData })
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err: any, info: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  } catch (error) {
    const { message } = error as Error
    throw new GraphQLError(message)
  }
}
