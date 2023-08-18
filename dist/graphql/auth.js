import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import User from '../entities/user.entity.js';
import UserToken from '../entities/user-token.entity.js';
export async function authenticateUser(request) {
    const header = request.headers.get('Authorization');
    if (header !== null) {
        const [, token] = header.split(' ');
        if (!token)
            return new GraphQLError('No hay ninguna sesión iniciada');
        const tokenPayload = jwt.verify(token, process.env.SECRET);
        const userId = tokenPayload.userId;
        try {
            const [userResponse, tokenResponse] = await Promise.all([User.findById(userId), UserToken.findOne({ token })]);
            if (typeof tokenResponse === 'undefined' || !userResponse)
                return new GraphQLError('Tu sesión ha caducado, por favor, vuelve a iniciar sesión');
            userResponse.token = tokenResponse.token;
            return userResponse;
        }
        catch (error) {
            return new GraphQLError(`No estas autenticado, por favor, inicia sesión: ${error}`);
        }
    }
    return null;
}
