import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "staynest_super_secret_key_2024";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export { JWT_SECRET };
