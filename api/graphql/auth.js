import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const APP_SECRET = 'uM3Vyz4DUIDQky-NrTBx3Xqa_xsSF-EU'
 
export async function authenticateUser(request) {
  const headers = request.headers

  console.log(headers)
  const token = headers.get('authorization')?.split(' ')[1]

  if (!token) return null

    try {
      const tokenPayload = jwt.verify(token, APP_SECRET)
      const userId = String(tokenPayload.userId)
      // Assuming you're using Mongoose for MongoDB
      const user = await User.findById(userId)
      return user
    } catch (error) {
      // Token verification failed, or user not found
      return null
    }
}