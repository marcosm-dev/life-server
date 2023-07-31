import jwt from 'jsonwebtoken';
export const APP_SECRET = 'this is my secret';
export async function authenticateUser(prisma, request) {
    const header = request.headers.get('authorization');
    if (header !== null) {
        const token = header.split(' ')[1];
        const tokenPayload = jwt.verify(token, APP_SECRET);
        const userId = tokenPayload.userId;
        return await prisma.user.findUnique({ where: { id: userId } });
    }
    return null;
}
