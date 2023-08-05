import { authenticateUser } from './auth.js';
import mongoose from 'mongoose';
export async function createContext(initialContext) {
    return {
        mongoose,
        currentUser: await authenticateUser(initialContext.request)
    };
}
