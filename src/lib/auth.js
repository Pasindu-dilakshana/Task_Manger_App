import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable inside .env.local");
}

export const AUTH_COOKIE_NAME = "taskflow_token";

// Signs a JWT for a given user id. Expires in 7 days.
export function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, JWT_SECRET, { expiresIn: "7d" });
}

// Verifies a token and returns the decoded payload, or null if invalid/expired.
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Reads the auth cookie from a Next.js Request object and returns the userId, or null.
export function getUserIdFromRequest(request) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded?.sub || null;
}
