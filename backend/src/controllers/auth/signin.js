import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import { UserZodSchema } from "../../schemaTypes/index.js";

export const signin = async (req, res) => {
   const userSchema = UserZodSchema.safeParse(req.body);

   if (!userSchema.success) {
      return res.status(411).json({
         message: "Invalid input",
         error: userSchema.error.errors.map((e) => e.message),
      });
   }

   try {
      const existingUser = await prisma.user.findFirst({
         where: userSchema.data.email,
      });

      if (existingUser) {
         throw new Error("User already exists with provided email");
      }

      const hashedPassword = await hash(userSchema.data.password, 10);

      const newUser = {
         name: userSchema.data.name,
         email: userSchema.data.email,
         password: hashedPassword,
         containers: [],
         imgUrl: userSchema.data.imgUrl,
      };

      const user = await prisma.user.create({
         data: newUser,
      });

      if (user) {
         const token = jwt.sign(
            { email: user.email, name: user.name },
            process.env.JWT_SECRET
         );
         res.status(200).json({
            message: "User created successfully",
            user: {
               name: user.name,
               email: user.email,
               containers: user.containers,
               imgUrl: user.imgUrl,
            },
            token,
         });
      }
   } catch (err) {
      res.status(500).json({
         message: "Failed to create the user",
         error: err,
      });
   }
};
