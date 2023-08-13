import jwt from 'jsonwebtoken';
import User from '../entities/user.entity.js';
export async function authenticateUser(request) {
    const header = request.headers.get('Authorization');
    if (header !== null) {
        const token = header.split(' ')[1];
        const tokenPayload = jwt.verify(token, process.env.SECRET);
        const userId = tokenPayload.userId;
        const user = await User.findById(userId);
        return user.access ? user : null;
    }
    return null;
}
