import express, { type Express } from 'express'
import session, { type SessionOptions } from 'express-session'
import compression from 'compression'
import cors from 'cors'
import { yoga } from './config/yoga.js'

const sessionOptions: SessionOptions = {
  secret: process.env.SECRET ?? 'secretpassword',
  resave: false,
  saveUninitialized: false,
}

export const attachExpressJS = async (app: Express) => {
  console.info('Iniciando servidor')
  app
    .use(cors({ credentials: true, origin: true }))
    .use(session(sessionOptions))
    .use(compression())
    .use(express.static('files'))
    .use('/static', express.static('public'))
    .get('/', (_, res) => res.send('Serpica API'))
    .use(yoga.graphqlEndpoint, yoga)
}
