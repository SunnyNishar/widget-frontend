import { jwtDecode } from "jwt-decode";

// Check if token is expired
export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (err) {
    return true;
  }
}

// Get user info
export function getUserFromToken(token) {
  try {
    return jwtDecode(token);
  } catch (err) {
    return null;
  }
}
