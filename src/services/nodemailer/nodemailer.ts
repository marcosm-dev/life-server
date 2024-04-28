import * as nodemailer from 'nodemailer'
import { type MailOptions } from 'nodemailer/lib/json-transport'
import { create } from 'express-handlebars'
import hbs from 'nodemailer-express-handlebars' // Asegúrate de importar la biblioteca correcta
import path from 'path'
import { GraphQLError } from 'graphql'
// const transporter = nodemailer.createTransport(transport[, defaults])

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_AUTH_USER, SMTP_AUTH_PASS, COMPANY_LOGO, COMPANY_URL, COMPANY_NAME } = process.env as { [key: string]: string | number }

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_AUTH_USER,
    pass: SMTP_AUTH_PASS,
  },
} as nodemailer.TransportOptions)

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
    let varUp = vars
    varUp['companyImg'] = COMPANY_LOGO
    varUp['companyUrl'] = COMPANY_URL
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
