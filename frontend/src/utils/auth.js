import { jwtDecode } from 'jwt-decode';

export const getUserRole = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.role || 'user';
  } catch {
    return 'user';
  }
};
