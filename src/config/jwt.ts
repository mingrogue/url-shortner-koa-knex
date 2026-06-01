import httpError from "http-errors";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const generateToken = async (payload: {
  [key: string]: string | number;
}) => jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

export const validateJwt = async (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { [key: string]: string };
  } catch {
    throw new httpError.Unauthorized("plese provide a valid JWT token");
  }
};
