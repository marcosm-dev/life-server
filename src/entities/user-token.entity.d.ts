import { userTokenSchema } from './user-token.entity.js';

export type IUserToken = InferSchemaType<typeof userTokenSchema>;
