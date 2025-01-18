import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../db/prisma.js";

export const login = async (req, res) => {
   const { email, password } = req.body;

   if (!email.length || !password.length) {
      return res.status(411).json({
         message: "Input not provided",
      });
   }

   try {
      const user = await prisma.user.findUnique({
         where: { email },
      });

      if (!user) {
         throw new Error("User not found");
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);

      if (!isCorrectPassword) {
         throw new Error("Password is incorrect");
      }

      const token = jwt.sign(
         { email: user.email, name: user.name },
         process.env.JWT_SECRET
      );

      res.status(200).json({
         message: "Login successfully",
         user: {
            name: user.name,
            email: user.email,
            imgUrl: user.imgUrl,
         },
         token,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Failed to login",
         error: { err, message: err.message },
      });
   }
};
