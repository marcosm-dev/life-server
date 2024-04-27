import { InferSchemaType } from 'mongoose'
import { userTokenSchema } from '../models/UserToken.js'

export type IUserToken = InferSchemaType<typeof userTokenSchema>
