import mongoose from 'mongoose';
export const userTokenSchema = new mongoose.Schema({
    token: String,
    user: mongoose.Types.ObjectId,
    type: {
        type: String,
        default: 'SIGN_IN',
        enum: ['RECOVERY', 'SIGN_IN'],
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    expiresDate: Date
});
const UserToken = mongoose.model('UserToken', userTokenSchema);
const indexOptions = {
    name: 'Delete expiresAt index',
    background: true,
    sparce: true,
    expireAfterSeconds: 0
};
export async function createTokenIndex() {
    await UserToken.collection.createIndex({ expiresDate: 1 }, indexOptions);
}
export default UserToken;
