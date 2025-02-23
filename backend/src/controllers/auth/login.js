import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";

export const login = async (req, res) => {
   const { token } = req.body;

   if (!token) {
      return res.status(411).json({
         message: "Token not provided",
      });
   }

   try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log(decodedToken);

      const { email } = decodedToken;

      const user = await prisma.user.findUnique({
         where: { email },
      });

      if (!user) {
         throw new Error("User not found");
      }

      const newToken = jwt.sign({ email }, process.env.JWT_SECRET);

      res.status(200).json({
         message: "Login successfully",
         user: {
            name: user.name,
            email: user.email,
            imgUrl: user.imgUrl,
         },
         token: newToken,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Failed to login",
         error: { err, message: err.message },
      });
   }
};
