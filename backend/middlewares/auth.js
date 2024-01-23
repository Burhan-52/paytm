import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const tokenVerification = (req, res, next) => {
  const token = req.headers.authorization;
  const verifyToken = jwt.verify(token, JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.json({
        message: "Invalid token",
      });
    } else {
      next();
    }
  });
};
