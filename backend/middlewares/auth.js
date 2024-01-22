import jwt from "jsonwebtoken";

export const tokenVerification = (req, res, next) => {
  const token = req.headers.authorization;
  const verifyToken = jwt.verify(token, "paytm", function (err, decoded) {
    if (err) {
      return res.json({
        message: "Invalid token",
      });
    } else {
      next();
    }
  });
};
