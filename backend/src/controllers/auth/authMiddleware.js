import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { TokenZodSchema } from "../../schemaTypes/index.js";

export const authMiddleware = async (req, res, next) => {
   const authHeaders = req.headers.authorization;

   const tokenSchema = TokenZodSchema.safeParse(authHeaders?.split(" ")[1]);

   if (!tokenSchema.success) {
      return res.send(411).json({
         message: "Invalid token",
         error: tokenSchema.error,
      });
   }

   try {
      const token = tokenSchema.data;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decodedToken);

      req.userData = decodedToken;
      next();
   } catch (err) {
      console.log(err);
      let errMessage = err.message;

      if (err.name === "JsonWebTokenError") {
         errMessage = "Invalid token";
      }

      res.status(500).json({
         message: "Error occured at authentication",
         error: {
            err,
            message: errMessage,
         },
      });
   }
};
