import { authenticateUser } from './auth.js';

export async function createContext(request) {
  return {
    currentUser: await authenticateUser(request)
  };
}
